import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per minute
  message: 'Too many messages sent. Please wait a minute.',
})
