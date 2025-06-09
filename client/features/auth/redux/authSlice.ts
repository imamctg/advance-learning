// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: any | null
  token: string | null
}

const initialState: UserState = {
  user: null,
  token: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // loginSuccess: (state, action: PayloadAction<any>) => {
    //   state.user = action.payload
    // },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },

    // নতুন একটি reducer যোগ করলাম:
    updateUser: (state, action) => {
      if (state.user) {
        state.user.name = action.payload.name
        state.user.email = action.payload.email
        state.user.profileImage = action.payload.profileImage
      }
    },

    logout: (state) => {
      state.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user') // এই লাইন যোগ করো
      }
    },
  },
})

export const { loginSuccess, logout, updateUser } = userSlice.actions
export default userSlice.reducer
