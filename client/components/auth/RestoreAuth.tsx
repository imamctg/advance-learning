// components/RestoreAuth.tsx
'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from 'features/auth/redux/authSlice'
// import { loginSuccess } from '/redux/userSlice'

const RestoreAuth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user')
    if (userFromStorage && userFromStorage !== 'undefined') {
      try {
        const user = JSON.parse(userFromStorage)
        dispatch(loginSuccess(user))
      } catch (error) {
        console.error('❌ Failed to parse user:', error)
      }
    }
  }, [dispatch])

  return null
}

export default RestoreAuth
