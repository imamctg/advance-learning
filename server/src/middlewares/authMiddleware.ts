// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../modules/user/user.model'

interface AuthRequest extends Request {
  user?: any
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    // req.user = await User.findById(decoded.id).select('_id role password')
    // req.user = await User.findById(decoded.id).select('password')
    req.user = await User.findById(decoded.id).select('password role')
    console.log('Decoded token:', decoded)
    console.log('Found user:', req.user)
    if (!req.user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }
}

export default authMiddleware

// import { Request, Response, NextFunction } from 'express'
// import jwt from 'jsonwebtoken'
// import User from '../modules/user/user.model'

// interface AuthRequest extends Request {
//   user?: any
// }

// const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const token = req.headers.authorization?.split(' ')[1]

//   if (!token) {
//     res.status(401).json({ message: 'No token provided' })
//     return
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

//     const user = await User.findById(decoded.id).select('_id name email role')

//     if (!user) {
//       res.status(401).json({ message: 'User not found' })
//       return
//     }

//     req.user = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     }

//     next()
//   } catch (error) {
//     console.error('JWT verify failed:', error)
//     res.status(401).json({ message: 'Invalid token' })
//   }
// }

// export default authMiddleware
