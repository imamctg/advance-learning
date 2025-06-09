// import { Request, Response } from 'express'
// import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
// import Course from './course.model'

// export const createCourse = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const {
//       title,
//       description,
//       price,
//       instructor,
//       sections: sectionsJSON,
//     } = req.body

//     const files = req.files as Express.Multer.File[]

//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: 'No files provided' })
//     }

//     // ✅ Upload thumbnail
//     const thumbnailFile = files.find((file) => file.fieldname === 'thumbnail')
//     if (!thumbnailFile) {
//       return res.status(400).json({ message: 'Thumbnail is required' })
//     }

//     const thumbnailUrl = await uploadToCloudinary(
//       thumbnailFile.buffer,
//       'thumbnails',
//       `thumbnail-${Date.now()}`,
//       'image'
//     )

//     // ✅ Upload intro video
//     const introVideoFile = files.find((file) => file.fieldname === 'introVideo')
//     if (!introVideoFile) {
//       return res.status(400).json({ message: 'Intro video is required' })
//     }

//     const introVideoUrl = await uploadToCloudinary(
//       introVideoFile.buffer,
//       'introVideos',
//       `introVideo-${Date.now()}`,
//       'video'
//     )

//     // ✅ Parse sections and upload lecture videos
//     const parsedSections: any[] = JSON.parse(sectionsJSON)
//     console.log(parsedSections)
//     const lectureVideos: {
//       sectionIndex: number
//       lectureIndex: number
//       url: string
//     }[] = []

//     for (
//       let sectionIndex = 0;
//       sectionIndex < parsedSections.length;
//       sectionIndex++
//     ) {
//       const section = parsedSections[sectionIndex]

//       for (
//         let lectureIndex = 0;
//         lectureIndex < section.lectures.length;
//         lectureIndex++
//       ) {
//         const fileFieldName = `lectureFile_${sectionIndex}_${lectureIndex}`
//         const lectureFile = files.find(
//           (file) => file.fieldname === fileFieldName
//         )

//         if (!lectureFile) {
//           return res.status(400).json({
//             message: `Lecture video missing for section ${
//               sectionIndex + 1
//             }, lecture ${lectureIndex + 1}`,
//           })
//         }

//         const lectureVideoUrl = await uploadToCloudinary(
//           lectureFile.buffer,
//           'lectureVideos',
//           `lecture_${sectionIndex}_${lectureIndex}_${Date.now()}`,
//           'video'
//         )

//         lectureVideos.push({
//           sectionIndex,
//           lectureIndex,
//           url: lectureVideoUrl,
//         })
//       }
//     }

//     // ✅ Build final course object
//     const course = new Course({
//       title,
//       description,
//       price,
//       instructor,
//       thumbnail: thumbnailUrl,
//       introVideo: introVideoUrl,
//       sections: await Promise.all(
//         parsedSections.map(async (section: any, sIndex: number) => ({
//           title: section.title,
//           lectures: await Promise.all(
//             section.lectures.map(async (lecture: any, lIndex: number) => {
//               const videoUrl =
//                 lectureVideos.find(
//                   (v) => v.sectionIndex === sIndex && v.lectureIndex === lIndex
//                 )?.url || ''

//               // ✅ Find and upload lecture resource
//               const resourceFieldName = `lectureResource_${sIndex}_${lIndex}`
//               console.log(resourceFieldName, 'test')
//               const resourceFile = files.find(
//                 (file) => file.fieldname === resourceFieldName
//               )
//               console.log(resourceFile, 'another test')
//               let resourceUrl = ''
//               if (resourceFile) {
//                 resourceUrl = await uploadToCloudinary(
//                   resourceFile.buffer,
//                   'lectureResources',
//                   `lecture_resource_${sIndex}_${lIndex}_${Date.now()}`,
//                   'raw' // for PDF, ZIP, DOC, etc.
//                 )
//               }

//               return {
//                 title: lecture.title,
//                 description: lecture.description || '',
//                 videoUrl,
//                 resourceUrl,
//                 isFreePreview: lecture.isFreePreview || false,
//               }
//             })
//           ),
//         }))
//       ),
//     })

//     await course.save()

//     return res.status(201).json({
//       success: true,
//       message: 'Course created successfully',
//       data: course,
//     })
//   } catch (error) {
//     console.error('Course creation error:', error)
//     return res.status(500).json({
//       success: false,
//       message: 'Server error during course creation',
//       error: (error as Error).message,
//     })
//   }
// }

// // course.controller.ts → getAllCourses থেকে populate মুছে দিন (যদি createdBy না থাকে)
// export const getAllCourses = async (req: Request, res: Response) => {
//   try {
//     const courses = await Course.find()
//     res.status(200).json({ success: true, data: courses })
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: 'Failed to fetch courses', error })
//   }
// }

// export const getSingleCourse: (
//   req: Request,
//   res: Response
// ) => Promise<any> = async (req, res) => {
//   try {
//     const { id } = req.params
//     const course = await Course.findById(id)

//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Not found' })
//     }

