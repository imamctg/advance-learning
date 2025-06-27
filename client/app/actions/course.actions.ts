import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'

export async function fetchPendingReviews() {
  const token = useSelector((state: RootState) => state.auth.token)

  try {
    const response = await fetch(
      'http://localhost:5000/api/courses/pending-reviews',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Next.js 13/14-এ cache এবং revalidate অপশন ব্যবহার করুন
        cache: 'no-store', // এটি ডাটা সর্বদা ফ্রেশ করতে সাহায্য করে
        // next: { revalidate: 3600 } // প্রতি ঘন্টায় ডাটা revalidate করবে (ঐচ্ছিক)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch pending reviews')
    }

    const courses = await response.json()
    return courses
  } catch (error) {
    console.error('Error fetching pending reviews:', error)
    return []
  }
}
