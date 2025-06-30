import { Types } from 'mongoose'
import { Order } from '../order/order.model'
import { Earnings } from './earnings.model'
import User from '../user/user.model'
// import { User } from '../user/user.model';

const PAYMENT_GATEWAY_FEE_PERCENT = 3 // 3% Stripe/SSLCommerz fee

export class EarningsService {
  static async createEarningRecord(orderId: Types.ObjectId) {
    const order = await Order.findById(orderId).populate('courseId')
    if (!order) throw new Error('Order not found')

    const course = order.courseId

    // চেক করুন যে course একটি ObjectId নাকি ICourse
    if (course instanceof Types.ObjectId) {
      throw new Error('Course is not populated')
    }

    // এখন TypeScript জানবে course অবশ্যই ICourse টাইপের
    const instructor = await User.findById(course.instructor)
    if (!instructor) throw new Error('Instructor not found')

    // Determine student source (simplified logic)
    const studentSource = order.transactionId.includes('AFF')
      ? 'affiliate'
      : 'platform' // Add your actual logic here

    // Calculate earnings based on your revenue model
    const { grossAmount, platformFee, instructorEarnings, affiliateFee } =
      this.calculateEarnings(order.amount, studentSource)

    const earning = new Earnings({
      instructorId: course.instructor,
      orderId: order._id,
      courseId: course._id,
      studentSource,
      grossAmount,
      platformFee,
      affiliateFee,
      instructorEarnings,
      paymentGatewayFee: (order.amount * PAYMENT_GATEWAY_FEE_PERCENT) / 100,
      status: 'pending',
    })

    return await earning.save()
  }

  private static calculateEarnings(
    amount: number,
    source: 'instructor' | 'platform' | 'affiliate'
  ) {
    let platformFee = 0
    let instructorEarnings = 0
    let affiliateFee = 0

    switch (source) {
      case 'instructor':
        platformFee = amount * 0.2 // 20%
        instructorEarnings = amount * 0.8 // 80%
        break
      case 'platform':
        platformFee = amount * 0.5 // 50%
        instructorEarnings = amount * 0.5 // 50%
        break
      case 'affiliate':
        platformFee = amount * 0.25 // 25%
        instructorEarnings = amount * 0.25 // 25%
        affiliateFee = amount * 0.5 // 50%
        break
    }

    return {
      grossAmount: amount,
      platformFee,
      instructorEarnings,
      affiliateFee,
    }
  }

  static async getInstructorEarnings(instructorId: string) {
    return Earnings.aggregate([
      { $match: { instructorId: new Types.ObjectId(instructorId) } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$instructorEarnings' },
          pendingEarnings: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] },
                '$instructorEarnings',
                0,
              ],
            },
          },
          paidEarnings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$instructorEarnings', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEarnings: 1,
          pendingEarnings: 1,
          paidEarnings: 1,
        },
      },
    ])
  }

  static async getAdminRevenue() {
    return Earnings.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grossAmount' },
          platformEarnings: { $sum: '$platformFee' },
          pendingRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$platformFee', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          platformEarnings: 1,
          pendingRevenue: 1,
        },
      },
    ])
  }
}
