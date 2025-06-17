// import React, { useState } from 'react'

// interface Question {
//   question: string
//   options: string[]
//   correctAnswerIndex: number
// }

// interface Quiz {
//   questions: Question[]
// }

// interface Lecture {
//   _id: string
//   title: string
//   quiz?: Quiz
//   videoUrl: string
//   duration: number
//   description?: string
//   resourceUrl?: string
// }

// interface Section {
//   _id: string
//   title: string
//   lectures: Lecture[]
//   quiz?: Quiz
// }

// interface Props {
//   sections: Section[]
//   selectedLectureId: string
//   onSelect: (lecture: Lecture) => void
//   onQuizOpen: (quiz: Quiz, type: 'lecture' | 'section') => void
// }

// const CourseSidebar: React.FC<Props> = ({
//   sections,
//   selectedLectureId,
//   onSelect,
//   onQuizOpen,
// }) => {
//   const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
//     {}
//   )

//   const toggleSection = (sectionId: string) => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }))
//   }

//   return (
//     <div className='bg-white rounded-xl shadow p-4 h-[450px] overflow-y-auto'>
//       <h3 className='text-lg font-semibold mb-4'>📚 কোর্স সিলেবাস</h3>
//       {sections.map((section, sectionIndex) => (
//         <div key={section._id} className='mb-4'>
//           <div
//             className='font-bold text-gray-800 mb-2 cursor-pointer flex justify-between items-center'
//             onClick={() => toggleSection(section._id)}
//           >
//             <span>
//               Section {sectionIndex + 1}: {section.title}
//             </span>
//             <span>{openSections[section._id] ? '🔽' : '▶️'}</span>
//           </div>

//           {openSections[section._id] && (
//             <div className='ml-4'>
//               {section.lectures.map((lecture) => (
//                 <div key={lecture._id}>
//                   <div
//                     onClick={() => onSelect(lecture)}
//                     className={`cursor-pointer mb-2 p-2 border rounded hover:bg-gray-100 ${
//                       selectedLectureId === lecture._id
//                         ? 'bg-blue-100 border-blue-500'
//                         : ''
//                     }`}
//                   >
//                     <p className='font-medium'>{lecture.title}</p>
//                     <p className='text-xs text-gray-500'>
//                       ⏱ {lecture.duration} মিনিট
//                     </p>
//                   </div>

//                   {lecture.quiz && (
//                     <button
//                       onClick={() => onQuizOpen(lecture.quiz, 'lecture')}
//                       className='mt-1 ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200'
//                     >
//                       🎯 Lecture Quiz
//                     </button>
//                   )}
//                 </div>
//               ))}

//               {section.quiz && (
//                 <button
//                   onClick={() => onQuizOpen(section.quiz, 'section')}
//                   className='mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200'
//                 >
//                   🏁 Section Quiz
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default CourseSidebar

// import React, { useEffect, useState } from 'react'

// interface Question {
//   question: string
//   options: string[]
//   correctAnswerIndex: number
// }

// interface Quiz {
//   _id: string
//   title: string
//   questions: Question[]
// }

// interface Lecture {
//   _id: string
//   title: string
//   quiz?: Quiz
//   videoUrl: string
//   duration: number
//   description?: string
//   resourceUrl?: string
//   completed?: boolean
// }

// interface Section {
//   _id: string
//   title: string
//   lectures: Lecture[]
//   quiz?: Quiz
// }

// interface Props {
//   sections: Section[]
//   selectedLectureId: string
//   onSelect: (lecture: Lecture) => void
//   onQuizOpen: (quiz: Quiz, type: 'lecture' | 'section') => void
// }

// const CourseSidebar: React.FC<Props> = ({
//   sections,
//   selectedLectureId,
//   onSelect,
//   onQuizOpen,
// }) => {
//   const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
//     {}
//   )

//   const toggleSection = (sectionId: string) => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }))
//   }

//   // Auto-open section if it contains selected lecture
//   useEffect(() => {
//     if (selectedLectureId) {
//       const sectionContainingLecture = sections.find((section) =>
//         section.lectures.some((lecture) => lecture._id === selectedLectureId)
//       )
//       if (
//         sectionContainingLecture &&
//         !openSections[sectionContainingLecture._id]
//       ) {
//         setOpenSections((prev) => ({
//           ...prev,
//           [sectionContainingLecture._id]: true,
//         }))
//       }
//     }
//   }, [selectedLectureId, sections])

//   return (
//     <div className='bg-white rounded-xl shadow p-4 h-[calc(100vh-200px)] overflow-y-auto'>
//       <h3 className='text-lg font-semibold mb-4'>📚 Course Syllabus</h3>

//       {sections.map((section, sectionIndex) => (
//         <div key={section._id} className='mb-4'>
//           <div
//             className='font-bold text-gray-800 mb-2 cursor-pointer flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg'
//             onClick={() => toggleSection(section._id)}
//           >
//             <div className='flex items-center'>
//               <span className='mr-2'>
//                 {openSections[section._id] ? '🔽' : '▶️'}
//               </span>
//               <span>
//                 Section {sectionIndex + 1}: {section.title}
//               </span>
//             </div>
//             <span className='text-xs bg-gray-100 px-2 py-1 rounded-full'>
//               {section.lectures.filter((l) => l.completed).length}/
//               {section.lectures.length}
//             </span>
//           </div>

