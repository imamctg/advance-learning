// 'use client'

// import React, { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import PasswordHints from './PasswordHints'

// const StudentForm = () => {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const redirectPath = searchParams.get('redirect') || '/'

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [errors, setErrors] = useState<string[]>([])

//   const validatePassword = (password: string) => {
//     return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const errs: string[] = []

//     if (!name.trim()) errs.push('Name is required.')
//     if (!email.trim()) errs.push('Email is required.')
//     if (!password.trim() || !confirmPassword.trim()) {
//       errs.push('Both password fields are required.')
//     }

//     if (!validatePassword(password)) {
//       errs.push('Password must contain capital letter, number and symbol.')
//     }

//     if (password !== confirmPassword) {
//       errs.push('Passwords do not match.')
//     }

//     if (errs.length) {
//       setErrors(errs)
//       return
//     }

//     try {
//       await axios.post('http://localhost:5000/api/auth/register', {
//         name,
//         email,
//         password,
//         confirmPassword,
//         role: 'student',
//       })

//       toast.success('Registration successful!')
//       router.push(`/auth/login?redirect=${redirectPath}`)
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to register')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//       <h2 className='text-xl font-bold mb-2'>Student Registration</h2>

//       <input
//         type='text'
//         placeholder='Full Name'
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//         className='border p-2 rounded'
//       />
//       <input
//         type='email'
//         placeholder='Email Address'
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//         className='border p-2 rounded'
//       />
//       <input
//         type='password'
//         placeholder='Password'
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//         className='border p-2 rounded'
//       />
//       {password && <PasswordHints password={password} />}
//       <input
//         type='password'
//         placeholder='Confirm Password'
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         required
//         className='border p-2 rounded'
//       />

//       {errors.length > 0 && (
//         <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
//           {errors.map((err, idx) => (
//             <p key={idx}>{err}</p>
//           ))}
//         </div>
//       )}

//       <button className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
//         Register
//       </button>
//     </form>
//   )
// }

// export default StudentForm

'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import PasswordHints from './PasswordHints'
// import PasswordHints from '@/components/PasswordHints'

export default function StudentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: string[] = []

    if (!name) errs.push('Name is required.')
    if (!email) errs.push('Email is required.')
    if (!validatePassword(password)) errs.push('Password is too weak.')
    if (password !== confirmPassword) errs.push('Passwords do not match.')

    if (errs.length) {
      setErrors(errs)
      return
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        confirmPassword,
        role: 'student',
      })

      toast.success('Student registration successful!')
      router.push(`/auth/login?redirect=${redirectPath}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12'>
      <div className='max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-xl'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-blue-600'>
            Student Registration
          </h2>
          <p className='text-gray-500 text-sm mt-1'>
            Create your free learning account
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          {password && <PasswordHints password={password} />}

          <input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          {errors.length > 0 && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
              <ul className='list-disc list-inside'>
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <button className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
