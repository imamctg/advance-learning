// import express from 'express'
// import {
//   deleteMessage,
//   getConversation,
//   markMessageAsRead,
//   sendMessage,
// } from './message.controller'
// import { getInbox } from './message.controller'
// import authMiddleware from '../../middlewares/authMiddleware'

// const router = express.Router()
// router.use(authMiddleware) // Ensure the user is authenticated for all routes

// router.get('/conversation/:senderId/:receiverId', getConversation)
// router.post('/send', sendMessage)
// router.get('/inbox/:userId', getInbox)

// // PUT /api/admin/message/:id → Mark message as read
// router.put('/read/:id', markMessageAsRead)

// // ✅ Delete a specific message by ID (only if sender or receiver)
// router.delete('/:id', deleteMessage)

// export default router

import express from 'express'
import * as MessageController from './message.controller'
import authMiddleware from '../../middlewares/authMiddleware'
import { rateLimiter } from '../../middlewares/rateLimiter.middleware'

const router = express.Router()

router.use(authMiddleware)

router.get('/available-users/:id', MessageController.getAvailableUsers)
router.get('/conversation/:receiverId', MessageController.getMessages)
router.post('/', rateLimiter, MessageController.sendMessage)
// router.delete('/', MessageController.deleteMessages)

router.delete('/single/:messageId', MessageController.deleteSingleMessage)
router.delete('/all/:userId', MessageController.deleteAllMessagesWithUser)
router.put('/mark-seen/:receiverId', MessageController.markMessagesAsSeen)

export default router
