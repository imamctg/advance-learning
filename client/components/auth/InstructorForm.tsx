// 'use client'

// import React, { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import PasswordHints from './PasswordHints'

// const InstructorForm = () => {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const redirectPath = searchParams.get('redirect') || '/'

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     bio: '',
//     website: '',
//     experience: '',
//   })
//   const [nidFile, setNidFile] = useState<File | null>(null)
//   const [errors, setErrors] = useState<string[]>([])

//   const validatePassword = (password: string) =>
//     /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const errs: string[] = []

//     if (!form.name) errs.push('Name is required.')
//     if (!form.email) errs.push('Email is required.')
//     if (!validatePassword(form.password)) {
//       errs.push('Weak password.')
//     }
//     if (form.password !== form.confirmPassword) {
//       errs.push('Passwords must match.')
//     }
//     if (!form.bio) errs.push('Short bio required.')
//     if (!form.experience) errs.push('Experience field is required.')
//     if (!nidFile) errs.push('NID document is required.')

//     if (errs.length) {
//       setErrors(errs)
//       return
//     }

//     try {
//       const formData = new FormData()
//       Object.entries(form).forEach(([key, value]) =>
//         formData.append(key, value)
//       )
//       formData.append('role', 'instructor')
//       if (nidFile) formData.append('nidFile', nidFile)

//       await axios.post('http://localhost:5000/api/auth/register', formData)

//       toast.success('Instructor registration successful!')
//       router.push(`/auth/login?redirect=${redirectPath}`)
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Registration failed')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//       <h2 className='text-xl font-bold mb-2'>Instructor Registration</h2>

//       <input
//         name='name'
//         placeholder='Full Name'
//         value={form.name}
//         onChange={handleChange}
//         className='border p-2 rounded'
//         required
//       />
//       <input
//         name='email'
//         placeholder='Email'
//         type='email'
//         value={form.email}
//         onChange={handleChange}
//         className='border p-2 rounded'
//         required
//       />
//       <input
//         name='password'
//         placeholder='Password'
//         type='password'
//         value={form.password}
//         onChange={handleChange}
//         className='border p-2 rounded'
//         required
//       />
//       {form.password && <PasswordHints password={form.password} />}
//       <input
//         name='confirmPassword'
//         placeholder='Confirm Password'
//         type='password'
//         value={form.confirmPassword}
//         onChange={handleChange}
//         className='border p-2 rounded'
//         required
//       />
//       <textarea
//         name='bio'
//         placeholder='Short bio (who you are, what you teach)'
//         value={form.bio}
//         onChange={handleChange}
//         className='border p-2 rounded'
//         required
//       />
//       <input
//         name='website'
//         placeholder='Website (optional)'
//         value={form.website}
//         onChange={handleChange}
//         className='border p-2 rounded'
//       />
//       <input
//         name='experience'
//         placeholder='Experience (e.g., 3 years teaching)'
//         value={form.experience}
//         onChange={handleChange}
//         className='border p-2 rounded'
//         required
//       />
//       <input
//         type='file'
//         onChange={(e) => setNidFile(e.target.files?.[0] || null)}
//         accept='.jpg,.jpeg,.png,.pdf'
//         className='border p-2 rounded'
//         required
//       />

//       {/* {password && (
//           <div className='text-sm text-gray-500 -mt-4'>
//             <p>Password must include:</p>
//             <ul className='list-disc ml-5'>
//               <li>At least 8 characters</li>
//               <li>One uppercase letter</li>
//               <li>One number</li>
//               <li>One special character</li>
//             </ul>
//           </div>
//         )} */}

//       {errors.length > 0 && (
//         <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
//           {errors.map((err, i) => (
//             <p key={i}>{err}</p>
//           ))}
//         </div>
//       )}

//       <button className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
//         Register
//       </button>
//     </form>
//   )
// }

// export default InstructorForm

// 'use client'

// import React, { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import PasswordHints from './PasswordHints'
// // import PasswordHints from '@/components/PasswordHints'

// export default function InstructorForm() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const redirectPath = searchParams.get('redirect') || '/'

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     bio: '',
//     website: '',
//     experience: '',
//   })
//   const [nidFile, setNidFile] = useState<File | null>(null)
//   const [errors, setErrors] = useState<string[]>([])

//   const validatePassword = (password: string) =>
//     /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const errs: string[] = []

//     if (!form.name) errs.push('Name is required.')
//     if (!form.email) errs.push('Email is required.')
//     if (!validatePassword(form.password)) errs.push('Weak password.')
//     if (form.password !== form.confirmPassword)
//       errs.push('Passwords must match.')
//     if (!form.bio) errs.push('Bio is required.')
//     if (!form.experience) errs.push('Experience is required.')
//     if (!nidFile) errs.push('NID is required.')

//     if (errs.length) {
//       setErrors(errs)
//       return
//     }

//     try {
//       const formData = new FormData()
//       Object.entries(form).forEach(([k, v]) => formData.append(k, v))
//       formData.append('role', 'instructor')
//       if (nidFile) formData.append('nidFile', nidFile)

//       await axios.post('http://localhost:5000/api/auth/register', formData)
//       toast.success('Instructor registration successful!')
//       router.push(`/auth/login?redirect=${redirectPath}`)
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Registration failed')
//     }
//   }

