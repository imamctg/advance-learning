'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import QuizForm from 'components/Quiz/QuizForm'

export default function LectureQuizzesPage() {
  const { courseId, sectionId, lectureId } = useParams() as {
    courseId: string
    sectionId: string
    lectureId: string
  }

  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  return (
    <div className='max-w-3xl mx-auto px-6 py-8'>
      <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
        📗 Edit Lecture Quiz ..
      </h2>

      <QuizForm
        parentId={lectureId}
        parentType='lecture'
        token={token}
        onSuccess={() =>
          router.push(
            `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-lecture/${lectureId}`
          )
        }
      />
    </div>
  )
}
