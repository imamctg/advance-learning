'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from 'components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import axios from 'axios'

export default function QuizzesPage() {
  const { courseId } = useParams()
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.get(`/api/courses/${courseId}/quizzes`)
      setQuizzes(res.data)
    }
    fetchQuizzes()
  }, [courseId])

  const handleDelete = async (quizId: string) => {
    await axios.delete(`/api/courses/${courseId}/quizzes/${quizId}`)
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId))
  }

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Quizzes</h1>
      <Button variant='default' className='mb-4'>
        <Plus className='w-4 h-4 mr-2' />
        Add Quiz
      </Button>
      <ul className='space-y-2'>
        {quizzes.map((quiz: any) => (
          <li
            key={quiz.id}
            className='flex justify-between p-3 bg-gray-100 rounded-md'
          >
            <div>
              <p className='font-semibold'>{quiz.title}</p>
              <p className='text-sm text-gray-600'>
                {quiz.questions.length} Questions
              </p>
            </div>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => handleDelete(quiz.id)}
            >
              <Trash2 className='w-4 h-4 text-red-500' />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