//   return (
//     <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12'>
//       <div className='max-w-xl w-full space-y-6 bg-white shadow-xl p-8 rounded-xl'>
//         <div className='text-center'>
//           <h2 className='text-3xl font-bold text-blue-600'>
//             Become an Instructor
//           </h2>
//           <p className='text-gray-500 text-sm mt-1'>
//             Join and teach students worldwide.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className='space-y-4'>
//           {[
//             { name: 'name', type: 'text', placeholder: 'Full Name' },
//             { name: 'email', type: 'email', placeholder: 'Email Address' },
//             { name: 'password', type: 'password', placeholder: 'Password' },
//             {
//               name: 'confirmPassword',
//               type: 'password',
//               placeholder: 'Confirm Password',
//             },
//             {
//               name: 'website',
//               type: 'text',
//               placeholder: 'Website (optional)',
//             },
//             {
//               name: 'experience',
//               type: 'text',
//               placeholder: 'Experience (e.g. 3 years)',
//             },
//           ].map((input) => (
//             <input
//               key={input.name}
//               name={input.name}
//               type={input.type}
//               placeholder={input.placeholder}
//               value={(form as any)[input.name]}
//               onChange={handleChange}
//               className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
//               required={input.name !== 'website'}
//             />
//           ))}

//           {form.password && <PasswordHints password={form.password} />}

//           <textarea
//             name='bio'
//             placeholder='Short bio (who you are, what you teach)'
//             value={form.bio}
//             onChange={handleChange}
//             className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
//             required
//           />

//           <input
//             type='file'
//             accept='.jpg,.jpeg,.png,.pdf'
//             onChange={(e) => setNidFile(e.target.files?.[0] || null)}
//             className='w-full border p-2 rounded'
//             required
//           />

//           {errors.length > 0 && (
//             <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
//               <ul className='list-disc list-inside'>
//                 {errors.map((err, idx) => (
//                   <li key={idx}>{err}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <button className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'>
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import PasswordHints from './PasswordHints'
import ReCAPTCHA from 'react-google-recaptcha'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function InstructorForm() {
  const t = useTranslations('instructorForm')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [agreePolicy, setAgreePolicy] = useState(false)
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
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
    if (!validatePassword(form.password)) errs.push('Weak password.')
    if (form.password !== form.confirmPassword)
      errs.push('Passwords must match.')
    if (!form.bio) errs.push('Bio is required.')
    if (!form.experience) errs.push('Experience is required.')
    if (!nidFile) errs.push('NID is required.')
    if (!recaptchaToken) errs.push('Please verify you are not a robot.')
    if (!agreePolicy)
      errs.push('You must agree to the terms and privacy policy.')

    if (errs.length) {
      setErrors(errs)
      return
    }

    try {
      setSubmitting(true)

      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      formData.append('role', 'instructor')
      formData.append('token', recaptchaToken)
      if (nidFile) formData.append('nidFile', nidFile)

      await axios.post(`${baseURL}/auth/register`, formData)
      toast.success('Instructor registration successful!')
      router.push(`/auth/login?redirect=${redirectPath}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12'>
      <div className='max-w-xl w-full space-y-6 bg-white shadow-xl p-8 rounded-xl'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-blue-600'>{t('title')}</h2>
          <p className='text-gray-500 text-sm mt-1'>{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {[
            { name: 'name', type: 'text', placeholder: 'Full Name' },
            { name: 'email', type: 'email', placeholder: 'Email Address' },
            { name: 'password', type: 'password', placeholder: 'Password' },
            {
              name: 'confirmPassword',
              type: 'password',
              placeholder: 'Confirm Password',
            },
            {
              name: 'website',
              type: 'text',
              placeholder: 'Website (optional)',
            },
            {
              name: 'experience',
              type: 'text',
              placeholder: 'Experience (e.g. 3 years)',
            },
          ].map((input) => (
            <input
              key={input.name}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              value={(form as any)[input.name]}
              onChange={handleChange}
              className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              required={input.name !== 'website'}
            />
          ))}

          {form.password && <PasswordHints password={form.password} />}

          <textarea
            name='bio'
            placeholder='Short bio (who you are, what you teach)'
            value={form.bio}
            onChange={handleChange}
            className='w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <input
            type='file'
            accept='.jpg,.jpeg,.png,.pdf'
            onChange={(e) => setNidFile(e.target.files?.[0] || null)}
            className='w-full border p-2 rounded'
            required
          />

          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setRecaptchaToken(token || '')}
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

          <div className='flex items-start gap-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              id='agree'
              checked={agreePolicy}
              onChange={() => setAgreePolicy(!agreePolicy)}
              className='mt-1'
            />
            <label htmlFor='agree' className='leading-5'>
              {t('terms')}{' '}
              {/* <a
                href='/terms-conditions?role=instructor'
                target='_blank'
                className='text-blue-600 hover:underline'
              >
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a
                href='/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                Privacy Policy
              </a> */}
              <a
                href='/terms-conditions?role=instructor'
                target='_blank'
                className='text-blue-600 hover:underline'
              >
                {t('termsLink')}
              </a>{' '}
              {t('and')}{' '}
              <a
                href='/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                {t('privacyLink')}
              </a>
              .
            </label>
          </div>

          <button
            type='submit'
            disabled={submitting || !recaptchaToken}
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50'
          >
            {submitting ? t('registering') : t('register')}
          </button>
        </form>
      </div>
    </div>
  )
}
