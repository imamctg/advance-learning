// 'use client'

// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useSelector } from 'react-redux'
// import { RootState } from 'features/redux/store'
// import { FaTrash } from 'react-icons/fa'

// interface Quiz {
//   _id: string
//   question: string
//   options: string[]
//   correctAnswer: string
//   lectureId: string
//   lectureTitle?: string
// }

// export default function AllQuizzesPage() {
//   const [quizzes, setQuizzes] = useState<Quiz[]>([])
//   const [loading, setLoading] = useState(true)
//   const token = useSelector((state: RootState) => state.auth.token)

//   const fetchAllQuizzes = async () => {
//     try {
//       const { data } = await axios.get(
//         'http://localhost:5000/api/quizzes/instructor',
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       setQuizzes(data)
//     } catch (err) {
//       toast.error('Failed to fetch quizzes')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (quizId: string) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setQuizzes(quizzes.filter((q) => q._id !== quizId))
//       toast.success('Quiz deleted')
//     } catch {
//       toast.error('Failed to delete quiz')
//     }
//   }

//   useEffect(() => {
//     fetchAllQuizzes()
//   }, [])

//   return (
//     <div className='p-6 space-y-6'>
//       <h2 className='text-2xl font-bold text-gray-800'>🧠 All Quizzes</h2>

//       {loading ? (
//         <p className='text-gray-500'>Loading quizzes...</p>
//       ) : quizzes.length === 0 ? (
//         <p className='text-gray-500'>No quizzes found.</p>
//       ) : (
//         <div className='grid gap-4'>
//           {quizzes.map((quiz) => (
//             <div
//               key={quiz._id}
//               className='bg-white p-4 rounded shadow space-y-2'
//             >
//               <div className='flex justify-between items-start'>
//                 <div>
//                   <h4 className='font-semibold text-blue-700'>
//                     {quiz.question}
//                   </h4>
//                   <p className='text-sm text-gray-500'>
//                     Lecture: {quiz.lectureTitle || quiz.lectureId}
//                   </p>
//                   <ul className='list-disc ml-6 mt-1 text-sm'>
//                     {quiz.options.map((opt, idx) => (
//                       <li
//                         key={idx}
//                         className={
//                           opt === quiz.correctAnswer
//                             ? 'text-green-600 font-medium'
//                             : ''
//                         }
//                       >
//                         {opt}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <FaTrash
//                   onClick={() => handleDelete(quiz._id)}
//                   className='text-red-500 cursor-pointer mt-1'
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

interface Course {
  _id: string
  title: string
  thumbnail: string
}

const QuizCourseListPage = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/instructor/${user.id}/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setCourses(res.data.courses || [])
      } catch (err) {
        console.error('Failed to load courses')
      }
    }

    if (token) fetchCourses()
  }, [token])

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>
        📚 Select a course to manage quizzes
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {courses.map((course) => (
          <Link
            href={`/dashboard/instructor/content/quizzes/${course._id}`}
            key={course._id}
          >
            <div className='border rounded-lg shadow hover:shadow-md p-4 cursor-pointer transition'>
              <img
                src={course.thumbnail}
                alt={course.title}
                className='h-40 w-full object-cover rounded mb-2'
              />
              <h3 className='text-lg font-semibold'>{course.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuizCourseListPage
