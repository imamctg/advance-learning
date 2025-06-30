// course.controller.ts
import { Request, Response } from 'express'
import Course, {
  COURSE_STATUSES,
  CourseStatus,
  IAdminNote,
  IChangeRequest,
  ICourse,
  ILecture,
  INoteResponse,
  ISection,
  IUserRef,
} from './course.model'
import mongoose, { Types } from 'mongoose'
import * as courseService from './course.service'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import { getCloudinaryVideoDuration } from '../../utils/getCloudinaryVideoDuration'
import User, { IUser } from '../user/user.model'
// import { IUser } from '../user/user.model'

// ✅ Create Course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.handleCourseCreation(
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

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { status } = req.query // কুয়েরি প্যারামিটার থেকে status নেওয়া
    console.log(status)
    // ফিল্টার অবজেক্ট তৈরি
    const filter: any = {}
    if (status) {
      filter.status = status
    }
    console.log(filter, 'filter')
    const courses = await Course.find(filter) // ফিল্টার ব্যবহার করে কোর্স খোঁজা
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
    const course = await Course.findById(req.params.id)
    if (!course)
      return res.status(404).json({ success: false, message: 'Not found' })
    res.status(200).json({ success: true, data: course })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error', error })
  }
}

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId
    const updatedCourse = await courseService.handleCourseUpdate(
      courseId,
      req.body,
      req.file
    )
    res.json({ success: true, data: updatedCourse })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
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

// export const getCourseById = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const course = await Course.findById(req.params.courseId)
//   if (!course) return res.status(404).json({ message: 'Not found' })
//   res.json(course)
// }

// export const getInstructorStudents = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     console.log(req.user, 'controller .....')
//     if (!req.user?._id) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' })
//     }

//     // const instructorId = new mongoose.Types.ObjectId(req.user._id.toString())
//     const instructorId = mongoose.Types.ObjectId.createFromHexString(
//       req.user._id.toString()
//     )
//     const students = await courseService.getStudentsByInstructor(instructorId)

//     res.status(200).json({
//       success: true,
//       data: students,
//     })
//   } catch (error) {
//     console.error('Error in getInstructorStudents:', error)
//     res.status(500).json({
//       success: false,
//       message:
//         error instanceof Error ? error.message : 'Failed to fetch students',
//       error: process.env.NODE_ENV === 'development' ? error : undefined,
//     })
//   }
// }
export const getCourseById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name email')
      .populate('sections.lectures.resources')

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    res.status(200).json({
      success: true,
      data: course,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details',
    })
  }
}

export const getInstructorCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const instructorId = req.params.instructorId
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid instructor ID' })
    }
    const courses = await Course.find({ instructor: instructorId }).sort({
      createdAt: -1,
    })
    res.status(200).json({ success: true, courses })
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

// export const addLectureToSection = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { courseId, sectionId } = req.params
//     const { title, description, isFreePreview } = req.body

//     // Debug log to see what files are being received
//     console.log('Received files:', req.files)
//     console.log('Received body:', req.body)

//     // Check if files exist and contain the video
//     if (!req.files || !('video' in req.files)) {
//       return res.status(400).json({ message: 'Video file is required' })
//     }

//     const files = req.files as { [fieldname: string]: Express.Multer.File[] }
//     const videoFile = files['video'][0]

//     // Upload video to Cloudinary
//     const videoUpload = await uploadToCloudinary(
//       videoFile.buffer,
//       'lectureVideos',
//       `lecture_${Date.now()}`,
//       'video'
//     )

//     const duration = await getCloudinaryVideoDuration(videoUpload.public_id)

//     // Process resources - simplified approach
//     const resources: any[] = []

//     // Handle file resources
//     for (const [key, value] of Object.entries(files)) {
//       if (key.startsWith('resources') && key.includes('[file]')) {
//         const indexMatch = key.match(/resources\[(\d+)\]\[file\]/)
//         if (indexMatch) {
//           const index = indexMatch[1]
//           const file = value[0]
//           const resourceType = req.body[`resources[${index}][type]`] || 'file'
//           const resourceName =
//             req.body[`resources[${index}][name]`] || file.originalname

