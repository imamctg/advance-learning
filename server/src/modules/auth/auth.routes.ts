// src/routes/auth.routes.ts

import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { loginValidation, registerValidation } from './auth.validation'
import { getProfile, login, register } from './auth.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import upload from '../../middlewares/upload'

const router = express.Router()

router.post(
  '/register',
  upload.single('nidFile'),
  validateRequest(registerValidation),
  register
)

router.post('/login', validateRequest(loginValidation), login)

router.get('/me', authMiddleware, getProfile)

export default router
