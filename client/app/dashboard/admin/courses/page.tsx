// app/admin/courses/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Course {
  _id: string
  title: string
  instructor: string
  price: number
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses')
        setCourses(response.data.data || []) // Adjust key if needed
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Course List</h1>
      <table className='min-w-full border text-sm'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2'>SL</th>
            <th className='border p-2'>Title</th>
            <th className='border p-2'>Instructor</th>
            <th className='border p-2'>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={course._id}>
              <td className='border p-2'>{index + 1}</td>
              <td className='border p-2'>{course.title}</td>
              <td className='border p-2'>{course.instructor}</td>
              <td className='border p-2'>{course.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CoursesPage
