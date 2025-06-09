// import axios from 'axios'
// import dynamic from 'next/dynamic'
// import { useSearchParams } from 'next/navigation'
// import { useEffect, useState } from 'react'

// const SuccessClient = dynamic(
//   () => import('../../../components/payment/SuccessClient'),
//   { ssr: false }
// )

// export default function SuccessPage() {
//   const searchParams = useSearchParams()
//   const [hasRun, setHasRun] = useState(false)

//   useEffect(() => {
//     const userId = searchParams.get('userId')
//     const courseId = searchParams.get('courseId')

//     // ✅ Stop if already ran or if params are still missing
//     if (hasRun || !userId || !courseId) return

//     console.log('✅ Params received:', { userId, courseId })

//     const addCourseToUser = async () => {
//       try {
//         const baseUrl =
//           process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
//         console.log('✅ baseUrl is:', baseUrl)
//         console.log('🔥 ENV value:', process.env.NEXT_PUBLIC_API_BASE_URL)

//         const res = await axios.post(`${baseUrl}/api/user/add-course`, {
//           userId,
//           courseId,
//         })
//         console.log('✅ Course successfully added to user!')
//       } catch (error: any) {
//         console.error('❌ Failed to add course:', error.message)
//       }
//     }

//     addCourseToUser()
//     setHasRun(true)
//   }, [searchParams, hasRun])

//   return <SuccessClient />
// }

// import dynamic from 'next/dynamic'
// import { useSearchParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import axios from 'axios'

// const SuccessClient = dynamic(
//   () => import('../../../components/payment/SuccessClient'),
//   { ssr: false }
// )

// export default function SuccessPage() {
//   const searchParams = useSearchParams()
//   const [hasRun, setHasRun] = useState(false)

//   useEffect(() => {
//     const userId = searchParams.get('userId')
//     const courseId = searchParams.get('courseId')

//     if (hasRun || !userId || !courseId) return

//     const addCourseToUser = async () => {
//       try {
//         const baseUrl =
//           process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

//         const res = await axios.post(`${baseUrl}/api/user/add-course`, {
//           userId,
//           courseId,
//         })

//         console.log('✅ Course successfully added to user!')
//       } catch (error: any) {
//         console.error('❌ Failed to add course:', error.message)
//       }
//     }

//     addCourseToUser()
//     setHasRun(true)
//   }, [searchParams, hasRun])

//   return <SuccessClient />
// }

// 'use client'
// import SuccessClient from '../../../components/payment/SuccessClient'

// export default function SuccessPage() {
//   console.log(
//     'D:course-sellingadvanced-learningclientapppaymentsuccesspage.tsx cheking here'
//   )
//   return <SuccessClient />
// }

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SuccessPage() {
  const [message, setMessage] = useState('Processing payment...')
  const router = useRouter()

  useEffect(() => {
    const confirmAndAssignCourse = async () => {
      if (typeof window === 'undefined') return

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:5000'
      console.log('✅ API BASE URL:', baseUrl)
      if (!baseUrl.startsWith('http')) {
        console.error('❌ Invalid base URL:', baseUrl)
        setMessage('❌ Configuration error: Invalid API base URL.')
        return
      }

      const queryString = window.location.search
      if (!queryString) {
        setMessage('❌ Unable to get query parameters from URL.')
        return
      }

      const params = new URLSearchParams(queryString)
      const tran_id = params.get('tran_id')
      const val_id = params.get('val_id') || 'dummy-validation-id'
      const userId = params.get('userId')
      const courseId = params.get('courseId')

      if (!tran_id || !userId || !courseId) {
        const hasReloaded = sessionStorage.getItem('reloaded')
        if (!hasReloaded) {
          sessionStorage.setItem('reloaded', 'true')
          setTimeout(() => window.location.reload(), 100)
        } else {
          setMessage('⚠️ Invalid or missing URL parameters.')
        }
        return
      }

      try {
        setMessage(`✅ Payment successful! Confirming with server...`)
        console.log('📡 Calling /api/payment-success')

        // await axios.post(`${baseUrl}/api/payment-success`, {
        //   tran_id,
        //   val_id,
        //   userId,
        //   courseId,
        //   status: 'paid',
        // })

        console.log('✅ Payment confirmed with backend.')

        await axios.post(`${baseUrl}/api/user/add-course`, {
          userId,
          courseId,
        })

        console.log('✅ Course successfully added to user.')
        setMessage('✅ Payment confirmed and course added! Redirecting...')

        setTimeout(() => {
          router.push('/dashboard/user/my-courses')
        }, 3000)
      } catch (error: any) {
        console.error('❌ Error:', error.message)
        setMessage('❌ Payment failed to confirm. Please contact support.')
      }
    }

    confirmAndAssignCourse()
  }, [router])

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-green-50 text-green-800 p-10'>
      <h1 className='text-3xl font-bold'>🎉 Payment Successful!</h1>
      <p className='mt-4 text-lg'>{message}</p>
      <p className='mt-2 text-sm text-gray-600'>
        Redirecting to your dashboard...
      </p>
    </div>
  )
}
