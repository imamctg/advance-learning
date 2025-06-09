'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { RootState } from 'features/redux/store'

const MyCourses = () => {
  const [courses, setCourses] = useState<any[]>([])
  // const user = useSelector((state: any) => state.auth)
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const fetchCourses = async () => {
      const userId = user?._id || user?.id
      if (!userId || !token) return

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        const response = await axios.get(
          `${baseUrl}/api/user/${userId}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        console.log(response.data.courses, '✅ Fetched Courses')
        setCourses(response.data.courses)
      } catch (error) {
        console.error('❌ Error fetching user courses:', error)
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
          {courses.map((course: any) => (
            <Link href={`/learn/${course._id}`} key={course._id}>
              <div className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer'>
                <div className='h-40 bg-gray-200'>
                  <video
                    src={course.introVideo || '/default-preview.mp4'}
                    className='w-full h-full object-cover'
                    controls={false}
                    muted
                    preload='metadata'
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
                      {course.progress || 0}% Complete
                    </p>
                  </div>

                  {/* Rating */}
                  <div className='flex items-center space-x-1 text-yellow-500 mb-3'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns='http://www.w3.org/2000/svg'
                        fill={
                          i < (course.rating || 0) ? 'currentColor' : 'none'
                        }
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='w-4 h-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 4.354l2.354 4.766 5.288.77-3.822 3.725.902 5.265L12 16.77l-4.722 2.48.902-5.265L4.358 9.89l5.288-.77L12 4.354z'
                        />
                      </svg>
                    ))}
                  </div>

                  <p className='text-blue-600 text-sm font-medium'>
                    ▶️ Continue Course
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
