// 'use client'

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { toast } from 'react-hot-toast'
// import QuestionEditor, { QuestionType } from './QuestionEditor'

// type QuizFormProps = {
//   parentId: string // sectionId or lectureId
//   parentType: 'section' | 'lecture'
//   token: string
//   onSuccess?: () => void
// }

// const QuizForm: React.FC<QuizFormProps> = ({
//   parentId,
//   parentType,
//   token,
//   onSuccess,
// }) => {
//   const [title, setTitle] = useState('')
//   const [instructions, setInstructions] = useState('')
//   const [duration, setDuration] = useState(15)
//   const [totalMarks, setTotalMarks] = useState(10)
//   const [questions, setQuestions] = useState<QuestionType[]>([])
//   const [loading, setLoading] = useState(false)

//   const apiBase =
//     parentType === 'section'
//       ? `http://localhost:5000/api/quizzes/sections/${parentId}/quiz`
//       : `http://localhost:5000/api/quizzes/lectures/${parentId}/quiz`

//   // Fetch existing quiz
//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await axios.get(apiBase, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const quiz = res.data.quiz
//         if (quiz) {
//           setTitle(quiz.title || '')
//           setInstructions(quiz.instructions || '')
//           setDuration(quiz.duration || 15)
//           setTotalMarks(quiz.totalMarks || 10)
//           setQuestions(quiz.questions || [])
//         }
//       } catch (err) {
//         console.log('No existing quiz found.')
//       }
//     }

//     fetchQuiz()
//   }, [apiBase, token])

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

//   const handleSubmit = async () => {
//     if (!title.trim()) return toast.error('Quiz title is required.')
//     if (questions.length === 0)
//       return toast.error('At least one question is required.')

//     setLoading(true)
//     try {
//       await axios.put(
//         apiBase,
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
//       onSuccess?.()
//     } catch (err) {
//       toast.error('Failed to save quiz.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='space-y-6'>
//       <div>
//         <label className='block font-medium'>Quiz Title</label>
//         <input
//           className='w-full border p-2 rounded'
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//       </div>

//       <div>
//         <label className='block font-medium'>Instructions</label>
//         <textarea
//           className='w-full border p-2 rounded'
//           rows={4}
//           value={instructions}
//           onChange={(e) => setInstructions(e.target.value)}
//         />
//       </div>

//       <div className='grid grid-cols-2 gap-4'>
//         <div>
//           <label className='block font-medium'>Duration (minutes)</label>
//           <input
//             type='number'
//             className='w-full border p-2 rounded'
//             value={duration}
//             onChange={(e) => setDuration(Number(e.target.value))}
//           />
//         </div>

//         <div>
//           <label className='block font-medium'>Total Marks</label>
//           <input
//             type='number'
//             className='w-full border p-2 rounded'
//             value={totalMarks}
//             onChange={(e) => setTotalMarks(Number(e.target.value))}
//           />
//         </div>
//       </div>

//       <div>
//         <h3 className='text-lg font-semibold mt-6 mb-2'>Questions</h3>
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
//           className='text-sm text-blue-600 underline mt-3'
//         >
//           ➕ Add Question
//         </button>
//       </div>

//       <div className='pt-6'>
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className='bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-50'
//         >
//           {loading ? 'Saving...' : 'Save Quiz'}
//         </button>
//       </div>
//     </div>
//   )
// }

// export default QuizForm

'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import QuestionEditor, { QuestionType } from './QuestionEditor'

type QuizFormProps = {
  parentId: string // sectionId or lectureId
  parentType: 'section' | 'lecture'
  token: string
  onSuccess?: () => void
}

const QuizForm: React.FC<QuizFormProps> = ({
  parentId,
  parentType,
  token,
  onSuccess,
}) => {
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [duration, setDuration] = useState(15)
  const [totalMarks, setTotalMarks] = useState(10)
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const apiBase =
    parentType === 'section'
      ? `http://localhost:5000/api/quizzes/sections/${parentId}/quiz`
      : `http://localhost:5000/api/quizzes/lectures/${parentId}/quiz`

  // Fetch existing quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(apiBase, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const quiz = res.data.quiz
        if (quiz) {
          setIsEditing(true)
          setTitle(quiz.title || '')
          setInstructions(quiz.instructions || '')
          setDuration(quiz.duration || 15)
          setTotalMarks(quiz.totalMarks || 10)
          setQuestions(quiz.questions || [])
        }
      } catch (err) {
        console.log('No existing quiz found.')
      }
    }

    fetchQuiz()
  }, [apiBase, token])

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1,
        explanation: '',
      },
    ])
  }

  const handleQuestionChange = (index: number, updated: QuestionType) => {
    const newQ = [...questions]
    newQ[index] = updated
    setQuestions(newQ)
  }

  const handleDeleteQuestion = (index: number) => {
    const newQ = [...questions]
    newQ.splice(index, 1)
    setQuestions(newQ)
  }

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error('Quiz title is required.')
      return false
    }

    if (questions.length === 0) {
      toast.error('At least one question is required.')
      return false
    }

    // Validate each question
    for (const [index, question] of questions.entries()) {
      if (!question.questionText.trim()) {
        toast.error(`Question ${index + 1} text is required.`)
        return false
      }

      if (question.options.some((opt) => !opt.trim())) {
        toast.error(`All options must be filled for Question ${index + 1}.`)
        return false
      }

      if (question.marks <= 0) {
        toast.error(`Marks must be positive for Question ${index + 1}.`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await axios.put(
        apiBase,
        {
          title,
          instructions,
          duration,
          totalMarks,
          questions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.success(`Quiz ${isEditing ? 'updated' : 'created'} successfully!`)
      onSuccess?.()
    } catch (err) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} quiz.`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6 p-4 bg-white rounded-lg shadow-sm'>
      <div className='flex justify-between items-center border-b pb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>
        <button
          onClick={handleAddQuestion}
          className='flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm'
        >
          <span>+</span> Add Question
        </button>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Quiz Title *
          </label>
          <input
            className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter quiz title'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Instructions
          </label>
          <textarea
            className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500'
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder='Provide instructions for the quiz'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Duration (minutes) *
            </label>
            <input
              type='number'
              min='1'
              className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500'
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Total Marks *
            </label>
            <input
              type='number'
              min='1'
              className='w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500'
              value={totalMarks}
              onChange={(e) =>
                setTotalMarks(Math.max(1, Number(e.target.value)))
              }
            />
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>Questions</h3>

        {questions.length === 0 ? (
          <div className='text-center py-4 text-gray-500'>
            No questions added yet. Click "Add Question" to get started.
          </div>
        ) : (
          <div className='space-y-4'>
            {questions.map((q, index) => (
              <QuestionEditor
                key={index}
                index={index}
                question={q}
                onChange={handleQuestionChange}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>
        )}
      </div>

      <div className='pt-6 flex justify-end'>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <span className='flex items-center gap-2'>
              <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <span>{isEditing ? 'Update Quiz' : 'Create Quiz'}</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default QuizForm
