// client/app/admin/dashboard/courses/[courseId]/sections/[sectionId]/add-lecture/page.tsx

'use client'

import AddLectureForm from 'components/Course/AddLectureForm'
import { useParams } from 'next/navigation'
// import AddLectureForm from '@/components/course/AddLectureForm'

const AddLecturePage = () => {
  const params = useParams()
  const courseId = params.courseId as string
  const sectionId = params.sectionId as string

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-semibold mb-4'>➕ Add New Lecture</h1>
      <AddLectureForm courseId={courseId} sectionId={sectionId} />
    </div>
  )
}

export default AddLecturePage
