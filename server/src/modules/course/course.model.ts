import mongoose, { Schema, Document, Types } from 'mongoose'

// ---------- ENUM ----------
export const COURSE_STATUSES = [
  'draft',
  'pending',
  'published',
  'rejected',
  'archived',
  'approved',
] as const
export type CourseStatus = (typeof COURSE_STATUSES)[number]

// ---------- INTERFACES ----------
export interface ILecture extends Document {
  _id: Types.ObjectId
  title: string
  videoUrl: string
  duration?: number
  isFreePreview?: boolean
  description?: string
  resources: { type: string; name: string; url: string; mimeType: string }[]
  resourceUrl?: string
  resourcePublicId?: string
  resourceType?: string
}

export interface ISection extends Document {
  _id: Types.ObjectId
  title: string
  lectures: Types.DocumentArray<ILecture>
  quiz?: Types.ObjectId
}

export interface ICourse extends Document {
  title: string
  description: string
  price: number
  instructor: Types.ObjectId | string
  thumbnail: string
  introVideo: string
  sections: Types.DocumentArray<ISection>
  students: Types.ObjectId[]
  status: CourseStatus
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

// ---------- SCHEMAS ----------

const resourceSchema = new Schema(
  {
    type: { type: String, enum: ['file', 'link'], required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String }, // Only for file resources
  },
  { _id: false }
)

const lectureSchema = new Schema<ILecture>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number },
    isFreePreview: { type: Boolean, default: false },
    description: { type: String },
    resources: [resourceSchema],
  },
  { _id: true }
)

// const lectureSchema = new Schema<ILecture>(
//   {
//     title: { type: String, required: true },
//     videoUrl: { type: String, required: true },
//     duration: { type: Number },
//     isFreePreview: { type: Boolean, default: false },
//     description: { type: String },
//     resourceUrl: { type: String },
//   },
//   { _id: true } // ensures each lecture gets its own _id
// )

const sectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    lectures: [lectureSchema],
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
  },
  { _id: true }
)

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
    status: {
      type: String,
      enum: COURSE_STATUSES,
      default: 'draft',
    },
    adminNote: { type: String },
  },
  { timestamps: true }
)

// ---------- MODEL ----------
export const Course =
  mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema)

export default Course
