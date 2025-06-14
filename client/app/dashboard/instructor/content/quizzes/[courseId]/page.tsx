'use client'

import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useParams } from 'next/navigation'

interface Quiz {
  _id: string
  title: string
}

interface Assignment {
  _id: string
  title: string
}

interface Lecture {
  _id: string
  title: string
  duration: string
  quizzes?: Quiz[]
}

interface Section {
  _id: string
  title: string
  lectures: Lecture[]
  quiz?: Quiz
  assignment?: Assignment
}

const QuizzesPage = ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = useParams()
  const token = useSelector((state: RootState) => state.auth.token)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSections = async () => {
      if (!token || !courseId) return
      setLoading(true)
      try {
        const res = await axios.get(
          `http://localhost:5000/api/instructor/courses/${courseId}/sections`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setSections(res.data.sections || [])
      } catch (err) {
        toast.error('Failed to load sections')
      } finally {
        setLoading(false)
      }
    }
    fetchSections()
  }, [token, courseId])

  const deleteQuiz = async (quizId: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/instructor/quizzes/${quizId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success('Quiz deleted')
      // Refresh can be optimized later
      window.location.reload()
    } catch {
      toast.error('Failed to delete quiz')
    }
  }

  // const deleteAssignment = async (assignmentId: string) => {
  //   try {
  //     await axios.delete(
  //       `http://localhost:5000/api/instructor/assignments/${assignmentId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     toast.success('Assignment deleted')
  //     window.location.reload()
  //   } catch {
  //     toast.error('Failed to delete assignment')
  //   }
  // }

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-indigo-700'>📚 Quizzes</h2>
      </div>

      {loading ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : sections.length === 0 ? (
        <div className='text-center text-gray-500'>No sections found.</div>
      ) : (
        <div className='space-y-6'>
          {sections.map((section) => (
            <div
              key={section._id}
              className='bg-white border rounded-xl shadow-sm p-4'
            >
              {/* Section Header */}
              <div className='flex justify-between items-center mb-2'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  {section.title}
                </h3>
              </div>

              {/* Lectures */}
              {section.lectures.length === 0 ? (
                <p className='text-sm text-gray-500 ml-2'>
                  No lectures in this section.
                </p>
              ) : (
                <ul className='pl-4 list-disc space-y-1'>
                  {section.lectures.map((lecture) => (
                    <li
                      key={lecture._id}
                      className='flex flex-col gap-1 text-sm text-gray-700'
                    >
                      <div className='flex justify-between items-center'>
                        <span>{lecture.title}</span>
                        <div className='flex gap-2'>
                          <Link
                            href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/${lecture._id}/add-lecture-quiz`}
                          >
                            <button className='text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700'>
                              🎯 Add Lecture Quiz
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Lecture Quizzes */}
                      {lecture.quizzes && lecture.quizzes.length > 0 && (
                        <ul className='ml-4 list-disc text-xs text-gray-600'>
                          {lecture.quizzes.map((q) => (
                            <li key={q._id}>
                              {q.title}{' '}
                              <Link
                                href={`/dashboard/instructor/quizzes/${q._id}/edit`}
                                className='text-blue-500 hover:underline ml-1'
                              >
                                Edit
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Section-level Quiz & Assignment */}
              <div className='pl-4 text-sm mt-4 space-y-1 space-x-3'>
                {/* Quiz */}
                {section.quiz ? (
                  <div>
                    🎯 Section Quiz: {section.quiz.title}
                    <Link
                      href={`/dashboard/instructor/content/curriculum/${courseId}/${section._id}/edit-section-quiz`}
                    >
                      <button className='ml-2 text-green-600 hover:underline'>
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteQuiz(section.quiz._id)}
                      className='ml-2 text-red-500 hover:underline'
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/add-section-quiz`}
                  >
                    <button className='text-indigo-600 hover:underline'>
                      ➕ Add Section Quiz
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuizzesPage

// 'use client'

// import { Plus, Trash2 } from 'lucide-react'
// import Link from 'next/link'
// import { useParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { toast } from 'react-hot-toast'
// import { RootState } from 'features/redux/store'
// import axios from 'axios'

// interface Quiz {
//   _id: string
//   title: string
//   questionsCount: number
// }

// interface Lecture {
//   _id: string
//   title: string
//   quizzes: Quiz[]
// }

// interface Section {
//   _id: string
//   title: string
//   lectures: Lecture[]
//   quiz?: Quiz
// }

// export default function QuizzesPage() {
//   const { courseId } = useParams()
//   const token = useSelector((state: RootState) => state.auth.token)
//   const [sections, setSections] = useState<Section[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           // `http://localhost:5000/api/instructor/courses/${courseId}/quizzes`,
//           `http://localhost:5000/api/instructor/courses/${courseId}/sections`,

//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         console.log(res.data.sections, 'res')
//         setSections(res.data.sections)
//       } catch (error) {
//         toast.error('Failed to fetch quizzes')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [courseId, token])

//   const handleDeleteQuiz = async (
//     quizId: string,
//     type: 'section' | 'lecture'
//   ) => {
//     try {
//       await axios.delete(`localhost:5000/api/instructor/quizzes/${quizId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       toast.success('Quiz deleted')
//       setSections((prev) => updateSectionsAfterDelete(prev, quizId, type))
//     } catch (error) {
//       toast.error('Failed to delete quiz')
//     }
//   }

//   if (loading) return <div>Loading quizzes...</div>

//   return (
//     <div className='p-6 max-w-6xl mx-auto'>
//       <h1 className='text-2xl font-bold mb-6'>Course Quizzes</h1>

//       {sections.map((section) => (
//         <div key={section._id} className='mb-8 border rounded-lg p-4'>
//           <div className='flex justify-between items-center mb-4'>
//             <h2 className='text-xl font-semibold'>{section.title}</h2>
//             <div className='flex gap-2'>
//               <Link
//                 href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/add-quiz`}
//                 className='btn-primary'
//               >
//                 <Plus size={16} /> Add Section Quiz
//               </Link>
//             </div>
//           </div>

//           {/* Section Quiz */}
//           {section.quiz && (
//             <div className='mb-4 p-3 bg-gray-50 rounded flex justify-between'>
//               <div>
//                 <h3 className='font-medium'>{section.quiz.title}</h3>
//                 <p className='text-sm text-gray-600'>
//                   {section.quiz.questionsCount} questions
//                 </p>
//               </div>
//               <div className='flex gap-2'>
//                 <Link
//                   href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/edit-quiz`}
//                   className='btn-secondary'
//                 >
//                   Edit
//                 </Link>
//                 <button
//                   onClick={() => handleDeleteQuiz(section.quiz._id, 'section')}
//                   className='btn-danger'
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Lectures Quizzes */}
//           <div className='space-y-4'>
//             {section.lectures.map((lecture) => (
//               <div key={lecture._id} className='ml-4 border-l pl-4'>
//                 <h3 className='font-medium'>{lecture.title}</h3>
//                 <div className='flex justify-end mb-2'>
//                   <Link
//                     href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/${lecture._id}/add-quiz`}
//                     className='btn-primary-sm'
//                   >
//                     <Plus size={14} /> Add Quiz
//                   </Link>
//                 </div>

//                 {lecture.quizzes.map((quiz) => (
//                   <div
//                     key={quiz._id}
//                     className='p-2 bg-gray-50 rounded flex justify-between items-center'
//                   >
//                     <div>
//                       <h4 className='text-sm font-medium'>{quiz.title}</h4>
//                       <p className='text-xs text-gray-600'>
//                         {quiz.questionsCount} questions
//                       </p>
//                     </div>
//                     <div className='flex gap-2'>
//                       <Link
//                         href={`/dashboard/instructor/content/quizzes/${courseId}/${section._id}/${lecture._id}/edit-quiz`}
//                         className='btn-secondary-sm'
//                       >
//                         Edit
//                       </Link>
//                       <button
//                         onClick={() => handleDeleteQuiz(quiz._id, 'lecture')}
//                         className='btn-danger-sm'
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// function updateSectionsAfterDelete(
//   sections: Section[],
//   quizId: string,
//   type: 'section' | 'lecture'
// ) {
//   return sections.map((section) => {
//     if (type === 'section' && section.quiz?._id === quizId) {
//       const { quiz, ...rest } = section
//       return rest
//     }

//     return {
//       ...section,
//       lectures: section.lectures.map((lecture) => ({
//         ...lecture,
//         quizzes: lecture.quizzes.filter((q) => q._id !== quizId),
//       })),
//     }
//   })
// }
