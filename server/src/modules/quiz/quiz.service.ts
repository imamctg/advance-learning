import { Quiz } from './quiz.model'

export const createQuiz = async (data: {
  lectureId: string
  question: string
  options: string[]
  correctAnswer: string
}) => {
  return await Quiz.create(data)
}

export const getQuizzesByLecture = async (lectureId: string) => {
  return await Quiz.find({ lectureId })
}

export const deleteQuiz = async (quizId: string) => {
  return await Quiz.findByIdAndDelete(quizId)
}

export const updateQuiz = async (
  quizId: string,
  data: {
    question?: string
    options?: string[]
    correctAnswer?: string
  }
) => {
  return await Quiz.findByIdAndUpdate(quizId, data, { new: true })
}
