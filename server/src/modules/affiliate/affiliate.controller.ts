// server/src/controllers/affiliate.controller.ts
import { Response } from 'express'
import * as AffiliateService from './affiliate.service'
import { AuthRequest } from '../../middlewares/authMiddleware'
import { Earnings, IEarnings } from '../earnings/earnings.model'

export const getAffiliateStats = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const stats = await AffiliateService.getStats(userId)

    return res.json(stats)
  } catch (err) {
    console.error('getAffiliateStats error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAffiliateLinks = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const links = await AffiliateService.getLinks(userId)
    return res.json({ links })
  } catch (err) {
    console.error('getAffiliateLinks error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const createAffiliateLink = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { label, targetUrl, slug } = req.body

    if (!targetUrl)
      return res.status(400).json({ message: 'targetUrl is required' })

    const link = await AffiliateService.createLink({
      userId,
      label,
      targetUrl,
      slug,
    })

    return res.status(201).json({ link })
  } catch (err: any) {
    console.error('createAffiliateLink error', err)
    return res
      .status(500)
      .json({ message: err.message || 'Internal server error' })
  }
}

export const getLinkClicks = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { linkId } = req.params
    const { page = '1', limit = '25' } = req.query

    const clicks = await AffiliateService.getLinkClicks(userId, linkId, {
      page: Number(page),
      limit: Number(limit),
    })
    return res.json({ clicks })
  } catch (err) {
    console.error('getLinkClicks error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// export const getEarnings = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<any> => {
//   try {
//     const userId = req.user!._id.toString()
//     console.log(userId, 'userId')
//     const earnings = await AffiliateService.getEarnings(userId)
//     return res.json({ earnings })
//   } catch (err) {
//     console.error('getEarnings error', err)
//     return res.status(500).json({ message: 'Internal server error' })
//   }
// }

// backend/controller
export const getEarnings = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()

    // double cast দিয়ে warning বন্ধ করো
    const earnings = (await AffiliateService.getEarnings(
      userId
    )) as unknown as (IEarnings & { createdAt: Date })[]

    const total = earnings.reduce((acc, e) => acc + (e.affiliateFee ?? 0), 0)
    const today = earnings
      .filter(
        (e) =>
          e.createdAt &&
          new Date(e.createdAt).toDateString() === new Date().toDateString()
      )
      .reduce((acc, e) => acc + (e.affiliateFee ?? 0), 0)

    const summary = {
      today,
      monthly: total,
      weeklyBonus: 0,
      monthlyBonus: 0,
      total,
    }

    const history = earnings.map((e) => ({
      date: e.createdAt,
      amount: e.affiliateFee ?? 0,
      type: 'earning',
      description: `Earning from order ${e.orderId.toString()}`,
      status: e.status,
      method: e.meta?.method ?? 'Affiliate',
    }))

    const chartData = history

    return res.json({ summary, history, chartData })
  } catch (err) {
    console.error('getEarnings error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const requestPayout = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { amount, method, details } = req.body

    if (!amount || !method)
      return res.status(400).json({ message: 'amount and method required' })

    const payout = await AffiliateService.requestPayout(userId, {
      affiliateFee: amount,
      method,
      details,
    })
    return res.status(201).json({ payout })
  } catch (err) {
    console.error('requestPayout error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getReports = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user!._id.toString()
    const { from, to, groupBy } = req.query
    const report = await AffiliateService.getReport(userId, {
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      groupBy: typeof groupBy === 'string' ? groupBy : undefined,
    })
    return res.json(report)
  } catch (err) {
    console.error('getReports error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
