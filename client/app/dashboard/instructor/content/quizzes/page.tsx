// ✅ Quizzes Page: app/dashboard/instructor/content/quizzes/page.tsx
'use client'

import { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'

interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')

  const handleAddQuiz = () => {
    if (!question || options.includes('') || !correctAnswer) return
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      question,
      options,
      correctAnswer,
    }
    setQuizzes([...quizzes, newQuiz])
    setQuestion('')
    setOptions(['', '', '', ''])
    setCorrectAnswer('')
  }

  const removeQuiz = (id: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== id))
  }

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-semibold'>📝 Quizzes</h2>

      {/* Add New Quiz */}
      <div className='bg-white p-4 rounded shadow space-y-4'>
        <input
          type='text'
          placeholder='Question'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className='w-full border p-2 rounded'
        />

        <div className='grid grid-cols-2 gap-2'>
          {options.map((opt, idx) => (
            <input
              key={idx}
              type='text'
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => {
                const updated = [...options]
                updated[idx] = e.target.value
                setOptions(updated)
              }}
              className='border p-2 rounded'
            />
          ))}
        </div>

        <select
          className='border p-2 rounded w-full'
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        >
          <option value=''>Select Correct Answer</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt || `Option ${idx + 1}`}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddQuiz}
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2'
        >
          <FaPlus /> Add Quiz
        </button>
      </div>

      {/* Quiz List */}
      <div className='bg-white p-4 rounded shadow'>
        <h3 className='font-medium mb-2'>Quiz List</h3>
        <ul className='space-y-3'>
          {quizzes.length ? (
            quizzes.map((q) => (
              <li key={q.id} className='border p-2 rounded'>
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-semibold'>{q.question}</p>
                    <ul className='list-disc ml-5 text-sm'>
                      {q.options.map((opt, idx) => (
                        <li
                          key={idx}
                          className={
                            opt === q.correctAnswer
                              ? 'text-green-600 font-semibold'
                              : ''
                          }
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <FaTrash
                    onClick={() => removeQuiz(q.id)}
                    className='text-red-500 cursor-pointer mt-1'
                  />
                </div>
              </li>
            ))
          ) : (
            <p className='text-gray-500'>No quizzes added yet</p>
          )}
        </ul>
      </div>
    </div>
  )
}