//           if (resourceType === 'file') {
//             const upload = await uploadToCloudinary(
//               file.buffer,
//               'lectureResources',
//               `resource_${index}_${Date.now()}`,
//               'raw'
//             )
//             resources.push({
//               type: 'file',
//               name: resourceName,
//               url: upload.secure_url,
//               mimeType: file.mimetype,
//             })
//           }
//         }
//       }
//     }

//     // Handle link resources
//     for (const key in req.body) {
//       if (key.startsWith('resources') && key.includes('[url]')) {
//         const indexMatch = key.match(/resources\[(\d+)\]\[url\]/)
//         if (indexMatch) {
//           const index = indexMatch[1]
//           const resourceType = req.body[`resources[${index}][type]`] || 'link'
//           if (resourceType === 'link') {
//             const resourceName =
//               req.body[`resources[${index}][name]`] || req.body[key]
//             resources.push({
//               type: 'link',
//               name: resourceName,
//               url: req.body[key],
//             })
//           }
//         }
//       }
//     }

//     const course = await Course.findById(courseId)
//     if (!course) return res.status(404).json({ message: 'Course not found' })

//     const section = course.sections.id(sectionId)
//     if (!section) return res.status(404).json({ message: 'Section not found' })

//     section.lectures.push({
//       title,
//       description: description || '',
//       videoUrl: videoUpload.secure_url,
//       duration,
//       isFreePreview: isFreePreview === 'true',
//       resources,
//     })

//     await course.save()
//     return res.status(201).json({
//       success: true,
//       message: 'Lecture added successfully',
//       data: {
//         lecture: section.lectures[section.lectures.length - 1],
//         sectionId: section._id,
//       },
//     })
//   } catch (error) {
//     console.error('Error adding lecture:', error)
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     })
//   }
// }

// export const addLectureToSection = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { courseId, sectionId } = req.params
//     const {
//       title,
//       description,
//       isFreePreview,
//       resources: resourcesBody,
//     } = req.body

//     console.log('Received files:', req.files)
//     console.log('Received body:', req.body)

//     if (!req.files || !('video' in req.files)) {
//       return res.status(400).json({ message: 'Video file is required' })
//     }

//     const files = req.files as { [fieldname: string]: Express.Multer.File[] }
//     const videoFile = files['video'][0]

//     const videoUpload = await uploadToCloudinary(
//       videoFile.buffer,
//       'lectureVideos',
//       `lecture_${Date.now()}`,
//       'video'
//     )

//     const duration = await getCloudinaryVideoDuration(videoUpload.public_id)

//     // Process resources - handle both files and links
//     const resources: any[] = []

//     // Handle file resources from multipart form
//     for (const [key, value] of Object.entries(files)) {
//       if (key.startsWith('resources') && key.includes('[file]')) {
//         const indexMatch = key.match(/resources\[(\d+)\]\[file\]/)
//         if (indexMatch) {
//           const index = indexMatch[1]
//           const file = value[0]
//           const resourceType = req.body[`resources[${index}][type]`] || 'file'
//           const resourceName =
//             req.body[`resources[${index}][name]`] || file.originalname

//           if (resourceType === 'file') {
//             const upload = await uploadToCloudinary(
//               file.buffer,
//               'lectureResources',
//               `resource_${index}_${Date.now()}`,
//               'raw'
//             )
//             resources.push({
//               type: 'file',
//               name: resourceName,
//               url: upload.secure_url,
//               mimeType: file.mimetype,
//             })
//           }
//         }
//       }
//     }

//     // Handle link resources from JSON body
//     if (typeof resourcesBody === 'string') {
//       try {
//         const parsedResources = JSON.parse(resourcesBody)
//         parsedResources.forEach((resource: any) => {
//           if (resource.type === 'link') {
//             resources.push({
//               type: 'link',
//               name: resource.name || resource.url,
//               url: resource.url,
//             })
//           }
//         })
//       } catch (e) {
//         console.error('Error parsing resources body:', e)
//       }
//     }

//     const course = await Course.findById(courseId)
//     if (!course) return res.status(404).json({ message: 'Course not found' })

//     const section = course.sections.id(sectionId)
//     if (!section) return res.status(404).json({ message: 'Section not found' })

//     section.lectures.push({
//       title,
//       description: description || '',
//       videoUrl: videoUpload.secure_url,
//       duration,
//       isFreePreview: isFreePreview === 'true',
//       resources,
//     })

