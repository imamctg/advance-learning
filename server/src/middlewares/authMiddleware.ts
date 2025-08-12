// import { Request, Response, NextFunction } from 'express'
// import jwt from 'jsonwebtoken'
// import User from '../modules/user/user.model'

// export interface AuthRequest extends Request {
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
//     console.log('Received Token:', token)
//     if (!process.env.JWT_SECRET) {
//       throw new Error('JWT_SECRET is not defined in environment variables')
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
//     console.log('Decoded Token:', decoded)

//     req.user = await User.findById(decoded.id).select('_id role password')
//     console.log('Found User:', req.user)
//     if (!req.user) {
//       res.status(401).json({ message: 'User not found' })
//       return
//     }
//     console.log('auth middleware checking')
//     next()
//   } catch (error) {
//     console.error('JWT Verify Error:', error)
//     res.status(401).json({ message: 'Invalid token' })
//     return
//   }
// }

// export default authMiddleware

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../modules/user/user.model'

export interface AuthRequest extends Request {
  user?: any
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string }

    req.user = await User.findById(decoded.id).select('_id role')
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    next()
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default authMiddleware
