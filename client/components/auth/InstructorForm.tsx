'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

const InstructorForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    website: '',
    experience: '',
  })
  const [nidFile, setNidFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: string[] = []

    if (!form.name) errs.push('Name is required.')
    if (!form.email) errs.push('Email is required.')
    if (!validatePassword(form.password)) {
      errs.push('Weak password.')
    }
    if (form.password !== form.confirmPassword) {
      errs.push('Passwords must match.')
    }
    if (!form.bio) errs.push('Short bio required.')
    if (!form.experience) errs.push('Experience field is required.')
    if (!nidFile) errs.push('NID document is required.')

    if (errs.length) {
      setErrors(errs)
      return
    }

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      )
      formData.append('role', 'instructor')
      if (nidFile) formData.append('nidFile', nidFile)

      await axios.post('http://localhost:5000/api/auth/register', formData)

      toast.success('Instructor registration successful!')
      router.push(`/auth/login?redirect=${redirectPath}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <h2 className='text-xl font-bold mb-2'>Instructor Registration</h2>

      <input
        name='name'
        placeholder='Full Name'
        value={form.name}
        onChange={handleChange}
        className='border p-2 rounded'
        required
      />
      <input
        name='email'
        placeholder='Email'
        type='email'
        value={form.email}
        onChange={handleChange}
        className='border p-2 rounded'
        required
      />
      <input
        name='password'
        placeholder='Password'
        type='password'
        value={form.password}
        onChange={handleChange}
        className='border p-2 rounded'
        required
      />
      <input
        name='confirmPassword'
        placeholder='Confirm Password'
        type='password'
        value={form.confirmPassword}
        onChange={handleChange}
        className='border p-2 rounded'
        required
      />
      <textarea
        name='bio'
        placeholder='Short bio (who you are, what you teach)'
        value={form.bio}
        onChange={handleChange}
        className='border p-2 rounded'
        required
      />
      <input
        name='website'
        placeholder='Website (optional)'
        value={form.website}
        onChange={handleChange}
        className='border p-2 rounded'
      />
      <input
        name='experience'
        placeholder='Experience (e.g., 3 years teaching)'
        value={form.experience}
        onChange={handleChange}
        className='border p-2 rounded'
        required
      />
      <input
        type='file'
        onChange={(e) => setNidFile(e.target.files?.[0] || null)}
        accept='.jpg,.jpeg,.png,.pdf'
        className='border p-2 rounded'
        required
      />

      {errors.length > 0 && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <button className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
        Register
      </button>
    </form>
  )
}

export default InstructorForm
