'use client'

import QuizForm from 'components/Quiz/QuizForm'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

export default function AddLectureQuizPage() {
  const { courseId, sectionId, lectureId } = useParams()
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Add Lecture Quiz</h1>
      <QuizForm
        parentId={lectureId as string}
        parentType='lecture'
        token={token}
        onSuccess={() =>
          router.push(`/dashboard/instructor/content/quizzes/${courseId}`)
        }
      />
    </div>
  )
}
