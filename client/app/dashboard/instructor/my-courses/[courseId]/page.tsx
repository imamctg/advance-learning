// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import axios from 'axios'

// const SingleCoursePage = () => {
//   const { courseId } = useParams()
//   const router = useRouter()
//   const [course, setCourse] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     if (courseId) {
//       axios
//         .get(`http://localhost:5000/api/courses/${courseId}`)
//         .then((res) => {
//           setCourse(res.data.data)
//           setLoading(false)
//         })
//         .catch((err) => {
//           setError('Course not found')
//           setLoading(false)
//         })
//     }
//   }, [courseId])

//   if (loading) return <p className='p-8 text-center'>Loading...</p>
//   if (error || !course)
//     return <p className='p-8 text-center text-red-500'>Course not found</p>

//   // ✅ Enroll button handler
//   const handleEnroll = () => {
//     router.push(`/courses/${courseId}/checkout`)
//   }

//   return (
//     <div className='min-h-screen p-8'>
//       <div className='max-w-4xl mx-auto border rounded-lg p-8 shadow-lg'>
//         <h1 className='text-4xl font-bold mb-6'>{course.title}</h1>

//         <img
//           src={course.image || 'https://via.placeholder.com/600x300'}
//           alt={course.title}
//           className='w-full h-64 object-cover rounded mb-6'
//         />

//         <p className='text-gray-700 text-lg mb-4'>{course.description}</p>

//         <p className='text-2xl font-bold text-blue-600 mb-6'>${course.price}</p>

//         <button
//           className='w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded text-lg transition'
//           onClick={handleEnroll}
//         >
//           Enroll Now
//         </button>
//       </div>
//     </div>
//   )
// }

// export default SingleCoursePage

'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import { Card, CardContent } from 'components/ui/card'
import { Edit, Globe, Lock, Loader2, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { t } = useTranslation()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        )
        setCourse(res.data.data)
      } catch (error) {
        console.error('Failed to fetch course:', error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const handlePublishToggle = () => {
    if (!course) return
    setCourse((prev: any) => ({
      ...prev,
      status: prev.status === 'Published' ? 'Draft' : 'Published',
    }))
  }

  const handleDeleteLesson = (sectionIndex: number, lessonIndex: number) => {
    const updatedSections = [...course.sections]
    updatedSections[sectionIndex].lessons.splice(lessonIndex, 1)
    setCourse({ ...course, sections: updatedSections })
  }

  if (loading) {
    return (
      <div className='p-6 flex items-center justify-center'>
        <Loader2 className='animate-spin w-6 h-6 mr-2' />
        {t('loading')}
      </div>
    )
  }
  console.log(course, 'course')
  if (!course) {
    return <div className='p-6 text-red-500'>{t('courseNotFound')}</div>
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>{course.title}</h1>
          <p className='text-gray-600'>{course.description}</p>
          <div className='flex gap-2 flex-wrap'>
            <Badge>{course.level}</Badge>
            <Badge variant='secondary'>{course.language}</Badge>
            {/* <Badge
              variant='secondary'
              className={
                course.status === 'Published' ? 'bg-green-500' : 'bg-yellow-400'
              }
            >
              {t(course.status.toLowerCase())}
            </Badge> */}
          </div>
          <div className='text-sm text-gray-500'>
            ⭐ {course.rating} ({course.reviews} {t('reviews')})
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Link href={`/dashboard/instructor/my-courses/${course.id}/edit`}>
            <Button variant='outline'>
              <Edit className='w-4 h-4 mr-2' />
              {t('edit')}
            </Button>
          </Link>
          <Button variant='outline' onClick={handlePublishToggle}>
            {course.status === 'Published' ? t('unpublish') : t('publish')}
          </Button>
        </div>
      </div>

      {/* <Image
        src={course.thumbnail}
        alt='Course Thumbnail'
        width={800}
        height={400}
        className='rounded-lg border shadow'
      /> */}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardContent className='p-4 space-y-2'>
            <p className='text-gray-500'>{t('price')}</p>
            <p className='text-xl font-semibold'>${course.price}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 space-y-2'>
            <p className='text-gray-500'>{t('enrolled')}</p>
            <p className='text-xl font-semibold'>{course.enrolled} students</p>
          </CardContent>
        </Card>
      </div>

      <div className='bg-white p-6 rounded-2xl shadow border'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>{t('courseContent')}</h2>
          <Button variant='default' size='sm'>
            <Plus className='w-4 h-4 mr-1' />
            {t('addLecture')}
          </Button>
        </div>

        <div className='space-y-6'>
          {course.sections.map((section: any, sIndex: number) => (
            <div key={sIndex} className='space-y-2'>
              <h3 className='font-semibold text-lg'>{section.title}</h3>
              <ul className='space-y-2'>
                {section.lectures.map((lesson: any, lIndex: number) => (
                  <li
                    key={lIndex}
                    className='border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50'
                  >
                    <div>
                      <span>{lesson.title}</span>
                      <span className='text-gray-500 text-sm ml-2'>
                        ({lesson.duration})
                      </span>
                    </div>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDeleteLesson(sIndex, lIndex)}
                    >
                      <Trash2 className='w-4 h-4 text-red-500' />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
