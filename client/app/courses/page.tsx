// app/courses/page.tsx
'use client'
import CoursesList from 'components/Course/CoursesList'

const CoursesPage = () => {
  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-center my-8'>Our Courses</h1>
      <CoursesList />
    </div>
  )
}

export default CoursesPage
