import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IEarnings extends Document {
  instructorId: Types.ObjectId
  orderId: Types.ObjectId
  courseId: Types.ObjectId
  studentSource: 'instructor' | 'platform' | 'affiliate'
  grossAmount: number
  platformFee: number
  affiliateFee?: number
  instructorEarnings: number
  paymentGatewayFee: number
  status: 'pending' | 'paid'
  paidAt?: Date
}

const earningsSchema = new Schema<IEarnings>(
  {
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    studentSource: {
      type: String,
      enum: ['instructor', 'platform', 'affiliate'],
      required: true,
    },
    grossAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    affiliateFee: { type: Number },
    instructorEarnings: { type: Number, required: true },
    paymentGatewayFee: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
)

export const Earnings = mongoose.model<IEarnings>('Earnings', earningsSchema)
