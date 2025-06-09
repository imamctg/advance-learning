import { Request, Response, NextFunction, RequestHandler } from 'express'

export const requireRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient role' })
      return
    }

    next()
  }
}
