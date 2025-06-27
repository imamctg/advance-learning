// import express, { Request, Response } from 'express'
// import { Order } from '../order/order.model'

// const router = express.Router()

// export const paymentSuccess = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { tran_id, userId, courseId } = req.query
//     console.log('paymentSuccess')
//     if (!tran_id || !userId || !courseId) {
//       return res.status(400).json({ message: 'Missing query parameters' })
//     }

//     const updatedOrder = await Order.findOneAndUpdate(
//       { transactionId: tran_id },
//       {
//         status: 'success',
//         userId,
//         courseId,
//       },
//       { new: true }
//     )

//     if (!updatedOrder) {
//       return res.status(404).json({ message: 'Order not found' })
//     }

//     // res.status(200).json({ message: 'Payment successful', order: updatedOrder })
//     res.redirect(
//       `http://localhost:3000/payment/success?tran_id=${tran_id}&userId=${userId}&courseId=${courseId}`
//     )
//   } catch (err) {
//     console.error('Payment success handler error:', err)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }

// paymentSuccess.controller.ts
import { Order } from '../order/order.model'
import Course from '../course/course.model'
import User from '../user/user.model'
import { Request, Response } from 'express'

export const paymentSuccess = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { tran_id, userId, courseId } = req.query
    console.log('paymentSuccess:', { tran_id, userId, courseId })

    if (!tran_id || !userId || !courseId) {
      return res.status(400).json({ message: 'Missing parameters' })
    }

    // 1. অর্ডার স্ট্যাটাস আপডেট করুন
    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId: tran_id },
      { status: 'paid' },
      { new: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // 2. কোর্সে student যোগ করুন (যদি আগে না থাকে)
    await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: { students: userId },
        $push: { studentsEnrolledAt: new Date() },
      },
      { new: true }
    )

    // 3. User-এর purchasedCourses-এ কোর্স যোগ করুন
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { purchasedCourses: courseId } },
      { new: true }
    )

    // 4. ক্লায়েন্টকে রিডাইরেক্ট করুন
    res.redirect(
      `http://localhost:3000/payment/success?tran_id=${tran_id}&userId=${userId}&courseId=${courseId}`
    )
  } catch (err) {
    console.error('Payment success error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