//     await course.save()
//     return res.status(201).json({
//       success: true,
//       message: 'Lecture added successfully',
//       data: {
//         lecture: section.lectures[section.lectures.length - 1],
//         sectionId: section._id,
//       },
//     })
//   } catch (error) {
//     console.error('Error adding lecture:', error)
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     })
//   }
// }

export const addLectureToSection = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { courseId, sectionId } = req.params
    const { title, description, isFreePreview } = req.body

    console.log('Received files:', req.files)
    console.log('Received body:', req.body)

    if (!req.files || !('video' in req.files)) {
      return res.status(400).json({ message: 'Video file is required' })
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const videoFile = files['video'][0]

    const videoUpload = await uploadToCloudinary(
      videoFile.buffer,
      'lectureVideos',
      `lecture_${Date.now()}`,
      'video'
    )

    const duration = await getCloudinaryVideoDuration(videoUpload.public_id)

    // Process resources from JSON string
    let resources: any[] = []
    try {
      if (req.body.resources) {
        const parsedResources = JSON.parse(req.body.resources)

        // Process file resources from FormData
        const resourceFiles = files['resourceFiles'] || []
        let fileIndex = 0

        resources = await Promise.all(
          parsedResources
            .map(async (resource: any) => {
              if (resource.type === 'file') {
                if (resource.file && resourceFiles[fileIndex]) {
                  const file = resourceFiles[fileIndex]
                  fileIndex++

                  const upload = await uploadToCloudinary(
                    file.buffer,
                    'lectureResources',
                    `resource_${Date.now()}`,
                    'raw'
                  )

                  return {
                    type: 'file',
                    name: resource.name,
                    url: upload.secure_url,
                    mimeType: file.mimetype,
                  }
                } else if (resource.url) {
                  // Keep existing file URL if no new file was uploaded
                  return resource
                }
              } else if (resource.type === 'link') {
                return {
                  type: 'link',
                  name: resource.name,
                  url: resource.url,
                }
              }
              return null
            })
            .filter(Boolean)
        )
      }
    } catch (e) {
      console.error('Error processing resources:', e)
      return res.status(400).json({ message: 'Invalid resources format' })
    }

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const section = course.sections.id(sectionId)
    if (!section) return res.status(404).json({ message: 'Section not found' })

    section.lectures.push({
      title,
      description: description || '',
      videoUrl: videoUpload.secure_url,
      duration,
      isFreePreview: isFreePreview === 'true',
      resources,
    })

    await course.save()
    return res.status(201).json({
      success: true,
      message: 'Lecture added successfully',
      data: {
        lecture: section.lectures[section.lectures.length - 1],
        sectionId: section._id,
      },
    })
  } catch (error) {
    console.error('Error adding lecture:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const getInstructorCourseSections = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { courseId } = req.params
  try {
    const course = await Course.findById(courseId)
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })
    res.status(200).json({ success: true, sections: course.sections })
  } catch (error) {
    console.error('Error fetching sections:', error)
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch sections' })
  }
}

export const deleteLecture = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { lectureId } = req.params
  try {
    const course = await Course.findOne({ 'sections.lectures._id': lectureId })
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: 'Lecture not found' })

    const section = course.sections.find((s: ISection) =>
      s.lectures.some((l: ILecture) => l._id.toString() === lectureId)
    )
    if (!section)
      return res
        .status(404)
        .json({ success: false, message: 'Section not found' })

    const index = section.lectures.findIndex(
      (l: ILecture) => l._id.toString() === lectureId
    )
    if (index === -1)
      return res
        .status(404)
        .json({ success: false, message: 'Lecture not found in section' })

    section.lectures.splice(index, 1)
    await course.save()
    res
      .status(200)
      .json({ success: true, message: 'Lecture deleted successfully' })
  } catch (error) {
    console.error('Error deleting lecture:', error)
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete lecture' })
  }
}

export const deleteSection = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { sectionId } = req.params
  try {
    const course = await Course.findOne({ 'sections._id': sectionId })
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: 'Section not found' })

    const section = course.sections.id(sectionId)
    if (!section)
      return res
        .status(404)
        .json({ success: false, message: 'Section not found in course' })

    section.deleteOne()
    await course.save()
    return res
      .status(200)
      .json({ success: true, message: 'Section deleted successfully' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Failed to delete section' })
  }
}

