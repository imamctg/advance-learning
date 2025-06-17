// 'use client'

// import { useParams, useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { RootState } from 'features/redux/store'
// import QuizForm from 'components/Quiz/QuizForm'

// export default function LectureQuizzesPage() {
//   const { courseId, sectionId, lectureId } = useParams() as {
//     courseId: string
//     sectionId: string
//     lectureId: string
//   }

//   const token = useSelector((state: RootState) => state.auth.token)
//   const router = useRouter()

//   return (
//     <div className='max-w-3xl mx-auto px-6 py-8'>
//       <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
//         📗 Edit Lecture Quiz ..
//       </h2>

//       <QuizForm
//         parentId={lectureId}
//         parentType='lecture'
//         token={token}
//         courseId={courseId}
//         onSuccess={() =>
//           router.push(
//             `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-lecture/${lectureId}`
//           )
//         }
//       />
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import QuizForm from 'components/Quiz/QuizForm'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

export default function EditLectureQuizPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  const { courseId, sectionId, lectureId } = useParams() as {
    courseId: string
    sectionId: string
    lectureId: string
  }
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const [loading, setLoading] = useState(true)
  const [quizData, setQuizData] = useState(null)

  const fetchQuizDetails = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.quiz
    } catch (error) {
      console.error('Failed to fetch quiz details:', error)
      return null
    }
  }

  useEffect(() => {
    const loadQuizData = async () => {
      if (quizId) {
        const data = await fetchQuizDetails(quizId)
        setQuizData(data)
      }
      setLoading(false)
    }

    loadQuizData()
  }, [quizId, token])

  if (loading)
    return <div className='text-center py-8'>Loading quiz details...</div>

  return (
    <div className='max-w-3xl mx-auto px-6 py-8'>
      <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
        {quizData ? '📗 Edit Quiz' : '➕ Create New Quiz'}
      </h2>

      <QuizForm
        initialData={quizData || undefined}
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
