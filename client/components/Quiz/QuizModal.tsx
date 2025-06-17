// 'use client'

// import React, { useState } from 'react'
// import { Quiz } from 'types/quiz'

// interface QuizModalProps {
//   quiz: Quiz
//   quizType: 'lecture' | 'section'
//   onClose: () => void
// }

// const QuizModal: React.FC<QuizModalProps> = ({ quiz, quizType, onClose }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [answers, setAnswers] = useState<{ [key: number]: number }>({})

//   const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
//     setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
//   }

//   const handleSubmit = () => {
//     // Calculate score and submit to server
//     onClose()
//   }

//   return (
//     <div className='lg:col-span-2 bg-white rounded-lg shadow-lg p-6'>
//       <div className='flex justify-between items-center mb-6'>
//         <h2 className='text-2xl font-bold'>
//           {quizType === 'lecture' ? 'Lecture Quiz' : 'Section Quiz'}
//         </h2>
//         <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
//           ✕
//         </button>
//       </div>

//       <div className='mb-4'>
//         <h3 className='text-lg font-semibold'>
//           Question {currentQuestion + 1} of {quiz.questions.length}
//         </h3>
//         <p className='text-gray-700 mt-2'>
//           {quiz.questions[currentQuestion].questionText}
//         </p>
//       </div>

//       <div className='space-y-3'>
//         {quiz.questions[currentQuestion].options.map((option, index) => (
//           <div
//             key={index}
//             className={`p-3 border rounded cursor-pointer ${
//               answers[currentQuestion] === index
//                 ? 'bg-blue-100 border-blue-500'
//                 : 'hover:bg-gray-50'
//             }`}
//             onClick={() => handleAnswerSelect(currentQuestion, index)}
//           >
//             {option}
//           </div>
//         ))}
//       </div>

//       <div className='flex justify-between mt-6'>
//         <button
//           onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
//           disabled={currentQuestion === 0}
//           className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
//         >
//           Previous
//         </button>

//         {currentQuestion < quiz.questions.length - 1 ? (
//           <button
//             onClick={() => setCurrentQuestion((prev) => prev + 1)}
//             className='px-4 py-2 bg-blue-600 text-white rounded'
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             className='px-4 py-2 bg-green-600 text-white rounded'
//           >
//             Submit Quiz
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// export default QuizModal
