import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import { getCloudinaryVideoDuration } from '../../utils/getCloudinaryVideoDuration'
import Course, { ILecture } from './course.model'
import LectureModel from './Lecture.model'
import UserProgressModel from './UserProgress.model'

export const handleCourseCreation = async (
  body: any,
  files: Express.Multer.File[]
) => {
  const { title, description, price, instructor, sections: sectionsJSON } = body

  if (!files || files.length === 0) {
    throw new Error('No files provided')
  }

  // Upload thumbnail and intro video in parallel
  const [thumbnailUpload, introVideoUpload] = await Promise.all([
    (async () => {
      const thumbnailFile = files.find((file) => file.fieldname === 'thumbnail')
      if (!thumbnailFile) throw new Error('Thumbnail is required')
      return uploadToCloudinary(
        thumbnailFile.buffer,
        'thumbnails',
        `thumbnail-${Date.now()}`,
        'image'
      )
    })(),
    (async () => {
      const introVideoFile = files.find(
        (file) => file.fieldname === 'introVideo'
      )
      if (!introVideoFile) throw new Error('Intro video is required')
      return uploadToCloudinary(
        introVideoFile.buffer,
        'introVideos',
        `introVideo-${Date.now()}`,
        'video'
      )
    })(),
  ])

  const parsedSections: any[] = JSON.parse(sectionsJSON)

  // Process all sections and lectures
  const sections = await Promise.all(
    parsedSections.map(async (section: any, sIndex: number) => {
      const lectures = await Promise.all(
        section.lectures.map(async (lecture: any, lIndex: number) => {
          const fileFieldName = `lectureFile_${sIndex}_${lIndex}`
          const lectureFile = files.find(
            (file) => file.fieldname === fileFieldName
          )

          if (!lectureFile) {
            throw new Error(
              `Lecture video missing for section ${sIndex + 1}, lecture ${
                lIndex + 1
              }`
            )
          }

          // Process video upload first
          const videoUpload = await uploadToCloudinary(
            lectureFile.buffer,
            'lectureVideos',
            `lecture_${sIndex}_${lIndex}_${Date.now()}`,
            'video'
          )

          // Get video duration
          const duration = await getCloudinaryVideoDuration(
            videoUpload.public_id
          )

          // Process all resources for this lecture
          const resources = await Promise.all(
            lecture.resources.map(async (resource: any, rIndex: number) => {
              if (resource.type === 'file') {
                const resourceFieldName = `resource_${sIndex}_${lIndex}_${rIndex}`
                const resourceFile = files.find(
                  (file) => file.fieldname === resourceFieldName
                )

                if (!resourceFile) {
                  throw new Error(
                    `Resource file missing for lecture ${
                      lIndex + 1
                    }, resource ${rIndex + 1}`
                  )
                }

                const resourceUpload = await uploadToCloudinary(
                  resourceFile.buffer,
                  'lectureResources',
                  `resource_${sIndex}_${lIndex}_${rIndex}_${Date.now()}`,
                  'raw'
                )

                return {
                  type: 'file',
                  name: resource.name || resourceFile.originalname,
                  url: resourceUpload.secure_url,
                  mimeType: resourceFile.mimetype,
                }
              } else {
                // For links, just store the URL and name
                return {
                  type: 'link',
                  name: resource.name || resource.url,
                  url: resource.url,
                }
              }
            })
          )

          return {
            title: lecture.title,
            description: lecture.description || '',
            videoUrl: videoUpload.secure_url,
            duration,
            resources,
            isFreePreview: lecture.isFreePreview || false,
          }
        })
      )

      return {
        title: section.title,
        lectures,
      }
    })
  )

  // Create and save the course
  const course = new Course({
    title,
    description,
    price,
    instructor,
    thumbnail: thumbnailUpload.secure_url,
    introVideo: introVideoUpload.secure_url,
    sections,
  })

  await course.save()
  return course
}

export const handleCourseUpdate = async (
  courseId: string,
  body: any,
  thumbnailFile?: Express.Multer.File
) => {
  const existingCourse = await Course.findById(courseId)
  if (!existingCourse) {
    throw new Error('Course not found')
  }

  let thumbnailUrl = existingCourse.thumbnail
  if (thumbnailFile) {
    const thumbnailUpload = await uploadToCloudinary(
      thumbnailFile.buffer,
      'thumbnails',
      `thumbnail-${Date.now()}`,
      'image'
    )
    thumbnailUrl = thumbnailUpload.secure_url
  }

  existingCourse.title = body.title || existingCourse.title
  existingCourse.description = body.description || existingCourse.description
  existingCourse.price = body.price || existingCourse.price
  existingCourse.level = body.level || existingCourse.level
  existingCourse.language = body.language || existingCourse.language
  existingCourse.category = body.category || existingCourse.category
  existingCourse.thumbnail = thumbnailUrl

  await existingCourse.save()
  return existingCourse
}

// interface UpdateLectureParams {
//   courseId: string
//   sectionId: string
//   lectureId: string
//   title?: string
//   description?: string
//   videoFile?: Express.Multer.File
//   resourceFiles?: {
//     [key: string]: Express.Multer.File[]
//   } | Express.Multer.File[]
// }

