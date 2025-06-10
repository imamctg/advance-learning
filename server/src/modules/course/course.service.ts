// course.service.ts
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import Course, { ILecture } from './course.model'

export const handleCourseCreation = async (
  body: any,
  files: Express.Multer.File[]
) => {
  const { title, description, price, instructor, sections: sectionsJSON } = body

  if (!files || files.length === 0) {
    throw new Error('No files provided')
  }

  const thumbnailFile = files.find((file) => file.fieldname === 'thumbnail')
  if (!thumbnailFile) throw new Error('Thumbnail is required')

  const thumbnailUrl = await uploadToCloudinary(
    thumbnailFile.buffer,
    'thumbnails',
    `thumbnail-${Date.now()}`,
    'image'
  )

  const introVideoFile = files.find((file) => file.fieldname === 'introVideo')
  if (!introVideoFile) throw new Error('Intro video is required')

  const introVideoUrl = await uploadToCloudinary(
    introVideoFile.buffer,
    'introVideos',
    `introVideo-${Date.now()}`,
    'video'
  )

  const parsedSections: any[] = JSON.parse(sectionsJSON)
  const lectureVideos: {
    sectionIndex: number
    lectureIndex: number
    url: string
  }[] = []

  for (
    let sectionIndex = 0;
    sectionIndex < parsedSections.length;
    sectionIndex++
  ) {
    const section = parsedSections[sectionIndex]

    for (
      let lectureIndex = 0;
      lectureIndex < section.lectures.length;
      lectureIndex++
    ) {
      const fileFieldName = `lectureFile_${sectionIndex}_${lectureIndex}`
      const lectureFile = files.find((file) => file.fieldname === fileFieldName)

      if (!lectureFile) {
        throw new Error(
          `Lecture video missing for section ${sectionIndex + 1}, lecture ${
            lectureIndex + 1
          }`
        )
      }

      const lectureVideoUrl = await uploadToCloudinary(
        lectureFile.buffer,
        'lectureVideos',
        `lecture_${sectionIndex}_${lectureIndex}_${Date.now()}`,
        'video'
      )

      lectureVideos.push({ sectionIndex, lectureIndex, url: lectureVideoUrl })
    }
  }

  const course = new Course({
    title,
    description,
    price,
    instructor,
    thumbnail: thumbnailUrl,
    introVideo: introVideoUrl,
    sections: await Promise.all(
      parsedSections.map(async (section: any, sIndex: number) => ({
        title: section.title,
        lectures: await Promise.all(
          section.lectures.map(async (lecture: any, lIndex: number) => {
            const videoUrl =
              lectureVideos.find(
                (v) => v.sectionIndex === sIndex && v.lectureIndex === lIndex
              )?.url || ''
            const resourceFieldName = `lectureResource_${sIndex}_${lIndex}`
            const resourceFile = files.find(
              (file) => file.fieldname === resourceFieldName
            )
            let resourceUrl = ''

            if (resourceFile) {
              resourceUrl = await uploadToCloudinary(
                resourceFile.buffer,
                'lectureResources',
                `lecture_resource_${sIndex}_${lIndex}_${Date.now()}`,
                'raw'
              )
            }

            return {
              title: lecture.title,
              description: lecture.description || '',
              videoUrl,
              resourceUrl,
              isFreePreview: lecture.isFreePreview || false,
            }
          })
        ),
      }))
    ),
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

  // Thumbnail ফাইল থাকলে Cloudinary তে আপলোড করে url সেট করবো
  let thumbnailUrl = existingCourse.thumbnail
  if (thumbnailFile) {
    thumbnailUrl = await uploadToCloudinary(
      thumbnailFile.buffer,
      'thumbnails',
      `thumbnail-${Date.now()}`,
      'image'
    )
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

interface UpdateLectureParams {
  courseId: string
  sectionId: string
  lectureId: string
  title?: string
  description?: string
  videoFile?: Express.Multer.File
  resourceFile?: Express.Multer.File
}

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

export const updateLectureById = async ({
  courseId,
  sectionId,
  lectureId,
  title,
  description,
  videoFile,
  resourceFile,
}: UpdateLectureParams): Promise<ILecture | null> => {
  const course = await Course.findById(courseId)
  if (!course) return null

  const section = course.sections.id(sectionId)
  if (!section) return null

  const lecture = section.lectures.id(lectureId)
  if (!lecture) return null

  if (title) lecture.title = title
  if (description) lecture.description = description

  if (videoFile) {
    const videoUrl = await uploadToCloudinary(
      videoFile.buffer,
      'lectureVideos',
      `lecture_video_${Date.now()}`,
      'video'
    )
    lecture.videoUrl = videoUrl
  }

  if (resourceFile) {
    const resourceUrl = await uploadToCloudinary(
      resourceFile.buffer,
      'lectureResources',
      `lecture_resource_${Date.now()}`,
      'raw'
    )
    lecture.resourceUrl = resourceUrl
  }

  await course.save()
  return lecture
}
