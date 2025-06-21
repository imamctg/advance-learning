import mongoose from 'mongoose'

const UserProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true,
  },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now },
})

export default mongoose.model('UserProgress', UserProgressSchema)
