// src/components/course/PublishCourseButton.tsx
// import { publishCourse } from '@/services/courseService';
import { publishCourse } from 'app/services/courseService'
import { useRouter } from 'next/router'

const PublishCourseButton = ({ courseId }: { courseId: string }) => {
  const router = useRouter()

  const handlePublish = async () => {
    try {
      await publishCourse(courseId)
      router.reload()
      alert('Course published successfully!')
    } catch (error) {
      alert('Failed to publish course')
    }
  }

  return (
    <button
      onClick={handlePublish}
      className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
    >
      Publish Course
    </button>
  )
}
