import express from 'express'
import {
  addQuiz,
  getLectureQuizzes,
  deleteQuizById,
  updateQuizById,
} from './quiz.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'
import { getCourseById } from '../course/course.controller'

const router = express.Router()

router.get('/courses/:courseId/quizzes', authMiddleware, getCourseById)
router.post('/', authMiddleware, requireRole(['instructor']), addQuiz)
router.get('/:lectureId', authMiddleware, getLectureQuizzes)

router.delete(
  '/:quizId',
  authMiddleware,
  requireRole(['instructor']),
  deleteQuizById
)
router.put(
  '/:quizId',
  authMiddleware,
  requireRole(['instructor']),
  updateQuizById
)

export default router
