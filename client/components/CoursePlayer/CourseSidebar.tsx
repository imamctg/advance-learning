import React, { useState } from 'react'

interface Lecture {
  _id: string
  title: string
  videoUrl: string
  duration: number
  description?: string
  resourceUrl?: string
}

interface Section {
  _id: string
  title: string
  lectures: Lecture[]
  quiz?: any
}

interface Props {
  sections: Section[]
  selectedLectureId: string
  onSelect: (lecture: Lecture) => void
  onQuizOpen: (quiz: any) => void
}

const CourseSidebar: React.FC<Props> = ({
  sections,
  selectedLectureId,
  onSelect,
  onQuizOpen,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  )
  console.log('new section', sections)
  console.log('fffffff', selectedLectureId)
  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <div className='bg-white rounded-xl shadow p-4 h-[450px] overflow-y-auto'>
      <h3 className='text-lg font-semibold mb-4'>📚 কোর্স সিলেবাস</h3>
      {sections.map((section, sectionIndex) => (
        <div key={section._id} className='mb-4'>
          <div
            className='font-bold text-gray-800 mb-2 cursor-pointer flex justify-between items-center'
            onClick={() => toggleSection(section._id)}
          >
            <span>
              Section {sectionIndex + 1}: {section.title}
            </span>
            <span>{openSections[section._id] ? '🔽' : '▶️'}</span>
          </div>

          {openSections[section._id] && (
            <div className='ml-4'>
              {section.lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  onClick={() => onSelect(lecture)}
                  className={`cursor-pointer mb-2 p-2 border rounded hover:bg-gray-100 ${
                    selectedLectureId === lecture._id
                      ? 'bg-blue-100 border-blue-500'
                      : ''
                  }`}
                >
                  <p className='font-medium'>{lecture.title}</p>
                  <p className='text-xs text-gray-500'>
                    ⏱ {lecture.duration} মিনিট
                  </p>
                </div>
              ))}

              {section.quiz && (
                <button
                  onClick={() => onQuizOpen(section.quiz)}
                  className='mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200'
                >
                  🎯 Take Quiz
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CourseSidebar
