// import mongoose, { Schema, Document, Types } from 'mongoose'

// // Step 1: Define allowed roles
// export const USER_ROLES = [
//   'student',
//   'instructor',
//   'moderator',
//   'developer',
//   'admin',
// ] as const
// export type UserRole = (typeof USER_ROLES)[number]

// // Step 2: Interface
// export interface IUser extends Document {
//   name: string
//   email: string
//   password: string
//   profileImage?: string
//   role: UserRole
//   status?: 'pending' | 'approved' | 'rejected'
//   bio?: string
//   website?: string
//   experience?: string
//   nidFileUrl?: string
//   purchasedCourses: Types.ObjectId[]
//   createdCourses: Types.ObjectId[]
//   certificates: {
//     courseId: Types.ObjectId
//     certificateUrl: string
//     issuedAt: Date
//   }[]
//   createdAt: Date
//   updatedAt: Date
// }

// // Step 3: Schema
// const userSchema: Schema<IUser> = new Schema<IUser>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     profileImage: { type: String },
//     role: {
//       type: String,
//       enum: USER_ROLES,
//       default: 'student',
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected'],
//       default: 'pending',
//     },
//     bio: { type: String },
//     website: { type: String },
//     experience: { type: String },
//     nidFileUrl: { type: String },

//     purchasedCourses: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course',
//       },
//     ],
//     createdCourses: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course',
//       },
//     ],
//     certificates: [
//       {
//         courseId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Course',
//           required: true,
//         },
//         certificateUrl: {
//           type: String,
//           required: true,
//         },
//         issuedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// )

// const User = mongoose.model<IUser>('User', userSchema)
// export default User

// src/modules/user/user.model.ts

import mongoose, { Schema, Document, Types } from 'mongoose'

export const USER_ROLES = [
  'student',
  'instructor',
  'moderator',
  'developer',
  'admin',
] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId

  name: string
  email: string
  password: string
  profileImage?: string
  role: UserRole
  status?: 'pending' | 'approved' | 'rejected'
  bio?: string
  website?: string
  experience?: string
  nidFileUrl?: string
  purchasedCourses: Types.ObjectId[]
  createdCourses: Types.ObjectId[]
  certificates: {
    courseId: Types.ObjectId
    certificateUrl: string
    issuedAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'student',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    bio: { type: String },
    website: { type: String },
    experience: { type: String },
    nidFileUrl: { type: String },

    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: [],
      },
    ],
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    certificates: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
        certificateUrl: {
          type: String,
          required: true,
        },
        issuedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model<IUser>('User', userSchema)
export default User
