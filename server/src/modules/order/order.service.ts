// // order.service.ts

// import { Order } from './order.model'

// export const createNewOrder = async (orderData: {
//   userId: string
//   courseId: string
//   amount: number
//   paymentType: string
//   receiptUrl?: string
//   transactionId?: string
// }) => {
//   const newOrder = new Order({
//     userId: orderData.userId,
//     courseId: orderData.courseId,
//     amount: orderData.amount,
//     paymentType: orderData.paymentType,
//     transactionId: orderData.transactionId,
//     // status: 'pending',
//     status: 'paid',
//     receiptUrl: orderData.receiptUrl,
//   })

//   const savedOrder = await newOrder.save()
//   return savedOrder
// }

// export const getOrdersByUserId = async (userId: string) => {
//   const orders = await Order.find({ userId }).populate('courseId')
//   return orders
// }

// order.service.ts
import { Types } from 'mongoose'
import { Order } from './order.model'
import { EarningsService } from '../earnings/earnings.service'
// import { EarningsService } from '../earnings/earnings.service';

export const OrderService = {
  async createNewOrder(orderData: {
    userId: string
    courseId: string
    amount: number
    paymentType: string
    receiptUrl?: string
    transactionId?: string
  }) {
    const newOrder = new Order({
      userId: orderData.userId,
      courseId: orderData.courseId,
      amount: orderData.amount,
      paymentType: orderData.paymentType,
      transactionId: orderData.transactionId,
      status: 'pending', // প্রথমে pending স্ট্যাটাসে রাখুন
      receiptUrl: orderData.receiptUrl,
    })

    const savedOrder = await newOrder.save()
    return savedOrder
  },

  async completeOrder(orderId: Types.ObjectId) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'paid' },
      { new: true }
    ).populate('courseId')

    if (!order) {
      throw new Error('Order not found')
    }

    // আর্নিংস রেকর্ড তৈরি
    await EarningsService.createEarningRecord(order._id)

    return order
  },

  async getOrdersByUserId(userId: string) {
    const orders = await Order.find({ userId }).populate('courseId')
    return orders
  },

  // পেমেন্ট সাকসেস হলে এই মেথড কল করুন
  async handleSuccessfulPayment(orderId: Types.ObjectId, receiptUrl: string) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'paid',
        receiptUrl,
      },
      { new: true }
    ).populate('courseId')

    if (!order) {
      throw new Error('Order not found')
    }

    // আর্নিংস রেকর্ড তৈরি
    await EarningsService.createEarningRecord(order._id)

    return order
  },
}
