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
    console.log('Received Token:', token)

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    console.log('Decoded Token:', decoded)

    req.user = await User.findById(decoded.id).select('_id role password')
    console.log('Found User:', req.user)
    if (!req.user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    console.log('auth middleware checking')
    next()
  } catch (error) {
    console.error('JWT Verify Error:', error)
    res.status(401).json({ message: 'Invalid token' })
    return
  }
}

export default authMiddleware
