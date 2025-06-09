// order.service.ts

import { Order } from './order.model'

export const createNewOrder = async (orderData: {
  userId: string
  courseId: string
  amount: number
  paymentType: string
  receiptUrl?: string
  transactionId?: string
}) => {
  const newOrder = new Order({
    userId: orderData.userId,
    courseId: orderData.courseId,
    amount: orderData.amount,
    paymentType: orderData.paymentType,
    transactionId: orderData.transactionId,
    status: 'pending',
    receiptUrl: orderData.receiptUrl,
  })

  const savedOrder = await newOrder.save()
  return savedOrder
}

export const getOrdersByUserId = async (userId: string) => {
  const orders = await Order.find({ userId }).populate('courseId')
  return orders
}
