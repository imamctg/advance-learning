import express from 'express'
import { EarningsService } from './earnings.service'
// import { auth } from '../../middlewares/auth'
// import { UserRole } from '../user/user.model'
import authMiddleware from '../../middlewares/authMiddleware'
import { requireRole } from '../../middlewares/roleMiddleware'

const router = express.Router()

router.get(
  '/instructor',
  authMiddleware,
  requireRole(['instructor']),
  async (req, res) => {
    console.log('req.user._id', req.user._id)
    try {
      const result = await EarningsService.getInstructorEarnings(req.user._id)
      res.json(
        result[0] || {
          totalEarnings: 0,
          pendingEarnings: 0,
          paidEarnings: 0,
        }
      )
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
)

router.get(
  '/admin',
  authMiddleware,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const result = await EarningsService.getAdminRevenue()
      res.json(
        result[0] || {
          totalRevenue: 0,
          platformEarnings: 0,
          pendingRevenue: 0,
          chartData: [], // Add chart data structure
          paymentHistory: [], // Add payment history
        }
      )
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
)

export const EarningsRoutes = router
