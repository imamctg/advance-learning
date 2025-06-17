import { Router } from 'express'
import * as quizCtrl from './quiz.controller'
import authMiddleware from '../../middlewares/authMiddleware'

const router = Router({ mergeParams: true })

router.use(authMiddleware)

router.get('/course/:courseId', quizCtrl.getCourseQuizzes)
router.get('/:quizId', quizCtrl.getQuizDetails)

// Lecture Quiz Routes
router.put('/:quizId', quizCtrl.updateQuiz)
router.delete('/:quizId', quizCtrl.deleteQuiz)

router.post('/lectures/:lectureId', quizCtrl.createQuiz)
router.get('/lectures/:lectureId', quizCtrl.getQuiz)
// router.put('/lectures/:lectureId', quizCtrl.updateQuiz)
// router.delete('/lectures/:lectureId', quizCtrl.deleteQuiz)

// Section Quiz Routes
router.post('/sections/:sectionId', quizCtrl.createQuiz)
router.get('/sections/:sectionId', quizCtrl.getQuiz)
// router.put('/sections/:sectionId', quizCtrl.updateQuiz)
// router.delete('/sections/:sectionId', quizCtrl.deleteQuiz)

router.get('/student/:quizId', authMiddleware, quizCtrl.getStudentQuiz)

router.post('/submit/:quizId', authMiddleware, quizCtrl.submitQuiz)

router.get('/results/:courseId', authMiddleware, quizCtrl.getQuizResults)

export default router
