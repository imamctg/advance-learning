'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { RootState } from 'features/redux/store'

interface CourseWithProgress {
  _id: string
  title: string
  thumbnail: string
  instructor: string
  progress: number
  totalLectures: number
  completedLectures: number
}

const MyCourses = () => {
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const fetchCourses = async () => {
      console.log(user, 'user')
      const userId = user?._id || user?.id
      console.log(userId, 'userId')
      if (!userId || !token) return

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        const response = await axios.get(
          `${baseUrl}/api/user/courses/progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setCourses(response.data.courses)
      } catch (error) {
        console.error('❌ Error fetching user courses with progress:', error)
        // Fallback to previous endpoint if new one fails
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
          const fallbackResponse = await axios.get(
            `${baseUrl}/api/user/${userId}/courses`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          setCourses(
            fallbackResponse.data.courses.map((course: any) => ({
              ...course,
              progress: course.progress || 0,
              totalLectures: 0,
              completedLectures: 0,
            }))
          )
        } catch (fallbackError) {
          console.error('❌ Error fetching fallback courses:', fallbackError)
        }
      }
    }

    fetchCourses()
  }, [user?._id, token])

  if (!user || !user.id || !token) return <div>Loading your courses...</div>

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-6'>🎓 আমার কোর্সসমূহ</h2>

      {courses.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map((course) => (
            <Link href={`/learn/${course._id}`} key={course._id}>
              <div className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer'>
                <div className='h-40 bg-gray-200'>
                  <img
                    src={course.thumbnail || '/default-thumbnail.jpg'}
                    alt={course.title}
                    className='w-full h-full object-cover'
                  />
                </div>

                <div className='p-4'>
                  <h3 className='text-lg font-semibold mb-1'>{course.title}</h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    By {course.instructor || 'Unknown Instructor'}
                  </p>

                  {/* Progress */}
                  <div className='mb-2'>
                    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300'>
                      <div
                        className='bg-green-500 h-2.5 rounded-full'
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {course.completedLectures || 0} of{' '}
                      {course.totalLectures || 0} lectures completed (
                      {course.progress || 0}%)
                    </p>
                  </div>

                  <p className='text-blue-600 text-sm font-medium'>
                    {course.progress === 100
                      ? '🎉 Course Completed'
                      : '▶️ Continue Course'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>আপনি এখনো কোনো কোর্স এনরোল করেননি।</p>
      )}
    </div>
  )
}

export default MyCourses
