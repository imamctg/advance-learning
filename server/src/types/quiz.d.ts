import { Document, Types } from 'mongoose'

export interface IQuestion {
  questionText: string
  options: string[]
  correctAnswerIndex: number
  explanation?: string
}

export interface IQuiz extends Document {
  title: string
  questions: IQuestion[]
}
