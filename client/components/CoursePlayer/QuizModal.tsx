'use client'

import { useState } from 'react'

interface Question {
  question: string
  options: string[]
  correctAnswerIndex: number
}

interface Props {
  quiz: { questions: Question[] }
  onClose: () => void
}

const QuizModal: React.FC<Props> = ({ quiz, onClose }) => {
  const [answers, setAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleAnswer = (index: number, selected: number) => {
    const updated = [...answers]
    updated[index] = selected
    setAnswers(updated)
  }

  const calculateScore = () => {
    return quiz.questions.reduce((score, q, i) => {
      return score + (answers[i] === q.correctAnswerIndex ? 1 : 0)
    }, 0)
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg w-full max-w-xl'>
        <h2 className='text-xl font-bold mb-4'>🎯 কুইজ</h2>
        {quiz.questions.map((q, index) => (
          <div key={index} className='mb-4'>
            <p className='font-medium'>{q.question}</p>
            <div className='mt-2 space-y-1'>
              {q.options.map((opt, i) => (
                <label key={i} className='block'>
                  <input
                    type='radio'
                    name={`q-${index}`}
                    checked={answers[index] === i}
                    onChange={() => handleAnswer(index, i)}
                    disabled={submitted}
                    className='mr-2'
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        {submitted && (
          <div className='text-lg font-semibold text-green-700 mt-4'>
            ✅ আপনি পেয়েছেন: {calculateScore()} / {quiz.questions.length}
          </div>
        )}

        <div className='mt-6 flex justify-end gap-4'>
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className='bg-blue-600 text-white px-4 py-2 rounded'
            >
              সাবমিট
            </button>
          ) : (
            <button
              onClick={onClose}
              className='bg-gray-600 text-white px-4 py-2 rounded'
            >
              বন্ধ করুন
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizModal
