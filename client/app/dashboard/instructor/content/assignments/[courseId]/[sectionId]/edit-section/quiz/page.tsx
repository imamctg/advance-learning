// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import axios from 'axios'
// import { RootState } from 'features/redux/store'
// import { toast } from 'react-hot-toast'
// import QuestionEditor, { QuestionType } from 'components/Quiz/QuestionEditor'

// const EditSectionQuizPage = () => {
//   const { courseId, sectionId } = useParams() as {
//     courseId: string
//     sectionId: string
//   }

//   const token = useSelector((state: RootState) => state.auth.token)
//   const router = useRouter()

//   const [title, setTitle] = useState('')
//   const [instructions, setInstructions] = useState('')
//   const [duration, setDuration] = useState(15)
//   const [totalMarks, setTotalMarks] = useState(10)
//   const [questions, setQuestions] = useState<QuestionType[]>([])
//   const [loading, setLoading] = useState(false)

//   // Fetch quiz if exists
//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/instructor/sections/${sectionId}/quiz`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         const quiz = res.data.quiz
//         if (quiz) {
//           setTitle(quiz.title)
//           setInstructions(quiz.instructions)
//           setDuration(quiz.duration)
//           setTotalMarks(quiz.totalMarks)
//           setQuestions(quiz.questions || [])
//         }
//       } catch {
//         // No quiz found — that's okay
//       }
//     }
//     fetchQuiz()
//   }, [sectionId, token])

//   const handleAddQuestion = () => {
//     setQuestions((prev) => [
//       ...prev,
//       {
//         questionText: '',
//         options: ['', '', '', ''],
//         correctAnswer: 0,
//         marks: 1,
//         explanation: '',
//       },
//     ])
//   }

//   const handleQuestionChange = (index: number, updated: QuestionType) => {
//     const newQ = [...questions]
//     newQ[index] = updated
//     setQuestions(newQ)
//   }

//   const handleDeleteQuestion = (index: number) => {
//     const newQ = [...questions]
//     newQ.splice(index, 1)
//     setQuestions(newQ)
//   }

//   const handleSave = async () => {
//     if (!title.trim()) return toast.error('Quiz title is required.')
//     if (questions.length === 0) return toast.error('Add at least 1 question.')

//     setLoading(true)
//     try {
//       await axios.put(
//         `http://localhost:5000/api/instructor/sections/${sectionId}/quiz`,
//         {
//           title,
//           instructions,
//           duration,
//           totalMarks,
//           questions,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       toast.success('Quiz saved successfully!')
//       router.push(
//         `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-section`
//       )
//     } catch {
//       toast.error('Failed to save quiz.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='max-w-3xl mx-auto px-6 py-8'>
//       <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
//         📘 Edit Section Quiz
//       </h2>

//       <div className='space-y-5'>
//         <div>
//           <label className='block font-medium'>Quiz Title</label>
//           <input
//             className='w-full border p-2 rounded'
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className='block font-medium'>Instructions</label>
//           <textarea
//             className='w-full border p-2 rounded'
//             rows={4}
//             value={instructions}
//             onChange={(e) => setInstructions(e.target.value)}
//           />
//         </div>

//         <div className='grid grid-cols-2 gap-4'>
//           <div>
//             <label className='block font-medium'>Duration (minutes)</label>
//             <input
//               type='number'
//               className='w-full border p-2 rounded'
//               value={duration}
//               onChange={(e) => setDuration(Number(e.target.value))}
//             />
//           </div>

//           <div>
//             <label className='block font-medium'>Total Marks</label>
//             <input
//               type='number'
//               className='w-full border p-2 rounded'
//               value={totalMarks}
//               onChange={(e) => setTotalMarks(Number(e.target.value))}
//             />
//           </div>
//         </div>

//         <hr className='my-6' />
//         <h3 className='text-lg font-semibold'>Questions</h3>

//         {questions.map((q, index) => (
//           <QuestionEditor
//             key={index}
//             index={index}
//             question={q}
//             onChange={handleQuestionChange}
//             onDelete={handleDeleteQuestion}
//           />
//         ))}

//         <button
//           onClick={handleAddQuestion}
//           className='text-sm text-blue-600 underline'
//         >
//           ➕ Add Question
//         </button>

//         <div className='pt-6'>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className='bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-50'
//           >
//             {loading ? 'Saving...' : 'Save Quiz'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditSectionQuizPage

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import QuizForm from 'components/Quiz/QuizForm'

export default function EditSectionQuizPage() {
  const { courseId, sectionId } = useParams() as {
    courseId: string
    sectionId: string
  }
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  return (
    <div className='max-w-3xl mx-auto px-6 py-8'>
      <h2 className='text-2xl font-bold text-indigo-700 mb-6'>
        📘 Edit Section Quiz
      </h2>
      <QuizForm
        parentId={sectionId}
        parentType='section'
        token={token}
        onSuccess={() =>
          router.push(
            `/dashboard/instructor/content/curriculum/${courseId}/${sectionId}/edit-section`
          )
        }
      />
    </div>
  )
}
