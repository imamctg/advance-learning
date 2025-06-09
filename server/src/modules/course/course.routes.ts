import express from 'express'
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  addSectionToCourse,
  addLectureToSection,
  getCourseById,
  getInstructorCourses,
} from './course.controller'
import { requireRole } from '../../middlewares/roleMiddleware'
import authMiddleware from '../../middlewares/authMiddleware'
import upload from '../../middlewares/upload'

const router = express.Router()

// Create Course (with image upload)
router.post(
  '/',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.any(),
  createCourse
)

// Get all courses
router.get('/', getAllCourses)
// router.get('/:instructorId/courses', verifyToken, getInstructorCourses)
router.get('/:instructorId/courses', authMiddleware, getInstructorCourses)

// Get single course (basic info)
router.get('/:id', getSingleCourse)

// Update Course
router.patch(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  updateCourse
)

// Delete Course
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  deleteCourse
)

// 🔽 Course Details with Sections and Lectures
router.get('/:courseId/details', getCourseById) // Full nested info

// ➕ Add Section to a Course
router.post(
  '/:courseId/sections',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  addSectionToCourse
)

// ➕ Add Lecture to a Section
router.post(
  '/:courseId/sections/:sectionId/lectures',
  // authMiddleware,
  // requireRole(['admin', 'instructor']),
  addLectureToSection
)

router.post(
  '/:courseId/sections/:sectionId/lectures',
  // upload.single('video'), // ✅ form field name must be 'video'
  upload.any(),
  addLectureToSection
)

export default router
