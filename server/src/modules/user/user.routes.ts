// src/routes/user.routes.ts
import express from 'express'
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserInfo,
  addCourseToUser,
  getUserCourses,
  updateInstructorStatus,
} from './user.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import upload from '../../middlewares/upload'
import validateRequest from '../../middlewares/validateRequest'
import { updateUserValidation } from './user.validation'

const router = express.Router()

// router.get('/', authMiddleware, requireRole(['admin']), getAllUsers)
router.get('/', getAllUsers)
router.patch(
  '/:id/role',
  authMiddleware,
  requireRole(['admin']),
  updateUserRole
)

// Admin update instructor status
router.put(
  '/admin/instructor/:userId/status',
  authMiddleware,
  requireRole(['admin']),
  updateInstructorStatus
)

router.put(
  '/:id',
  authMiddleware,
  validateRequest(updateUserValidation),
  upload.single('profileImage'),
  updateUserInfo
)
// router.delete('/:id', authMiddleware, requireRole(['admin']), deleteUser)
// router.delete('/:id', authMiddleware, deleteUser)
router.delete('/:id', deleteUser)

router.post('/add-course', addCourseToUser)
router.get('/:id/courses', getUserCourses)

export default router
