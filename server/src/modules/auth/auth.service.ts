import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../user/user.model'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'
import fs from 'fs'

// export const handleRegister = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
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

// export const handleRegister = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       confirmPassword,
//       role,
//       bio,
//       website,
//       experience,
//     } = req.body

//     if (password !== confirmPassword) {
//       res.status(400).json({ message: 'Passwords do not match.' })
//       return
//     }

//     const userExist = await User.findOne({ email })
//     if (userExist) {
//       res.status(400).json({ message: 'User already exists' })
//       return
//     }

//     let nidFileUrl = ''

//     // If instructor, upload nidFile to cloudinary
//     if (role === 'instructor') {
//       if (!req.file) {
//         res.status(400).json({ message: 'NID file is required for instructors' })
//         return
//       }

//       const uploadResult = await uploadToCloudinary(req.file.path)
//       nidFileUrl = uploadResult.secure_url

//       // Delete temp file after upload
//       fs.unlinkSync(req.file.path)
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'student',
//       bio: role === 'instructor' ? bio : undefined,
//       website: role === 'instructor' ? website : undefined,
//       experience: role === 'instructor' ? experience : undefined,
//       nidFileUrl: role === 'instructor' ? nidFileUrl : undefined,
//       status: role === 'instructor' ? 'pending' : 'approved',
//     })

//     res.status(201).json({
//       success: true,
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//       },
//     })
//   } catch (error: any) {
//     console.error('❌ Registration error:', error)
//     res
//       .status(500)
//       .json({ message: 'Something went wrong', error: error.message || error })
//   }
// }

export const handleRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      bio,
      website,
      experience,
    } = req.body
    console.log(req.body, req.file, 'auth.service')
    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match.' })
      return
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    let nidFileUrl = ''

    if (role === 'instructor') {
      if (!req.file) {
        res
          .status(400)
          .json({ message: 'NID file is required for instructors' })
        return
      }

      const fileBuffer = req.file.buffer
      const folder = 'instructors/nid'
      const filename = `${Date.now()}-${req.file.originalname}`

      // nidFileUrl = await uploadToCloudinary(
      //   fileBuffer,
      //   folder,
      //   filename,
      //   'image'
      // )

      const nidUpload = await uploadToCloudinary(
        fileBuffer,
        'instructors/nid',
        `nid_${Date.now()}`,
        'image'
      )
      nidFileUrl = nidUpload.secure_url // ✅ correct
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      bio: role === 'instructor' ? bio : undefined,
      website: role === 'instructor' ? website : undefined,
      experience: role === 'instructor' ? experience : undefined,
      nidFileUrl: role === 'instructor' ? nidFileUrl : undefined,
      status: role === 'instructor' ? 'pending' : 'approved',
    })

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error: any) {
    console.error('❌ Registration error:', error)
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message || error })
  }
}

export const handleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body
  const { userId } = req.params
  console.log(userId)
  console.log('login', email, password)

  try {
    const user = await User.findOne({ email })
    console.log(user)

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid email or password ' })
      return
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid email or password' })
      return
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Something went wrong!' })
  }
}

export const handleGetProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).user.id).select('-password')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
}
