// // app/admin/courses/page.tsx
// 'use client'

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'

// interface Course {
//   _id: string
//   title: string
//   instructor: string
//   price: number
// }

// const CoursesPage = () => {
//   const [courses, setCourses] = useState<Course[]>([])

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/courses')
//         setCourses(response.data.data || []) // Adjust key if needed
//       } catch (error) {
//         console.error('Failed to fetch courses:', error)
//       }
//     }

//     fetchCourses()
//   }, [])

//   return (
//     <div>
//       <h1 className='text-2xl font-bold mb-4'>Course List</h1>
//       <table className='min-w-full border text-sm'>
//         <thead>
//           <tr className='bg-gray-200'>
//             <th className='border p-2'>SL</th>
//             <th className='border p-2'>Title</th>
//             <th className='border p-2'>Instructor</th>
//             <th className='border p-2'>Price ($)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {courses.map((course, index) => (
//             <tr key={course._id}>
//               <td className='border p-2'>{index + 1}</td>
//               <td className='border p-2'>{course.title}</td>
//               <td className='border p-2'>{course.instructor}</td>
//               <td className='border p-2'>{course.price}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default CoursesPage

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { getCoursesByStatus } from 'app/[locale]/services/courseService'
import { toast } from 'react-hot-toast'

export default function AdminCoursesPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'under_review'
  const token = useSelector((state: RootState) => state.auth.token)

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await getCoursesByStatus(status, token)
        setCourses(response.data.data || [])
      } catch (error) {
        toast.error('Failed to fetch courses')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchCourses()
    }
  }, [token, status])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>
        {status === 'under_review' && 'Courses Pending Review'}
        {status === 'changes_requested' && 'Courses Requiring Changes'}
        {status === 'approved' && 'Approved Courses'}
        {status === 'published' && 'Published Courses'}
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='py-3 px-4 border'>SL</th>
                <th className='py-3 px-4 border'>Title</th>
                <th className='py-3 px-4 border'>Instructor</th>
                <th className='py-3 px-4 border'>Price ($)</th>
                <th className='py-3 px-4 border'>Status</th>
                <th className='py-3 px-4 border'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course._id} className='hover:bg-gray-50'>
                  <td className='py-2 px-4 border'>{index + 1}</td>
                  <td className='py-2 px-4 border'>{course.title}</td>
                  <td className='py-2 px-4 border'>
                    {course.instructor?.name || 'Unknown'}
                  </td>
                  <td className='py-2 px-4 border'>{course.price}</td>
                  <td className='py-2 px-4 border'>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        course.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : course.status === 'under_review'
                          ? 'bg-yellow-100 text-yellow-800'
                          : course.status === 'changes_requested'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className='py-2 px-4 border'>
                    <button
                      onClick={() =>
                        (window.location.href = `/dashboard/admin/courses/review/${course._id}`)
                      }
                      className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700'
                    >
                      {status === 'under_review' ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
