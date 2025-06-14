import { Request, Response } from 'express'
import * as quizService from './quiz.service'

export const addQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await quizService.createQuiz(req.body)
    res.status(201).json(quiz)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add quiz' })
  }
}

export const getLectureQuizzes = async (req: Request, res: Response) => {
  try {
    const { lectureId } = req.params
    const quizzes = await quizService.getQuizzesByLecture(lectureId)
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quizzes' })
  }
}

export const deleteQuizById = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params
    await quizService.deleteQuiz(quizId)
    res.json({ message: 'Quiz deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quiz' })
  }
}

export const updateQuizById = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params
    const updated = await quizService.updateQuiz(quizId, req.body)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quiz' })
  }
}
