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
    req.user = await User.findById(decoded.id).select('-password')
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

// src/middlewares/authMiddleware.ts

// import { Request, Response, NextFunction } from 'express'
// import jwt from 'jsonwebtoken'
// import User, { IUser } from '../modules/user/user.model'

// // ✅ টাইপ নির্দিষ্ট করা
// export interface AuthRequest extends Request {
//   user?: IUser
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

//     const user = await User.findById(decoded.id).select('-password')
//     if (!user) {
//       res.status(401).json({ message: 'User not found' })
//       return
//     }

//     req.user = user
//     next()
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' })
//   }
// }

// export default authMiddleware