export const getLectureById = async (
  courseId: string,
  sectionId: string,
  lectureId: string
): Promise<ILecture | null> => {
  const course = await Course.findById(courseId)
  if (!course) return null

  const section = course.sections.id(sectionId)
  if (!section) return null

  const lecture = section.lectures.id(lectureId)
  return lecture || null
}

// export const updateLectureById = async ({
//   courseId,
//   sectionId,
//   lectureId,
//   title,
//   description,
//   videoFile,
//   resourceFile,
// }: UpdateLectureParams): Promise<ILecture | null> => {
//   const course = await Course.findById(courseId)
//   if (!course) return null

//   const section = course.sections.id(sectionId)
//   if (!section) return null

//   const lecture = section.lectures.id(lectureId)
//   if (!lecture) return null

//   if (title) lecture.title = title
//   if (description !== undefined) lecture.description = description

//   if (videoFile) {
//     const videoUpload = await uploadToCloudinary(
//       videoFile.buffer,
//       'lectureVideos',
//       `lecture_video_${Date.now()}`,
//       'video'
//     )
//     lecture.videoUrl = videoUpload.secure_url
//     lecture.duration = await getCloudinaryVideoDuration(videoUpload.public_id)
//   }

//   if (resourceFile) {
//     const resourceUpload = await uploadToCloudinary(
//       resourceFile.buffer,
//       'lectureResources',
//       `lecture_resource_${Date.now()}`,
//       'raw'
//     )
//     lecture.resourceUrl = resourceUpload.secure_url
//   }

//   await course.save()
//   return lecture
// }

// export const updateLectureById = async ({
//   courseId,
//   sectionId,
//   lectureId,
//   title,
//   description,
//   videoFile,
//   resourceFiles,
// }: UpdateLectureParams): Promise<ILecture | null> => {
//   const course = await Course.findById(courseId)
//   if (!course) return null

//   const section = course.sections.id(sectionId)
//   if (!section) return null

//   const lecture = section.lectures.id(lectureId)
//   if (!lecture) return null

//   if (title) lecture.title = title
//   if (description !== undefined) lecture.description = description

//   if (videoFile) {
//     const videoUpload = await uploadToCloudinary(
//       videoFile.buffer,
//       'lectureVideos',
//       `lecture_video_${Date.now()}`,
//       'video'
//     )
//     lecture.videoUrl = videoUpload.secure_url
//     lecture.duration = await getCloudinaryVideoDuration(videoUpload.public_id)
//   }

//   // Handle resource updates
//   if (resourceFiles) {
//     // Handle both array and object-style resourceFiles
//     const filesArray = Array.isArray(resourceFiles)
//       ? resourceFiles
//       : Object.values(resourceFiles).flat()

//     const resources = lecture.resources || []
//     const updatedResources = await Promise.all(
//       resources.map(async (resource: any, index: number) => {
//         if (resource.type === 'file' && filesArray[index]) {
//           const file = filesArray[index]
//           const upload = await uploadToCloudinary(
//             file.buffer,
//             'lectureResources',
//             `resource_${lectureId}_${index}_${Date.now()}`,
//             'raw'
//           )
//           return {
//             ...resource,
//             type: 'file',
//             name: resource.name || file.originalname,
//             url: upload.secure_url,
//             mimeType: file.mimetype,
//           }
//         }
//         return resource
//       })
//     )

//     lecture.resources = updatedResources
//   }

//   await course.save()
//   return lecture
// }
interface UpdateSectionParams {
  courseId: string
  sectionId: string
  title?: string
  description?: string
  isPublished?: boolean
  resourceFile?: Express.Multer.File
}

export const updateSectionById = async ({
  courseId,
  sectionId,
  title,
  description,
  isPublished,
  resourceFile,
}: UpdateSectionParams) => {
  const course = await Course.findById(courseId)
  if (!course) return null

  const section = course.sections.id(sectionId)
  if (!section) return null

  if (title) section.title = title
  if (description !== undefined) section.description = description
  if (isPublished !== undefined) section.isPublished = isPublished

  if (resourceFile) {
    const resourceUpload = await uploadToCloudinary(
      resourceFile.buffer,
      'sectionResources',
      `section_resource_${Date.now()}`,
      'raw'
    )
    section.resourceUrl = resourceUpload.secure_url
  }

  await course.save()
  return section
}

export const markLectureCompleted = async (
  lectureId: string,
  userId: string
) => {
  // Find the course that contains this lecture
  const course = await Course.findOne({ 'sections.lectures._id': lectureId })
  if (!course) {
    throw new Error('Course containing lecture not found')
  }

  // Find the specific lecture
  let foundLecture: ILecture | null = null
  for (const section of course.sections) {
    const lecture = section.lectures.id(lectureId)
    if (lecture) {
      foundLecture = lecture
      break
    }
  }

  if (!foundLecture) {
    throw new Error('Lecture not found in any section')
  }

  // Update user progress
  const progress = await UserProgressModel.findOneAndUpdate(
    { user: userId, lecture: lectureId },
    { $set: { completed: true, completedAt: new Date() } },
    { upsert: true, new: true }
  )

  return progress
}
export const getCourseWithProgress = async (
  courseId: string,
  userId: string
) => {
  // Your implementation to get course with user's progress
}
