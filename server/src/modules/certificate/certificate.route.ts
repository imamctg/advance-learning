import express from 'express'
import { getCertificate } from './certificate.controller'

const router = express.Router()

router.get('/certificate/:userId/:courseId', getCertificate)

export default router
