import mongoose, { Schema, Document, Types } from 'mongoose'

const lectureSchema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number },
  isFreePreview: { type: Boolean, default: false },
  description: { type: String },
  resourceUrl: { type: String },
})

const sectionSchema = new Schema({
  title: { type: String, required: true },
  lectures: [lectureSchema],
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
})

// Course Status Enum
export const COURSE_STATUSES = [
  'draft',
  'pending',
  'published',
  'rejected',
  'archived',
] as const
export type CourseStatus = (typeof COURSE_STATUSES)[number]

export interface ICourse extends Document {
  title: string
  description: string
  price: number
  instructor: Types.ObjectId | string
  thumbnail: string
  introVideo: string
  sections: Types.DocumentArray<any>
  students: Types.ObjectId[]
  status: CourseStatus
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: { type: String, required: true },
    introVideo: { type: String, required: true },
    sections: [sectionSchema],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Course Status Logic
    status: {
      type: String,
      enum: COURSE_STATUSES,
      default: 'draft',
    },

    // Optional admin feedback
    adminNote: {
      type: String,
    },
  },
  { timestamps: true }
)

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema)

export default Course
