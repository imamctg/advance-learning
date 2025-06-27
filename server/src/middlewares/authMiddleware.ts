// // src/middlewares/authMiddleware.ts

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
//     req.user = await User.findById(decoded.id).select('_id role password')
//     if (!req.user) {
//       res.status(401).json({ message: 'User not found' })
//       return
//     }
//     next()
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' })
//     return
//   }
// }

// export default authMiddleware

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../modules/user/user.model'

interface JwtPayload {
  id: string
}

interface AuthRequest extends Request {
  user?: {
    _id: any
    id?: string
    role: string
    // অন্যান্য প্রয়োজনীয় ফিল্ড
  }
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: 'Authorization token missing' })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const user = await User.findById(decoded.id).select('_id role')

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' })
      return
    }

    req.user = {
      _id: user._id,
      id: user._id.toString(), // দু'ভাবেই একসেস করা যায়
      role: user.role,
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Invalid token',
    })
  }
}

export default authMiddleware
