// import { Request, Response } from 'express'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import User from '../user/user.model'
// import { profile } from 'console'

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, password, confirmPassword } = req.body

//     if (password !== confirmPassword) {
//       res.status(400).json({ message: 'Passwords do not match.' })
//       return
//     }

//     const userExist = await User.findOne({ email })
//     if (userExist) {
//       res.status(400).json({ message: 'User already exists' })
//       return
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     })

//     res.status(201).json({
//       success: true,
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     })
//   } catch (error: any) {
//     console.error('❌ Registration error:', error)
//     res
//       .status(500)
//       .json({ message: 'Something went wrong', error: error.message || error })
//   }
// }

// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body
//   const { userId } = req.params
//   console.log(userId)
//   console.log('login', email, password)
//   try {
//     // ইমেইল দিয়ে ইউজার খোঁজা
//     const user = await User.findOne({ email })
//     console.log(user)
//     if (!user) {
//       // return বাদ দেওয়া হয়েছে
//       res
//         .status(400)
//         .json({ success: false, message: 'Invalid email or password ' })
//       return
//     }

//     // bcrypt দিয়ে পাসওয়ার্ড ম্যাচ করা
//     const isPasswordMatch = await bcrypt.compare(password, user.password)

//     if (!isPasswordMatch) {
//       // return বাদ দেওয়া হয়েছে
//       res
//         .status(400)
//         .json({ success: false, message: 'Invalid email or password' })
//       return
//     }

//     // Optional: Token তৈরির অংশ যদি চান
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
//       expiresIn: '7d',
//     })

//     // ইউজার ইনফো সহ সফল লগইন রেসপন্স
//     res.status(200).json({
//       success: true,
//       message: 'Login successful!',
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profileImage: user.profileImage,
//         token,
//         role: user.role,
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ success: false, message: 'Something went wrong!' })
//   }
// }

// export const getProfile = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const user = await User.findById((req as any).user.id).select('-password')
//     if (!user) {
//       res.status(404).json({ message: 'User not found' })
//       return
//     }

//     res.status(200).json({
//       success: true,
//       user,
//     })
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error })
//   }
// }

import { Request, Response } from 'express'
import { handleLogin, handleRegister, handleGetProfile } from './auth.service'

export const register = async (req: Request, res: Response): Promise<void> => {
  await handleRegister(req, res)
}

export const login = async (req: Request, res: Response): Promise<void> => {
  await handleLogin(req, res)
}

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  await handleGetProfile(req, res)
}
