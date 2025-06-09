// course.service.ts
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import Course from './course.model'

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
