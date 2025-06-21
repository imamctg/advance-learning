'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'
import FullPageLoader from 'components/common/FullPageLoader'
import ErrorPage from 'components/common/ErrorPage'
import CourseSidebar from 'components/CoursePlayer/CourseSidebar'
import CustomVideoPlayer from 'components/CoursePlayer/CustomVideoPlayer'
import QuizModal from 'components/CoursePlayer/QuizModal'
import type { Quiz, Lecture, Section } from 'types/quiz'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'

interface Course {
  _id: string
  title: string
  description: string
  thumbnail: string
  sections: Section[]
}

export default function CourseDetailsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const { courseId } = useParams()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [quizType, setQuizType] = useState<'lecture' | 'section' | null>(null)
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)

  // Fetch course and quizzes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Early return if missing critical data
        if (!token || !courseId) {
          console.log('Waiting for token or courseId...')
          return
        }

        console.log('Fetching course data...')

        console.log(token, courseId, 'courseId', 'token')

        // Fetch course data
        // const courseRes = await axios.get(`/api/courses/${courseId}`)
        // const courseData = courseRes.data.data
        // console.log(courseData, 'courseData')
        // // Fetch quizzes for this course
        // const quizzesRes = await axios.get(
        //   `http://localhost:5000/api/quizzes/course/${courseId}`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // )

        // const quizzesData = quizzesRes.data.quizzes || [] // ফলব্যাক হিসেবে empty array

        // setCourse(courseData)
        // setQuizzes(quizzesData)

        // Fetch course data
        const [courseRes, quizzesRes] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          axios.get(`http://localhost:5000/api/quizzes/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const courseData = courseRes.data.data
        const quizzesData = quizzesRes.data.quizzes || []

        setCourse(courseData)
        setQuizzes(quizzesData)

        // Set first lecture as default selected
        // if (courseData.sections?.[0]?.lectures?.[0]) {
        //   setSelectedLecture(courseData.sections[0].lectures[0])
        // }

        // Set initial lecture if not already set
        if (!selectedLecture && courseData.sections?.[0]?.lectures?.[0]) {
          setSelectedLecture(courseData.sections[0].lectures[0])
        }
      } catch (err) {
        console.error('Error details:', err.response?.data || err.message)
        setError('Failed to load course data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, token])

  // Loading and error states
  if (loading && (!course || !selectedLecture)) {
    return <FullPageLoader />
  }

  if (error) {
    return <ErrorPage message={error} />
  }

  if (!course || !selectedLecture) {
    return <ErrorPage message='Course data could not be loaded' />
  }

  // Find quiz for current lecture or section
  const findQuiz = (
    lectureId?: string,
    sectionId?: string
  ): Quiz | undefined => {
    if (lectureId) {
      return quizzes.find((q) => q.lecture === lectureId)
    }
    if (sectionId) {
      return quizzes.find((q) => q.section === sectionId)
    }
    return undefined
  }

  const handleQuizOpen = (lectureId?: string, sectionId?: string) => {
    const quiz = findQuiz(lectureId, sectionId)
    if (!quiz) return

    if (lectureId) {
      setQuizType('lecture')
    } else if (sectionId) {
      setQuizType('section')
    }

    setCurrentQuiz(quiz)
    setShowQuiz(true)
  }

  // Frontend

  // const handleQuizSubmit = async (
  //   score: number,
  //   total: number,
  //   answers: any[]
  // ) => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/api/quizzes/submit/${currentQuiz?._id}`,
  //       {
  //         score,
  //         total,
  //         courseId,
  //         answers,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )

  //     if (!response.data.success) {
  //       throw new Error(response.data.message || 'Submission failed')
  //     }

  //     setShowQuiz(false)
  //     // Optional: Show success notification
  //   } catch (err) {
  //     console.error('Quiz submission error:', err)

  //     // Don't show error if submission was actually successful
  //     if (!err.response?.data?.success) {
  //       // Show error to user
  //     }
  //   }
  // }

  const handleQuizSubmit = async (
    score: number,
    total: number,
    answers: any[]
  ) => {
    try {
      // const response = await axios.post(
      //   `http://localhost:5000/api/quizzes/submit/${currentQuiz?._id}`,
      //   {
      //     score,
      //     total,
      //     courseId,
      //     answers,
      //     timeSpent: 0, // Add default timeSpent
      //     quizType, // Add quizType
      //   },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // )

      // if (!response.data.success) {
      //   throw new Error(response.data.message || 'Submission failed')
      // }

      setShowQuiz(false)
    } catch (err) {
      console.error('Quiz submission error:', err)
      // You might want to show an error message to the user here
    }
  }

  const markLectureCompleted = async (lectureId: string) => {
    if (!token) {
      throw new Error('No authentication token found')
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/courses/lectures/${lectureId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.success) {
        setCourse((prev) => {
          if (!prev) return null
          return {
            ...prev,
            sections: prev.sections.map((section) => ({
              ...section,
              lectures: section.lectures.map((lecture) =>
                lecture._id === lectureId
                  ? { ...lecture, completed: true }
                  : lecture
              ),
            })),
          }
        })
      }
    } catch (err) {
      console.error('Failed to mark lecture complete:', err)
      // Show error to user
    }
  }

  // Only check for selectedLecture after course is loaded
  if (!selectedLecture && course?.sections?.[0]?.lectures?.[0]) {
    setSelectedLecture(course.sections[0].lectures[0])
    return <FullPageLoader />
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6'>
      <div className='lg:col-span-2 order-1 lg:order-none'>
        {showQuiz && currentQuiz ? (
          <QuizModal
            quiz={currentQuiz}
            quizType={quizType}
            onClose={() => setShowQuiz(false)}
            onSubmit={handleQuizSubmit}
          />
        ) : (
          <CustomVideoPlayer
            src={selectedLecture.videoUrl}
            onComplete={() => markLectureCompleted(selectedLecture._id)}
          />
        )}
      </div>

      <div className='order-2 lg:order-none'>
        <CourseSidebar
          sections={course.sections}
          selectedLectureId={selectedLecture._id}
          onSelect={setSelectedLecture}
          onQuizOpen={handleQuizOpen}
          quizzes={quizzes}
        />
      </div>
    </div>
  )
}
