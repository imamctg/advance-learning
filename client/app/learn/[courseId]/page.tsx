'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
// import CourseSidebar from 'components/Course/CourseSidebar'

import { set } from 'video.js/dist/types/tech/middleware'
import CourseSidebar from 'components/CoursePlayer/CourseSidebar'
import CustomVideoPlayer from 'components/CoursePlayer/CustomVideoPlayer'
import CertificateDownloadButton from 'components/certificates/CertificateDownloadButton'
import { useSelector } from 'react-redux'

export default function CourseDetailsPage() {
  const user = useSelector((state: any) => state.auth.user)
  const { courseId: rawCourseId } = useParams()
  const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId
  // const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const isInstructor = user?.role === 'instructor'
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        )
        const courseData = res.data.data

        setCourse(courseData)
        // Set first lecture as default selected
        if (
          courseData.sections &&
          courseData.sections.length > 0 &&
          courseData.sections[0].lectures.length > 0
        ) {
          setSelectedLecture(courseData.sections[0].lectures[0])
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  if (!course || !selectedLecture) return <p>Loading...</p>
  console.log('videoURL checking...', selectedLecture.videoUrl)
  const handleQuizOpen = (quiz: any) => {
    setCurrentQuiz(quiz)
    setShowQuiz(true)
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-6'>
      <div className='lg:col-span-2'>
        <CustomVideoPlayer src={selectedLecture.videoUrl} />

        <h2 className='text-2xl font-bold mt-4'>{selectedLecture.title}</h2>
        <p className='text-sm text-gray-600 mt-2'>
          {selectedLecture.description}
        </p>

        {/* সার্টিফিকেট ডাউনলোড বাটন */}
        {/* <CertificateDownloadButton studentName={studentName} courseName={courseName} /> */}
        {/* <CertificateDownloadButton userId={user?.id} courseId={courseId} /> */}
        {!isInstructor && (
          <CertificateDownloadButton userId={user?.id} courseId={courseId} />
        )}
      </div>

      <CourseSidebar
        sections={course.sections}
        // lectures={course.sections[0].lectures}
        selectedLectureId={selectedLecture._id}
        onSelect={setSelectedLecture}
        onQuizOpen={handleQuizOpen}
      />
    </div>
  )
}
