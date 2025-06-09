// import dynamicImport from 'next/dynamic'
// import React, { Suspense } from 'react'
// import LoginForm from 'components/auth/LoginForm'
// import Link from 'next/link'

// const SearchParamsClient = dynamicImport(
//   () => import('components/common/SearchParamsClient'),
//   { ssr: false }
// )

// export const dynamic = 'force-dynamic'

// const LoginPage = () => {
//   return (
//     <div className='max-w-md mx-auto p-6 mt-10 border rounded shadow'>
//       <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

//       <Suspense fallback={<p className='text-center'>Loading message...</p>}>
//         <SearchParamsClient />
//       </Suspense>

//       <LoginForm />

//       <p className='text-center mt-4'>
//         Don't have an account?{' '}
//         <Link href='/auth/register' className='text-blue-600 hover:underline'>
//           Register
//         </Link>
//       </p>
//     </div>
//   )
// }

// export default LoginPage

import React, { Suspense } from 'react'
import LoginForm from 'components/auth/LoginForm'
import Link from 'next/link'
import SearchParamsClient from 'components/common/SearchParamsClient'
// import SearchParamsWrapper from './SearchParamsWrapper'

export const dynamic = 'force-dynamic'

const LoginPage = () => {
  return (
    <div className='max-w-md mx-auto p-6 mt-10 border rounded shadow'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

      {/* ✅ Suspense wrapper must be here */}
      <Suspense fallback={<p className='text-center'>Loading message...</p>}>
        <SearchParamsClient />
      </Suspense>

      <LoginForm />

      <p className='text-center mt-4'>
        Don't have an account?{' '}
        <Link href='/auth/register' className='text-blue-600 hover:underline'>
          Register
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
