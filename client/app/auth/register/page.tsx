'use client'
import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import SearchParamsClient from 'components/common/SearchParamsClient'
import { useSearchParams } from 'next/navigation'
import RegistrationForm from 'components/auth/RegistrationForm'

export const dynamic = 'force-dynamic'

const RegisterPage = () => {
  const searchParams = useSearchParams()
  const [role, setRole] = useState('student')

  useEffect(() => {
    const r =
      searchParams.get('role') === 'instructor' ? 'instructor' : 'student'
    setRole(r)
  }, [searchParams]) // rerun when searchParams change
  return (
    <div className='max-w-md mx-auto p-6 mt-10 border rounded shadow'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Register</h1>

      {/* Suspense দিয়ে client component wrap করুন */}
      <Suspense fallback={null}>
        <SearchParamsClient />
      </Suspense>

      <RegistrationForm defaultRole={role as 'student' | 'instructor'} />
      <p className='text-center mt-4'>
        Already have an account?{' '}
        <Link href='/auth/login' className='text-blue-600 hover:underline'>
          Login
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
