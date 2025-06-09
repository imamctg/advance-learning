// app/courses/[courseId]/checkout/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

const CheckoutPage = () => {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId as string

  const user = useSelector((state: RootState) => state.auth.user)
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // যদি ইউজার না থাকে, তাহলে লগইন পেইজে পাঠাও
  useEffect(() => {
    if (!user && courseId) {
      router.push(`/auth/login?redirect=/courses/${courseId}/checkout`)
    }
  }, [user, router, courseId])

  // কোর্স ডেটা লোড করো
  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:5000/api/courses/${courseId}`)
        .then((res) => {
          setCourse(res.data.data)
          setLoading(false)
        })
        .catch(() => {
          setError('Course not found.')
          setLoading(false)
        })
    }
  }, [courseId])

  // ✅ Step 1: tran_id তৈরি করে অর্ডার বানাও, এরপর initiate-payment API কল করো
  const handleEnroll = async () => {
    if (!course || !user) return

    setLoading(true)
    setError(null)

    try {
      // ✅ Step 1: ফ্রন্টএন্ডে tran_id তৈরি করো
      const tran_id = `tran_${Date.now()}`

      // ✅ Step 1: অর্ডার ডাটাবেজে তৈরি করো
      const orderResponse = await axios.post(
        'http://localhost:5000/api/orders',
        {
          userId: user.id,
          courseId: course._id,
          amount: course.price,
          status: 'pending',
          transactionId: tran_id,
          paymentType: 'sslcommerz',
        }
      )

      const order = orderResponse.data

      // ✅ Step 2: পেমেন্ট শুরু করো initiate-payment API দিয়ে
      const response = await axios.post(
        'http://localhost:5000/api/initiate-payment',
        {
          amount: course.price,
          courseTitle: course.title,
          userEmail: user.email,
          userId: user.id,
          courseId: course._id,
          orderId: order._id,
          transactionId: tran_id,
        }
      )

      console.log('📦 Payment initiation response:', response.data)

      if (response.data?.url) {
        window.location.href = response.data.url
      } else {
        setError('Could not get payment URL. Please try again.')
      }
    } catch (err: any) {
      console.error('❌ Payment error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <p>Redirecting to login...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg'>Loading...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <h1 className='text-xl text-red-600'>{error || 'Course not found.'}</h1>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-8'>
      <div className='max-w-xl w-full bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-3xl font-bold mb-6'>Checkout</h1>

        <h2 className='text-2xl font-semibold mb-4'>{course.title}</h2>
        <p className='text-gray-600 mb-6'>{course.description}</p>
        <div className='text-2xl font-bold text-blue-600 mb-6'>
          ${course.price}
        </div>

        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

        <button
          onClick={handleEnroll}
          disabled={loading}
          className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Redirecting...' : 'Confirm Enrollment'}
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage
