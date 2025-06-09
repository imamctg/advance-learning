import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/redux/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// RootState এবং AppDispatch টাইপ ডিফাইন করা হয়েছে যেন পরে ব্যবহার করতে পারেন
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
