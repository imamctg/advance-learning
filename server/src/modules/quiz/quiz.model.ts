import mongoose, { Schema, Document } from 'mongoose'

export interface IQuiz extends Document {
  lectureId: mongoose.Types.ObjectId
  question: string
  options: string[]
  correctAnswer: string
}

const quizSchema = new Schema<IQuiz>(
  {
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: 'Course', // যেহেতু lecture embedded, তাই Course থেকেই খোঁজা হবে
      required: true,
    },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  },
  { timestamps: true }
)

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema)
