// 'use client'

// import React, { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useDispatch } from 'react-redux'
// import { loginSuccess } from 'features/auth/redux/authSlice'

// const LoginForm = () => {
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const searchParams = useSearchParams()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const redirectPath = searchParams.get('redirect') || '/'

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/auth/login',
//         {
//           email,
//           password,
//         }
//       )

//       if (response.data.success) {
//         const { token, ...user } = response.data.data
//         localStorage.setItem('user', JSON.stringify({ user, token }))
//         dispatch(loginSuccess({ user, token }))
//         toast.success('Login successful!')
//         setTimeout(() => {
//           router.push(redirectPath)
//         }, 1000)
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Login failed!')
//     }
//   }

//   return (
//     <form onSubmit={handleLogin} className='flex flex-col gap-4'>
//       <input
//         type='email'
//         placeholder='Email'
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className='border p-2 rounded'
//         required
//       />
//       <input
//         type='password'
//         placeholder='Password'
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className='border p-2 rounded'
//         required
//       />
//       <button
//         type='submit'
//         className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
//       >
//         Login
//       </button>
//     </form>
//   )
// }

// export default LoginForm

'use client'

import React, { use, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { loginSuccess } from 'features/auth/redux/authSlice'
import { useTranslations } from 'next-intl'

const LoginForm = () => {
  const t = useTranslations('login')
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirectPath = searchParams.get('redirect') || '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
        }
      )

      if (response.data.success) {
        const { token, ...user } = response.data.data
        localStorage.setItem('user', JSON.stringify({ user, token }))
        dispatch(loginSuccess({ user, token }))
        toast.success(t('success'))
        setTimeout(() => {
          router.push(redirectPath)
        }, 1000)
      }
    } catch (error: any) {
      // toast.error(error.response?.data?.message || 'Login failed!')
      toast.error(t('error'))
    }
  }

  return (
    <form onSubmit={handleLogin} className='flex flex-col gap-4'>
      <input
        type='email'
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='border p-2 rounded'
        required
      />
      <input
        type='password'
        placeholder={t('passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='border p-2 rounded'
        required
      />
      <button
        type='submit'
        className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
      >
        {t('login')}
      </button>
    </form>
  )
}

export default LoginForm
