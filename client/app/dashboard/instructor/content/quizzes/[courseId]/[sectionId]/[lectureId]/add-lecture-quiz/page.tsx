'use client'

import QuizForm from 'components/Quiz/QuizForm'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

export default function AddLectureQuizPage() {
  // const { courseId, sectionId, lectureId } = useParams()
  const { courseId, sectionId, lectureId } = useParams() as {
    courseId: string
    sectionId: string
    lectureId: string
  }

  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  console.log(courseId, lectureId, 'lectureId')
  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Add Lecture Quiz</h1>
      <QuizForm
        parentId={lectureId}
        parentType='lecture'
        token={token}
        courseId={courseId}
        onSuccess={() =>
          router.push(`/dashboard/instructor/content/quizzes/${courseId}`)
        }
      />
    </div>
  )
}
