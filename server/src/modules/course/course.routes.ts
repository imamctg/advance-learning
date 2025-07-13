// import express from 'express'
// import {
//   createCourse,
//   deleteCourse,
//   getAllCourses,
//   getSingleCourse,
//   updateCourse,
//   addSectionToCourse,
//   addLectureToSection,
//   getCourseById,
//   getInstructorCourses,
//   getInstructorCourseSections,
//   deleteLecture,
//   deleteSection,
//   getLectureById,
//   updateLectureById,
//   updateSectionByIdController,
//   markLectureAsCompleted,
//   submitCourseForReview,
//   reviewCourse,
//   publishCourse,
//   archiveCourse,
//   getCoursesByStatus,
//   getAdminNotes,
//   resubmitCourse,
//   // getInstructorStudents,
//   getMyCourseStudents,
// } from './course.controller'
// import { requireRole } from '../../middlewares/roleMiddleware'
// import authMiddleware from '../../middlewares/authMiddleware'
// import upload from '../../middlewares/upload'
// import validateRequest from '../../middlewares/validateRequest'

// const router = express.Router()

// // Create Course (with image upload)
// router.post(
//   '/',
//   authMiddleware,
//   requireRole(['admin', 'instructor']),
//   upload.any(),

//   createCourse
// )

// // Get all courses
// router.get('/', getAllCourses)

// router.get('/:instructorId/courses', authMiddleware, getInstructorCourses)

// router.get(
//   '/courses/:courseId/sections',
//   authMiddleware,
//   getInstructorCourseSections
// )
// router.delete(
//   '/lectures/:lectureId',
//   authMiddleware,
//   requireRole(['admin', 'instructor']),
//   deleteLecture
// )
// router.delete(
//   '/sections/:sectionId',
//   authMiddleware,
//   requireRole(['admin', 'instructor']),
//   deleteSection
// )

// // Get single course (basic info)
// router.get('/:id', getSingleCourse)

// router.put(
//   '/:courseId',
//   authMiddleware,
//   requireRole(['admin', 'instructor']),
//   upload.single('thumbnail'),
//   updateCourse
// )

// // Delete Course
// router.delete(
//   '/:id',
//   authMiddleware,
//   requireRole(['admin', 'instructor']),
//   deleteCourse
// )

// // Instructor students routes
// // router.get('/students', authMiddleware, getInstructorStudents)

// // Instructor নিজস্ব কোর্সের students দেখবে
// router.get(
//   '/courses/:courseId/students', // স্পষ্ট প্যারামিটার নাম
//   authMiddleware,
//   requireRole(['instructor']),
//   getMyCourseStudents
// )

// // 🔽 Course Details with Sections and Lectures
// router.get('/:courseId/details', authMiddleware, getCourseById) // Full nested info
// // router.get('/:courseId', authMiddleware, getCourseById)

// // ➕ Add Section to a Course
// router.post(
//   '/:courseId/section',
//   authMiddleware,
//   requireRole(['admin', 'instructor']),
//   addSectionToCourse
// )

// // ➕ Add Lecture to a Section
// router.post(
//   '/:courseId/sections/:sectionId/lectures',
//   authMiddleware,
//   // upload.any(),
//   // requireRole(['admin', 'instructor']),
//   upload.fields([
//     { name: 'video', maxCount: 1 },
//     { name: 'resourceFiles', maxCount: 10 }, // Dynamic resource handling
//   ]),
//   addLectureToSection
// )

// // GET specific lecture
// router.get(
//   '/courses/:courseId/sections/:sectionId/lectures/:lectureId',
//   authMiddleware,
//   requireRole(['instructor', 'admin']),
//   getLectureById
// )

// // PUT update lecture with video/resource uploads
// router.put(
//   '/courses/:courseId/sections/:sectionId/lectures/:lectureId',
//   authMiddleware,
//   requireRole(['instructor', 'admin']),
//   upload.fields([
//     { name: 'video', maxCount: 1 },
//     { name: 'resourceFiles', maxCount: 10 }, // নতুন আপডেটেড ভার্সন
//   ]),
//   updateLectureById
// )

// router.put(
//   '/courses/:courseId/sections/:sectionId',
//   authMiddleware,
//   requireRole(['instructor', 'admin']),
//   upload.fields([{ name: 'resourceFile', maxCount: 1 }]),
//   updateSectionByIdController
// )

