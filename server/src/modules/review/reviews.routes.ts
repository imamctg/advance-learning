// src/routes/reviews.routes.ts

import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware'
import {
  fetchHomepageReviews,
  fetchInstructorReviews,
  getReviewsByCourse,
  submitReview,
} from './review.controller'

const router = express.Router()

// POST /api/reviews
router.post('/reviews/submit', authMiddleware, submitReview)

// GET /api/reviews/:courseId
router.get('/reviews/:courseId', getReviewsByCourse)
router.get('/instructor/reviews', authMiddleware, fetchInstructorReviews)
router.get('/homepage-reviews', fetchHomepageReviews)

export default router
