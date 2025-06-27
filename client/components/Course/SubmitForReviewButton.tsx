// src/components/course/SubmitForReviewButton.tsx
// import { submitForReview } from '@/services/courseService';
import { submitForReview } from 'app/services/courseService'
import { useRouter } from 'next/router'

const SubmitForReviewButton = ({ courseId }: { courseId: string }) => {
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      await submitForReview(courseId)
      router.reload() // Or update state to reflect the new status
      alert('Course submitted for review successfully!')
    } catch (error) {
      alert('Failed to submit course for review')
    }
  }

  return (
    <button
      onClick={handleSubmit}
      className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
    >
      Submit for Review
    </button>
  )
}