export const getLectureById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { courseId, sectionId, lectureId } = req.params
  try {
    const lecture = await courseService.getLectureById(
      courseId,
      sectionId,
      lectureId
    )
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' })
    res.json({ data: lecture })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// export const updateLectureById = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { courseId, sectionId, lectureId } = req.params
//   const { title, description } = req.body

//   const files = req.files as
//     | { [fieldname: string]: Express.Multer.File[] }
//     | undefined
//   const videoFile = files?.['video']?.[0]
//   const resourceFiles = files?.['resource']

//   try {
//     const updatedLecture = await courseService.updateLectureById({
//       courseId,
//       sectionId,
//       lectureId,
//       title,
//       description,
//       videoFile,
//       resourceFiles,
//     })

//     if (!updatedLecture)
//       return res
//         .status(404)
//         .json({ message: 'Lecture not found or update failed' })

//     res.json({ message: 'Lecture updated successfully', data: updatedLecture })
//   } catch (error) {
//     console.error('Error updating lecture:', error)
//     res.status(500).json({ message: 'Server error', error })
//   }
// }

interface UpdateLectureParams {
  courseId: string
  sectionId: string
  lectureId: string
  title?: string
  description?: string
  videoFile?: Express.Multer.File
  resourceFiles?:
    | {
        [key: string]: Express.Multer.File[]
      }
    | Express.Multer.File[]
}

export const updateLectureById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { courseId, sectionId, lectureId } = req.params
    const { title, description, isFreePreview } = req.body

    console.log('Received files:', req.files)
    console.log('Received body:', req.body)

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const videoFile = files?.['video']?.[0]

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const section = course.sections.id(sectionId)
    if (!section) return res.status(404).json({ message: 'Section not found' })

    const lecture = section.lectures.id(lectureId)
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' })

    // Update basic fields
    if (title) lecture.title = title
    if (description !== undefined) lecture.description = description
    if (isFreePreview !== undefined)
      lecture.isFreePreview = isFreePreview === 'true'

    // Handle video update
    if (videoFile) {
      const videoUpload = await uploadToCloudinary(
        videoFile.buffer,
        'lectureVideos',
        `lecture_${Date.now()}`,
        'video'
      )
      lecture.videoUrl = videoUpload.secure_url
      lecture.duration = await getCloudinaryVideoDuration(videoUpload.public_id)
    }

    // Process resources from JSON string
    let updatedResources: any[] = []
    try {
      if (req.body.resources) {
        const parsedResources = JSON.parse(req.body.resources)
        const resourceFiles = files?.['resourceFiles'] || []
        let fileIndex = 0

        updatedResources = await Promise.all(
          parsedResources
            .map(async (resource: any) => {
              if (resource.type === 'file') {
                if (resource.file && resourceFiles[fileIndex]) {
                  const file = resourceFiles[fileIndex]
                  fileIndex++

                  const upload = await uploadToCloudinary(
                    file.buffer,
                    'lectureResources',
                    `resource_${Date.now()}`,
                    'raw'
                  )

                  return {
                    type: 'file',
                    name: resource.name,
                    url: upload.secure_url,
                    mimeType: file.mimetype,
                  }
                } else if (resource.url) {
                  // Keep existing file if no new file uploaded
                  return resource
                }
              } else if (resource.type === 'link') {
                return {
                  type: 'link',
                  name: resource.name,
                  url: resource.url,
                }
              }
              return null
            })
            .filter(Boolean)
        )
      }
    } catch (e) {
      console.error('Error processing resources:', e)
      return res.status(400).json({ message: 'Invalid resources format' })
    }

    // Update resources if new ones were provided
    if (updatedResources.length > 0) {
      lecture.resources = updatedResources
    }

    await course.save()
    return res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: lecture,
    })
  } catch (error) {
    console.error('Error updating lecture:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export const updateSectionByIdController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { courseId, sectionId } = req.params
  const { title, description, isPublished } = req.body

  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const resourceFile = files?.['resourceFile']?.[0]

  const updatedSection = await courseService.updateSectionById({
    courseId,
    sectionId,
    title,
    description,
    isPublished: isPublished === 'true',
    resourceFile,
  })

  if (!updatedSection)
    return res
      .status(404)
      .json({ message: 'Section not found or update failed' })

  res.status(200).json({ section: updatedSection })
}

export const markLectureAsCompleted = async (req: Request, res: Response) => {
  try {
    const { lectureId } = req.params
    const userId = req.user._id // Make sure you have authentication middleware

    const updatedProgress = await courseService.markLectureCompleted(
      lectureId,
      userId
    )

    res.json({
      success: true,
      message: 'Lecture marked as completed',
      data: updatedProgress,
    })
  } catch (error: any) {
    console.error('Error marking lecture as completed:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark lecture as completed',
    })
  }
}

