import express from 'express'
import { initiatePayment } from './payment.controller'
import { paymentSuccess } from './paymentSuccess.controller'
import { initiateBkashPayment } from './bkash.controller'
import { bkashSuccess } from './bkashSuccess.controller'

const router = express.Router()

router.post('/initiate-payment', initiatePayment)
router.post('/payment-success', paymentSuccess)

router.post('/initiate-bkash', initiateBkashPayment)
router.get('/bkash-success', bkashSuccess)

export default router
