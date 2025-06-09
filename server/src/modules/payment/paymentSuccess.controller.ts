// // routes/payment.ts
// import express, { Request, Response } from 'express'
// import { Order } from '../order/order.model' // তোমার Order মডেল

// const router = express.Router()

// export const paymentSuccess = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { tran_id, val_id, amount, status } = req.body

//     // tran_id হলো orderId যা তুমি আগেই পাঠিয়েছিলে
//     // Update order status by transactionId (NOT _id)
//     const updatedOrder = await Order.findOneAndUpdate(
//       { transactionId: tran_id },
//       { status: 'success' },
//       { new: true }
//     )

//     if (!updatedOrder) {
//       return res.status(404).json({ message: 'Order not found' })
//     }

//     // তুমি চাইলে এখানে email পাঠাতে পারো, বা অন্য লজিক চালাতে পারো
//     res.status(200).json({ message: 'Payment successful', order: updatedOrder })
//   } catch (err) {
//     console.error('Payment success handler error:', err)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }

import express, { Request, Response } from 'express'
import { Order } from '../order/order.model'

const router = express.Router()

export const paymentSuccess = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { tran_id, userId, courseId } = req.query
    console.log('paymentSuccess')
    if (!tran_id || !userId || !courseId) {
      return res.status(400).json({ message: 'Missing query parameters' })
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId: tran_id },
      {
        status: 'success',
        userId,
        courseId,
      },
      { new: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // res.status(200).json({ message: 'Payment successful', order: updatedOrder })
    res.redirect(
      `http://localhost:3000/payment/success?tran_id=${tran_id}&userId=${userId}&courseId=${courseId}`
    )
  } catch (err) {
    console.error('Payment success handler error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