// ====================== NEW STATUS MANAGEMENT CONTROLLERS ======================

/**
 * @desc    Submit course for admin review
 * @route   POST /api/courses/:courseId/submit
 * @access  Instructor (course owner)
 */
export const submitCourseForReview = async (req: Request, res: Response) => {
  try {
    const course = await courseService.submitCourseForReview(
      req.params.courseId,
      req.user._id // Assuming you have authentication middleware
    )

    res.status(200).json({
      success: true,
      message: 'Course submitted for admin review',
      data: course,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit course for review',
    })
  }
}

/**
 * @desc    Admin reviews a course
 * @route   POST /api/courses/:courseId/review
 * @access  Admin
 */
// export const reviewCourse = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { decision, notes } = req.body

//     const validDecisions = ['approved', 'rejected', 'changes_requested']
//     if (!validDecisions.includes(decision)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           'Invalid decision. Must be one of: approved, rejected, changes_requested',
//       })
//     }
// // Update course status
//     const course = await courseService.reviewCourseByAdmin(
//       req.params.courseId,
//       req.user._id, // Admin ID
//       decision as 'approved' | 'rejected' | 'changes_requested',
//       notes
//     )

//     res.status(200).json({
//       success: true,
//       message: `Course ${decision}`,
//       data: course,
//     })
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || 'Failed to review course',
//     })
//   }
// }

// export const reviewCourse = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { decision, notes } = req.body
//     const { courseId } = req.params
//     const adminId = req.user._id // From auth middleware

//     // Validate decision
//     const validDecisions = ['approved', 'rejected', 'changes_requested']
//     if (!validDecisions.includes(decision)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid decision value',
//       })
//     }

//     // Update course status
//     const course = await Course.findByIdAndUpdate(
//       courseId,
//       {
//         status: decision,
//         adminNotes: notes,
//         reviewedBy: adminId,
//         reviewedAt: new Date(),
//       },
//       { new: true }
//     )

//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: 'Course not found',
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message: `Course ${decision}`,
//       data: course,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to review course',
//     })
//   }
// }

export const reviewCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { decision, notes } = req.body
    const { courseId } = req.params
    const adminId = req.user._id // From auth middleware

    // Validate decision
    const validDecisions = ['approved', 'rejected', 'changes_requested']
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid decision value',
      })
    }

    // Create new admin note object
    const newAdminNote = {
      adminId,
      note: notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Update course status and add note
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: {
          status: decision,
          lastReviewedAt: new Date(),
          lastReviewedBy: adminId,
        },
        $push: {
          adminNotes: newAdminNote,
        },
      },
      { new: true }
    )

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    res.status(200).json({
      success: true,
      message: `Course ${decision}`,
      data: course,
    })
  } catch (error) {
    console.error('Error reviewing course:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to review course',
    })
  }
}

/**
 * @desc    Publish an approved course
 * @route   POST /api/courses/:courseId/publish
 * @access  Instructor (course owner)
 */
export const publishCourse = async (req: Request, res: Response) => {
  console.log(req.user, req.params, 'user')
  try {
    const course = await courseService.publishCourse(
      req.params.courseId,
      req.user.id
    )

    res.status(200).json({
      success: true,
      message: 'Course published successfully',
      data: course,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to publish course',
    })
  }
}

/**
 * @desc    Archive a course
 * @route   POST /api/courses/:courseId/archive
 * @access  Instructor (course owner) or Admin
 */
