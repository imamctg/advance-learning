// Updated register page with next-intl support
// app/auth/register/page.tsx

'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import SearchParamsClient from 'components/common/SearchParamsClient'
import { useSearchParams } from 'next/navigation'
import RegistrationForm from 'components/auth/RegistrationForm'
import { useTranslations } from 'next-intl'

export const dynamic = 'force-dynamic'

const RegisterPage = () => {
  const searchParams = useSearchParams()
  const [role, setRole] = useState<'student' | 'instructor'>('student')
  const t = useTranslations('register')

  useEffect(() => {
    const r =
      searchParams.get('role') === 'instructor' ? 'instructor' : 'student'
    setRole(r)
  }, [searchParams])

  return (
    <div className='max-w-md mx-auto p-6 mt-10 border rounded shadow'>
      <h1 className='text-2xl font-bold mb-6 text-center'>{t('title')}</h1>

      <Suspense fallback={null}>
        <SearchParamsClient />
      </Suspense>

      <RegistrationForm defaultRole={role} />

      <p className='text-center mt-4'>
        {t('alreadyAccount')}{' '}
        <Link href='/auth/login' className='text-blue-600 hover:underline'>
          {t('login')}
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
