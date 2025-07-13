// src/routes/auth.routes.ts

import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { loginValidation, registerValidation } from './auth.validation'
import { getProfile, login, register } from './auth.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import upload from '../../middlewares/upload'
import { rateLimiter } from '../../middlewares/rateLimiter.middleware'

const router = express.Router()

router.post(
  '/register',
  rateLimiter,
  upload.single('nidFile'),
  validateRequest(registerValidation),
  register
)

router.post('/login', rateLimiter, validateRequest(loginValidation), login)

router.get('/me', authMiddleware, getProfile)

export default router
