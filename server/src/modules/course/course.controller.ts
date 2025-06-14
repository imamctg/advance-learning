// course.controller.ts
import { Request, Response } from 'express'
import Course, { ICourse, ILecture, ISection } from './course.model'
import { handleCourseCreation } from './course.service'
import mongoose from 'mongoose'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import * as courseService from './course.service'

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

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId
    const updatedCourse = await courseService.handleCourseUpdate(
      courseId,
      req.body,
      req.file // thumbnail file
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
    const { title, description, isFreePreview } = req.body
    const courseId = req.params.courseId
    const sectionId = req.params.sectionId
    console.log('first', courseId, sectionId)
    // Validation
    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title and video are required' })
    }

    // Cloudinary Upload
    const videoUrl = await uploadToCloudinary(
      req.file.buffer,
      'lectureVideos',
      `lecture_${Date.now()}`,
      'video'
    )

    // Course & Section Validation
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const section = course.sections.id(sectionId)
    if (!section) return res.status(404).json({ message: 'Section not found' })

    // Add lecture to section
    section.lectures.push({
      title,
      description: description || '',
      videoUrl,
      isFreePreview: isFreePreview === 'true',
    })

    await course.save()

    return res
      .status(201)
      .json({ message: 'Lecture added successfully', course })
  } catch (error) {
    console.error('Error adding lecture:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
export const getInstructorCourseSections = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { courseId } = req.params

  try {
    const course = await Course.findById(courseId)
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })
    }

    res.status(200).json({
      success: true,
      sections: course.sections,
    })
  } catch (error) {
    console.error('Error fetching sections:', error)
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch sections' })
  }
}

// ---------- Delete a Lecture ----------
export const deleteLecture = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { lectureId } = req.params

  try {
    const course = await Course.findOne({ 'sections.lectures._id': lectureId })

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Lecture not found' })
    }

    const section = course.sections.find((section: ISection) =>
      section.lectures.some((lec: ILecture) => lec._id.toString() === lectureId)
    )

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: 'Section not found' })
    }

    const lectureIndex = section.lectures.findIndex(
      (lec: ILecture) => lec._id.toString() === lectureId
    )

    if (lectureIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Lecture not found in section' })
    }

    section.lectures.splice(lectureIndex, 1)
    await course.save()

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting lecture:', error)
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete lecture' })
  }
}

// ---------- Delete a Section ----------
export const deleteSection = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { sectionId } = req.params

  try {
    const course: ICourse | null = await Course.findOne({
      'sections._id': sectionId,
    })

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Section not found' })
    }

    const section: ISection | null = course.sections.id(
      sectionId
    ) as ISection | null

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: 'Section not found in course' })
    }

    section.deleteOne() // Mongoose subdocument delete
    await course.save()

    return res.status(200).json({
      success: true,
      message: 'Section deleted successfully',
    })
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
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' })
    }
    res.json({ data: lecture })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const updateLectureById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { courseId, sectionId, lectureId } = req.params
  const { title, description } = req.body

  // Type assertion here:
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined

  const videoFile = files?.['video']?.[0]
  const resourceFile = files?.['resource']?.[0]

  try {
    const updatedLecture = await courseService.updateLectureById({
      courseId,
      sectionId,
      lectureId,
      title,
      description,
      videoFile,
      resourceFile,
    })

    if (!updatedLecture) {
      return res
        .status(404)
        .json({ message: 'Lecture not found or update failed' })
    }

    res.json({ message: 'Lecture updated successfully', data: updatedLecture })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error })
  }
}

// export const updateSectionByIdController = asyncHandler(async (req: Request, res: Response) => {
export const updateSectionByIdController = async (
  req: Request,
  res: Response
) => {
  const { courseId, sectionId } = req.params
  const { title, description, isPublished } = req.body

  // Type assertion here:
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const resourceFile = files?.['resourceFile']?.[0]

  const updatedSection = await courseService.updateSectionById({
    courseId,
    sectionId,
    title,
    description,
    isPublished: isPublished === 'true', // since it's from FormData, it's string
    resourceFile,
  })

  if (!updatedSection) {
    res.status(404)
    throw new Error('Section not found or update failed')
  }

  res.status(200).json({ section: updatedSection })
}