export const archiveCourse = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user.role === 'admin' // Assuming role is in user object
    const course = await courseService.archiveCourse(
      req.params.courseId,
      req.user._id,
      isAdmin
    )

    res.status(200).json({
      success: true,
      message: 'Course archived successfully',
      data: course,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to archive course',
    })
  }
}

/**
 * @desc    Get courses by status (for admin dashboard)
 * @route   GET /api/courses/status/:status
 * @access  Admin
 */

export const getCoursesByStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status } = req.params

    // Validate status
    if (!COURSE_STATUSES.includes(status as CourseStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      })
    }

    // Fetch courses with proper population
    const courses = await Course.find({ status })
      .populate('instructor', 'name email') // Properly populate instructor info
      .select('title instructor price status createdAt') // Select only needed fields
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses.map((course) => ({
        ...course.toObject(),
        price: course.price.toFixed(2), // Format price
      })),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch courses by status',
    })
  }
}

// First, define interfaces for your note types
interface AdminNote {
  note: string
  createdAt: Date
  adminId: Types.ObjectId
}

interface ChangeRequest {
  message: string
  createdAt: Date
  adminId: Types.ObjectId
}

// course.controller.ts
export const getAdminNotes = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const course = await Course.findById(req.params.courseId)
      .select('adminNotes changeRequests')
      .populate('adminNotes.adminId changeRequests.adminId', 'name email')

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    // Combine all notes and requests
    const allNotes = [
      ...course.adminNotes.map((note: any) => ({
        type: 'note',
        note: note.note,
        responseNote: note.responseNote,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        admin: note.adminId,
      })),
      ...course.changeRequests.map((request: any) => ({
        type: 'request',
        message: request.message,
        responseNote: request.responseNote,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        admin: request.adminId,
      })),
    ]

    res.status(200).json(allNotes)
  } catch (error) {
    console.error('Error fetching admin notes:', error)
    res.status(500).json({ message: 'Failed to fetch notes' })
  }
}
// course.controller.ts
// export const resubmitCourse = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { courseId } = req.params
//     const { responseNote } = req.body
//     const instructorId = req.user._id

//     const course = await Course.findOneAndUpdate(
//       {
//         _id: courseId,
//         instructor: instructorId,
//         status: 'changes_requested',
//       },
//       {
//         $set: {
//           status: 'under_review',
//           lastReviewedAt: new Date(),
//         },
//         $push: {
//           adminNotes: {
//             adminId: instructorId, // Instructor is responding
//             note: 'Instructor response to changes',
//             responseNote: responseNote,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           },
//         },
//       },
//       { new: true }
//     )

//     if (!course) {
//       return res.status(400).json({
//         success: false,
//         message: 'Course not found or not in changes_requested state',
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Course resubmitted for review',
//       data: {
//         status: course.status,
//         adminNotes: course.adminNotes,
//       },
//     })
//   } catch (error: any) {
//     console.error('Error resubmitting course:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Failed to resubmit course',
//       error: error.message,
//     })
//   }
// }

// export const resubmitCourse = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     console.log('Resubmitting course...')
//     const { courseId } = req.params
//     const { responseNote } = req.body
//     const instructorId = req.user._id

//     // Find the course
//     const course = await Course.findOne({
//       _id: courseId,
//       instructor: instructorId,
//       status: 'changes_requested',
//     })

//     if (!course) {
//       return res.status(400).json({
//         success: false,
//         message: 'Course not found or not in changes_requested state',
//       })
//     }

//     // Add response to the latest admin note or change request
//     if (course.adminNotes.length > 0) {
//       const lastNote = course.adminNotes[course.adminNotes.length - 1]
//       lastNote.responseNote = responseNote
//       lastNote.updatedAt = new Date()
//     } else if (course.changeRequests.length > 0) {
//       const lastRequest =
//         course.changeRequests[course.changeRequests.length - 1]
//       lastRequest.responseNote = responseNote
//       lastRequest.updatedAt = new Date()
//     }

//     // Update course status
//     course.status = 'under_review'
//     await course.save()

//     res.status(200).json({
//       success: true,
//       message: 'Course resubmitted for review',
//       data: course,
//     })
//   } catch (error) {
//     console.error('Error resubmitting course:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Failed to resubmit course',
//     })
//   }
// }