//     return res.status(200).json({ success: true, data: course })
//   } catch (error) {
//     return res.status(500).json({ success: false, message: 'Error', error })
//   }
// }

// // Update Course
// export const updateCourse = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params
//     const { title, description, price, image } = req.body

//     const course = await Course.findById(id)
//     if (!course) {
//       res.status(404).json({ success: false, message: 'Course not found' })
//       return
//     }

//     course.title = title ?? course.title
//     course.description = description ?? course.description
//     course.price = price ?? course.price
//     // course.image = image ?? course.image

//     await course.save()

//     res.status(200).json({ success: true, data: course })
//   } catch (error) {
//     console.error('Error updating course:', error)
//     res.status(500).json({ success: false, message: 'Failed to update course' })
//   }
// }

// // Delete Course
// export const deleteCourse = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { id } = req.params

//     const course = await Course.findByIdAndDelete(id)
//     if (!course) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'Course not found' })
//     }

//     res
//       .status(200)
//       .json({ success: true, message: 'Course deleted successfully' })
//   } catch (error) {
//     console.error('Error deleting course:', error)
//     res.status(500).json({ success: false, message: 'Failed to delete course' })
//   }
// }

// // Get course details
// export const getCourseById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const course = await Course.findById(req.params.courseId)
//   if (!course) res.status(404).json({ message: 'Not found' })
//   res.json(course)
//   return
// }

// // Add Section to a Course
// export const addSectionToCourse = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { title } = req.body
//   const course = await Course.findById(req.params.courseId)
//   if (!course) return res.status(404).json({ message: 'Course not found' })

//   course.sections.push({ title, lectures: [] })
//   await course.save()
//   res.status(201).json(course)
// }

// // Add Lecture to a Section
// export const addLectureToSection = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { title, isFreePreview } = req.body
//     const courseId = req.params.courseId
//     const sectionId = req.params.sectionId

//     const course = await Course.findById(courseId)
//     if (!course) return res.status(404).json({ message: 'Course not found' })

//     const section = course.sections.id(sectionId)
//     if (!section) return res.status(404).json({ message: 'Section not found' })

//     if (!req.file) {
//       return res.status(400).json({ message: 'No video file uploaded' })
//     }

//     // Add lecture
//     section.lectures.push({
//       title,
//       // videoUrl,
//       isFreePreview: isFreePreview || false,
//     })

//     await course.save()
//     res.status(201).json({ message: 'Lecture added successfully', course })
//   } catch (error) {
//     console.error('Error adding lecture:', error)
//     res.status(500).json({ message: 'Server error', error })
//   }
// }

// course.controller.ts
import { Request, Response } from 'express'
import Course from './course.model'
import { handleCourseCreation } from './course.service'
import mongoose from 'mongoose'

// Create Course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await handleCourseCreation(
      req.body,
      req.files as Express.Multer.File[]
    )
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    })
  } catch (error) {
    console.error('Course creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    })
  }
}

// Other handlers (No change)
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find()
    res.status(200).json({ success: true, data: courses })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch courses', error })
  }
}

export const getSingleCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params
    const course = await Course.findById(id)
    if (!course)
      return res.status(404).json({ success: false, message: 'Not found' })
    res.status(200).json({ success: true, data: course })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error', error })
  }
}

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params
    const { title, description, price } = req.body

    const course = await Course.findById(id)
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })

    course.title = title ?? course.title
    course.description = description ?? course.description
    course.price = price ?? course.price
    await course.save()

    res.status(200).json({ success: true, data: course })
  } catch (error) {
    console.error('Error updating course:', error)
    res.status(500).json({ success: false, message: 'Failed to update course' })
  }
}

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params
    const course = await Course.findByIdAndDelete(id)
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })

    res
      .status(200)
      .json({ success: true, message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    res.status(500).json({ success: false, message: 'Failed to delete course' })
  }
}

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const course = await Course.findById(req.params.courseId)
  if (!course) return res.status(404).json({ message: 'Not found' })
  res.json(course)
}

export const getInstructorCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const instructorId = req.params.instructorId
    console.log(instructorId, 'getInstructorCourses')
    // Validate if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructor ID',
      })
    }

    const courses = await Course.find({ instructor: instructorId }).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      courses,
    })
  } catch (error) {
    console.error('❌ Error in getInstructorCourses:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    })
  }
}

export const addSectionToCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title } = req.body
  const course = await Course.findById(req.params.courseId)
  if (!course) return res.status(404).json({ message: 'Course not found' })

  course.sections.push({ title, lectures: [] })
  await course.save()
  res.status(201).json(course)
}

export const addLectureToSection = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, isFreePreview } = req.body
    const courseId = req.params.courseId
    const sectionId = req.params.sectionId

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const section = course.sections.id(sectionId)
    if (!section) return res.status(404).json({ message: 'Section not found' })

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' })
    }

    section.lectures.push({
      title,
      isFreePreview: isFreePreview || false,
    })

    await course.save()
    res.status(201).json({ message: 'Lecture added successfully', course })
  } catch (error) {
    console.error('Error adding lecture:', error)
    res.status(500).json({ message: 'Server error', error })
  }
}
