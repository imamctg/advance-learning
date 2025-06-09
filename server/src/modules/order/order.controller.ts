// import { Request, Response } from 'express'
// import { Order } from './order.model'

// export const createOrder = async (req: Request, res: Response) => {
//   try {
//     const { userId, courseId, amount, paymentType, receiptUrl, transactionId } =
//       req.body
//     console.log('createorder', req.body)
//     const newOrder = new Order({
//       userId,
//       courseId,
//       amount,
//       paymentType,
//       transactionId, // ✅ এখানে tran_id রাখছো
//       status: 'pending', // ✅ কারণ পেমেন্ট এখনো success হয়নি

//       receiptUrl,
//     })

//     const savedOrder = await newOrder.save()
//     res.status(201).json(savedOrder)
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create order', error })
//   }
// }

// export const getOrdersByUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.userId

//     const orders = await Order.find({ userId }).populate('courseId')
//     res.status(200).json(orders)
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch orders', error })
//   }
// }

// order.controller.ts

import { Request, Response } from 'express'
import { createNewOrder, getOrdersByUserId } from './order.service'

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, amount, paymentType, receiptUrl, transactionId } =
      req.body
    console.log('createOrder:', req.body)

    const savedOrder = await createNewOrder({
      userId,
      courseId,
      amount,
      paymentType,
      receiptUrl,
      transactionId,
    })

    res.status(201).json(savedOrder)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error })
  }
}

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const orders = await getOrdersByUserId(userId)
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error })
  }
}