export const resubmitCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { courseId } = req.params
    const { responseNote } = req.body
    const instructorId = req.user._id

    // Find the course
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
      status: 'changes_requested',
    })

    if (!course) {
      return res.status(400).json({
        success: false,
        message: 'Course not found or not in changes_requested state',
      })
    }

    // Clean up any invalid admin notes (those missing required fields)
    course.adminNotes = course.adminNotes.filter(
      (note: IAdminNote) => note && note.note && note.note.trim() !== ''
    )

    // Create a new properly structured admin note
    const newAdminNote = {
      adminId: instructorId,
      note: 'Instructor response to review feedback',
      responseNote: responseNote,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Update course status and add new note
    course.status = 'under_review'
    course.adminNotes.push(newAdminNote)
    course.lastReviewedAt = new Date()
    course.lastReviewedBy = instructorId

    // Validate before saving
    await course.validate()

    await course.save()

    res.status(200).json({
      success: true,
      message: 'Course resubmitted for review',
      data: {
        status: course.status,
        lastReviewedAt: course.lastReviewedAt,
      },
    })
  } catch (error: any) {
    console.error('Error resubmitting course:', error)

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: ' + error.message,
        errors: error.errors,
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to resubmit course',
    })
  }
}

// export const getMyCourseStudents = async (req: Request, res: Response) => {
//   try {
//     const instructorId = req.user.id
//     console.log('Instructor ID:', instructorId)
//     const students = await courseService.getStudentsOfInstructorCourses(
//       instructorId
//     )
//     res.status(200).json({ students })
//   } catch (error) {
//     console.error('Error fetching students:', error)
//     res.status(500).json({ message: 'Server error while fetching students.' })
//   }
// }

// export const getMyCourseStudents = async (req: Request, res: Response) => {
//   try {
//     const instructorId = req.user._id // req.user.id নয়, req.user._id ব্যবহার করুন
//     console.log('Instructor ID:', instructorId)

//     const students = await courseService.getStudentsOfInstructorCourses(
//       instructorId.toString() // ObjectId কে স্ট্রিং-এ কনভার্ট করুন
//     )

//     res.status(200).json({
//       success: true,
//       students,
//     })
//   } catch (error) {
//     console.error('Error fetching students:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching students.',
//     })
//   }
// }

// export const getMyCourseStudents = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     // প্রথমে নিশ্চিত করুন req.user সঠিকভাবে পপুলেটেড হয়েছে
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         success: false,
//         message: 'Unauthorized: User not authenticated',
//       })
//     }
//     const instructorId = req.user._id || req.user.id // উভয় ক্ষেত্রে কাজ করবে
//     console.log('Instructor ID:', instructorId)

//     const students = await courseService.getStudentsOfInstructorCourses(
//       instructorId.toString()
//     )

//     res.status(200).json({
//       success: true,
//       students,
//     })
//   } catch (error: any) {
//     console.error('Error fetching students:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching students.',
//       error: error.message, // ডিবাগিং এর জন্য এরর মেসেজ যোগ করুন
//     })
//   }
// }

// export const getMyCourseStudents = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not authenticated',
//       })
//     }

//     console.log('Authenticated User:', req.user) // ডিবাগিং লগ

//     const instructorId = req.user._id // mongoose ObjectId
//     const students = await courseService.getStudentsOfInstructorCourses(
//       instructorId.toString()
//     )

//     res.status(200).json({
//       success: true,
//       students,
//     })
//   } catch (error) {
//     console.error('Error in getMyCourseStudents:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     })
//   }
// }

export const getMyCourseStudents = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const instructorId = req.user._id // authMiddleware থেকে প্রাপ্ত

    // 1. প্রথমে ইনস্ট্রাক্টরের কোর্সগুলো খুঁজুন
    const courses = await Course.find({ instructor: instructorId })

    if (!courses.length) {
      return res
        .status(404)
        .json({ success: false, message: 'No courses found' })
    }

    // 2. সকল স্টুডেন্ট আইডি সংগ্রহ করুন
    const studentIds = courses.flatMap((course) => course.students)

    // 3. স্টুডেন্ট ডিটেইলস পপুলেট করুন
    const students = await User.find({
      _id: { $in: studentIds },
    }).select('name email role profileImage')

    res.status(200).json({ success: true, students })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}