//           {openSections[section._id] && (
//             <div className='ml-6 mt-2'>
//               {section.lectures.map((lecture) => (
//                 <div key={lecture._id} className='mb-3'>
//                   <div
//                     onClick={() => onSelect(lecture)}
//                     className={`cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
//                       selectedLectureId === lecture._id
//                         ? 'bg-blue-50 border-blue-200'
//                         : 'border-gray-200'
//                     } ${
//                       lecture.completed ? 'border-green-200 bg-green-50' : ''
//                     }`}
//                   >
//                     <div className='flex items-start'>
//                       {lecture.completed ? (
//                         <span className='mr-2 text-green-500 mt-0.5'>✓</span>
//                       ) : (
//                         <span className='mr-2 text-gray-400 mt-0.5'>○</span>
//                       )}
//                       <div>
//                         <p className='font-medium'>{lecture.title}</p>
//                         <p className='text-xs text-gray-500 mt-1'>
//                           ⏱ {lecture.duration} min
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {lecture.quiz && (
//                     <button
//                       onClick={() => onQuizOpen(lecture.quiz, 'lecture')}
//                       className='mt-1 ml-8 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 flex items-center'
//                     >
//                       <span className='mr-1'>🎯</span>
//                       Lecture Quiz
//                     </button>
//                   )}
//                 </div>
//               ))}

//               {section.quiz && (
//                 <div className='mt-4 pt-3 border-t border-gray-100'>
//                   <button
//                     onClick={() => onQuizOpen(section.quiz, 'section')}
//                     className='w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-center'
//                   >
//                     <span className='mr-2'>🏁</span>
//                     Section Quiz
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default CourseSidebar

import React, { useEffect, useState } from 'react'
import { Quiz, Section, Lecture } from 'types/quiz'

interface Props {
  sections: Section[]
  selectedLectureId: string
  onSelect: (lecture: Lecture) => void
  onQuizOpen: (lectureId?: string, sectionId?: string) => void
  quizzes: Quiz[]
}

const CourseSidebar: React.FC<Props> = ({
  sections,
  selectedLectureId,
  onSelect,
  onQuizOpen,
  quizzes,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  )

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Check if lecture/section has quiz
  const hasQuiz = (lectureId?: string, sectionId?: string): boolean => {
    if (lectureId) {
      return quizzes.some((q) => q.lecture === lectureId)
    }
    if (sectionId) {
      return quizzes.some((q) => q.section === sectionId)
    }
    return false
  }

  // Auto-open section containing selected lecture
  useEffect(() => {
    if (selectedLectureId) {
      const sectionContainingLecture = sections.find((section) =>
        section.lectures.some((lecture) => lecture._id === selectedLectureId)
      )
      if (
        sectionContainingLecture &&
        !openSections[sectionContainingLecture._id]
      ) {
        setOpenSections((prev) => ({
          ...prev,
          [sectionContainingLecture._id]: true,
        }))
      }
    }
  }, [selectedLectureId, sections])

  return (
    <div className='bg-white rounded-xl shadow p-4 h-[calc(100vh-200px)] overflow-y-auto'>
      <h3 className='text-lg font-semibold mb-4'>📚 Course Syllabus</h3>

      {sections.map((section, sectionIndex) => (
        <div key={section._id} className='mb-4'>
          <div
            className='font-bold text-gray-800 mb-2 cursor-pointer flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg'
            onClick={() => toggleSection(section._id)}
          >
            <div className='flex items-center'>
              <span className='mr-2'>
                {openSections[section._id] ? '🔽' : '▶️'}
              </span>
              <span>
                Section {sectionIndex + 1}: {section.title}
              </span>
            </div>
            <span className='text-xs bg-gray-100 px-2 py-1 rounded-full'>
              {section.lectures.filter((l) => l.completed).length}/
              {section.lectures.length}
            </span>
          </div>

          {openSections[section._id] && (
            <div className='ml-6 mt-2'>
              {section.lectures.map((lecture) => (
                <div key={lecture._id} className='mb-3'>
                  <div
                    onClick={() => onSelect(lecture)}
                    className={`cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedLectureId === lecture._id
                        ? 'bg-blue-50 border-blue-200'
                        : 'border-gray-200'
                    } ${
                      lecture.completed ? 'border-green-200 bg-green-50' : ''
                    }`}
                  >
                    <div className='flex items-start'>
                      {lecture.completed ? (
                        <span className='mr-2 text-green-500 mt-0.5'>✓</span>
                      ) : (
                        <span className='mr-2 text-gray-400 mt-0.5'>○</span>
                      )}
                      <div>
                        <p className='font-medium'>{lecture.title}</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          ⏱ {lecture.duration} min
                        </p>
                      </div>
                    </div>
                  </div>

                  {hasQuiz(lecture._id) && (
                    <button
                      onClick={() => onQuizOpen(lecture._id)}
                      className='mt-1 ml-8 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 flex items-center'
                    >
                      <span className='mr-1'>🎯</span>
                      Lecture Quiz
                    </button>
                  )}
                </div>
              ))}

              {hasQuiz(undefined, section._id) && (
                <div className='mt-4 pt-3 border-t border-gray-100'>
                  <button
                    onClick={() => onQuizOpen(undefined, section._id)}
                    className='w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-center'
                  >
                    <span className='mr-2'>🏁</span>
                    Section Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CourseSidebar
