'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import Link from 'next/link'

const InstructorDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
  })

  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.id || !token) return

      try {
        // const baseUrl =
        //   process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        const res = await axios.get(
          `http://localhost:5000/api/instructor/${user.id}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const courses = res.data.courses || []
        console.log(courses, '🔥 courses')
        const totalStudents = courses.reduce(
          (sum, course) => sum + (course.enrolledUsers?.length || 0),
          0
        )
        const totalRating = courses.reduce(
          (sum, course) => sum + (course.rating || 0),
          0
        )
        const totalRevenue = courses.reduce(
          (sum, course) => sum + (course.revenue || 0),
          0
        )
        const avgRating = courses.length
          ? (totalRating / courses.length).toFixed(1)
          : 0

        setStats({
          totalCourses: courses.length,
          totalStudents,
          totalRevenue,
          averageRating: Number(avgRating),
        })
      } catch (error) {
        console.error('❌ Error loading dashboard stats', error)
      }
    }

    fetchDashboardStats()
  }, [user?._id, token])
  console.log(stats, 'stats')
  if (!user || user.role !== 'instructor') return <div>Unauthorized</div>

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>
        👋 Welcome Back, {user.name}!
      </h1>

      {/* Dashboard Overview Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-blue-600 text-white p-4 rounded-xl shadow'>
          <h3 className='text-sm'>Total Courses</h3>
          <p className='text-2xl font-bold'>{stats.totalCourses}</p>
        </div>
        <div className='bg-green-600 text-white p-4 rounded-xl shadow'>
          <h3 className='text-sm'>Total Students</h3>
          <p className='text-2xl font-bold'>{stats.totalStudents}</p>
        </div>
        <div className='bg-yellow-500 text-white p-4 rounded-xl shadow'>
          <h3 className='text-sm'>Avg. Rating</h3>
          <p className='text-2xl font-bold'>{stats.averageRating} ⭐</p>
        </div>
        <div className='bg-purple-600 text-white p-4 rounded-xl shadow'>
          <h3 className='text-sm'>Total Revenue</h3>
          <p className='text-2xl font-bold'>${stats.totalRevenue}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Link href='/dashboard/instructor/create-course'>
          <div className='p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer'>
            <h3 className='font-semibold text-indigo-600 mb-1'>
              ➕ Create Course
            </h3>
            <p className='text-sm text-gray-500'>
              Start building your next great course.
            </p>
          </div>
        </Link>
        <Link href='/dashboard/instructor/my-courses'>
          <div className='p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer'>
            <h3 className='font-semibold text-indigo-600 mb-1'>
              🎓 My Courses
            </h3>
            <p className='text-sm text-gray-500'>
              View and manage all your courses.
            </p>
          </div>
        </Link>
        <Link href='/dashboard/instructor/reviews'>
          <div className='p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer'>
            <h3 className='font-semibold text-indigo-600 mb-1'>
              ⭐ Course Reviews
            </h3>
            <p className='text-sm text-gray-500'>
              See what students are saying.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default InstructorDashboard
