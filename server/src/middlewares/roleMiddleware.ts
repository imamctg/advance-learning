// import { Request, Response, NextFunction, RequestHandler } from 'express'

// export const requireRole = (roles: string[]): RequestHandler => {
//   return (req, res, next) => {
//     const user = (req as any).user
//     console.log('User role:', user.role)
//     console.log('Required roles:', roles)

//     if (!user) {
//       res.status(401).json({ message: 'Unauthorized' })
//       return
//     }

//     if (!roles.includes(user.role)) {
//       res.status(403).json({ message: 'Forbidden: Insufficient role' })
//       return
//     }

//     next()
//   }
// }

import { Request, Response, NextFunction } from 'express'

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user

    if (!user || !user.role) {
      res.status(401).json({ message: 'Unauthorized: Role missing' })
      return
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient role' })
      return
    }

    next()
  }
}
