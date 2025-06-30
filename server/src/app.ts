import express from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes'
import courseRoutes from './modules/course/course.routes'
import userRoutes from './modules/user/user.routes'
import paymentRoutes from './modules/payment/payment.route'
import adminRoutes from './modules/admin/adminRoutes'
import messageRoutes from './modules/message/message.routes'
import orderRoutes from './modules/order/order.routes'
import certificateRoutes from './modules/certificate/certificate.route'
import quizRoutes from './modules/quiz/quiz.routes'
import dotenv from 'dotenv'
import e from 'express'
import { EarningsRoutes } from './modules/earnings/earnings.routes'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lectures', courseRoutes)
app.use('/api/users', userRoutes)
app.use('/api', paymentRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/orders', orderRoutes)

app.use('/api/instructor', courseRoutes)
app.use('/api/instructor', quizRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/earnings', EarningsRoutes)

app.use('/api', certificateRoutes)

app.get('/', (req, res) => {
  res.send('API is running...! Hello vai')
})

export default app