// router.put(
//   '/lectures/:lectureId/complete',
//   authMiddleware,
//   markLectureAsCompleted
// )
// // requireRole(['admin']),
// // Status Management Routes
// router.post(
//   '/:courseId/submit',
//   authMiddleware,
//   requireRole(['instructor']),
//   submitCourseForReview
// )
// router.post(
//   '/:courseId/review',
//   authMiddleware,
//   requireRole(['admin']),
//   reviewCourse
// )
// router.post(
//   '/:courseId/publish',
//   authMiddleware,
//   requireRole(['instructor']),
//   publishCourse
// )
// router.post(
//   '/:courseId/archive',
//   authMiddleware,
//   requireRole(['instructor', 'admin']),
//   archiveCourse
// )
// router.get(
//   '/status/:status',
//   authMiddleware,
//   requireRole(['admin']),
//   getCoursesByStatus
// )

// // Update course
// // router.put(
// //   '/:courseId',
// //   authMiddleware,
// //   requireRole(['admin', 'instructor']),
// //   upload.single('thumbnail'),
// //   updateCourse
// // )

// router.get(
//   '/:courseId/admin-notes',
//   authMiddleware,
//   requireRole(['instructor', 'admin']),
//   getAdminNotes
// )

// router.post(
//   '/:courseId/resubmit',
//   authMiddleware,
//   requireRole(['instructor']),
//   resubmitCourse
// )

// export default router

import express from 'express'
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  getCourseById,
  getInstructorCourses,
  getInstructorCourseSections,
  getMyCourseStudents,
  getCoursesByStatus,
  getAdminNotes,
  submitCourseForReview,
  reviewCourse,
  publishCourse,
  archiveCourse,
  resubmitCourse,
  addSectionToCourse,
  updateSectionByIdController,
  deleteSection,
  addLectureToSection,
  getLectureById,
  updateLectureById,
  deleteLecture,
  markLectureAsCompleted,
} from './course.controller'

import { requireRole } from '../../middlewares/roleMiddleware'
import authMiddleware from '../../middlewares/authMiddleware'
import upload from '../../middlewares/upload'

const router = express.Router()

// 🔹 Course CRUD
router.post(
  '/',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.any(),
  createCourse
)

router.get('/', getAllCourses)
router.get('/:id', getSingleCourse)
router.put(
  '/:courseId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.single('thumbnail'),
  updateCourse
)
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  deleteCourse
)

// 🔹 Instructor Specific Courses
router.get('/:instructorId/courses', authMiddleware, getInstructorCourses)
router.get(
  '/:courseId/students',
  authMiddleware,
  requireRole(['instructor']),
  getMyCourseStudents
)

// 🔹 Nested Course Details
router.get('/:courseId/details', authMiddleware, getCourseById)

// 🔹 Section Management
router.post(
  '/:courseId/section',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  addSectionToCourse
)

router.put(
  '/courses/:courseId/sections/:sectionId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.fields([{ name: 'resourceFile', maxCount: 1 }]),
  updateSectionByIdController
)

router.delete(
  '/sections/:sectionId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  deleteSection
)

router.get('/:courseId/sections', authMiddleware, getInstructorCourseSections)

// 🔹 Lecture Management
router.post(
  '/:courseId/sections/:sectionId/lectures',
  authMiddleware,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'resourceFiles', maxCount: 10 },
  ]),
  addLectureToSection
)

router.get(
  '/courses/:courseId/sections/:sectionId/lectures/:lectureId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  getLectureById
)

router.put(
  '/courses/:courseId/sections/:sectionId/lectures/:lectureId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'resourceFiles', maxCount: 10 },
  ]),
  updateLectureById
)

router.delete(
  '/lectures/:lectureId',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  deleteLecture
)

router.put(
  '/lectures/:lectureId/complete',
  authMiddleware,
  markLectureAsCompleted
)

// 🔹 Status Management
router.post(
  '/:courseId/submit',
  authMiddleware,
  requireRole(['instructor']),
  submitCourseForReview
)

router.post(
  '/:courseId/review',
  authMiddleware,
  requireRole(['admin']),
  reviewCourse
)

router.post(
  '/:courseId/publish',
  authMiddleware,
  requireRole(['instructor']),
  publishCourse
)

router.post(
  '/:courseId/archive',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  archiveCourse
)

router.post(
  '/:courseId/resubmit',
  authMiddleware,
  requireRole(['instructor']),
  resubmitCourse
)

router.get(
  '/status/:status',
  authMiddleware,
  requireRole(['admin']),
  getCoursesByStatus
)

// 🔹 Admin Notes
router.get(
  '/:courseId/admin-notes',
  authMiddleware,
  requireRole(['admin', 'instructor']),
  getAdminNotes
)

export default router
