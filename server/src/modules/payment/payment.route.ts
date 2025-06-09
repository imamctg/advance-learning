import express from 'express'
import { initiatePayment } from './payment.controller'
import { paymentSuccess } from './paymentSuccess.controller'

const router = express.Router()

router.post('/initiate-payment', initiatePayment)
router.post('/payment-success', paymentSuccess)

export default router
