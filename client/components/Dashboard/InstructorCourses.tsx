'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { RootState } from 'features/redux/store'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

const InstructorCourses = () => {
  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user, 'user')
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id || !token) return
      setLoading(true)
      try {
        // const baseUrl =
        //   process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        const res = await axios.get(
          `http://localhost:5000/api/instructor/${user.id}/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res.data.courses, '✅ Fetched Courses')
        setCourses(res.data.courses || [])
        toast.success('Courses loaded successfully!')
      } catch (error) {
        console.error('❌ Error fetching courses:', error)
        toast.error('Failed to load courses.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [user?._id, token])

  useEffect(() => {
    let filtered = [...courses]
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }
    setFilteredCourses(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, courses])

  if (!user || user.role !== 'instructor')
    return <div className='text-red-500 p-6'>Unauthorized Access</div>

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h2 className='text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2'>
        🎓 My Courses
      </h2>

      {/* Search & Filter */}
      <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <Search className='w-5 h-5 text-gray-500' />
          <input
            type='text'
            placeholder='Search by title...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400'
        >
          <option value=''>All Status</option>
          <option value='Published'>Published</option>
          <option value='Draft'>Draft</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className='flex justify-center items-center h-48'>
          <Loader2 className='animate-spin w-8 h-8 text-indigo-500' />
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div className='text-center text-gray-500 mt-10'>
          কোনো কোর্স পাওয়া যায়নি।
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {paginatedCourses.map((course) => (
              <div
                key={course._id}
                className='bg-white rounded-2xl shadow hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden border border-gray-200'
              >
                <div className='h-44 bg-gray-100 relative'>
                  <video
                    src={course.introVideo || '/default-preview.mp4'}
                    className='w-full h-full object-cover'
                    muted
                    preload='metadata'
                  />
                  {course.status === 'Draft' && (
                    <span className='absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full'>
                      Draft
                    </span>
                  )}
                </div>
                <div className='p-4'>
                  <h4 className='text-lg font-semibold text-gray-800 line-clamp-2'>
                    {course.title}
                  </h4>
                  <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
                    {course.description}
                  </p>

                  <div className='flex justify-between text-sm text-gray-600 mt-3'>
                    <span>👥 {course.enrolledUsers?.length || 0} Students</span>
                    <span>⭐ {course.rating || 0}</span>
                  </div>

                  <div className='flex justify-end gap-2 mt-4'>
                    <Link
                      href={`/dashboard/instructor/my-courses/${course._id}`}
                    >
                      <button className='bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition'>
                        ✏️ Edit
                      </button>
                    </Link>
                    <Link href={`/learn/${course._id}`}>
                      <button className='bg-gray-200 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-300 transition'>
                        🔍 Preview
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className='flex justify-center items-center gap-2 mt-8'>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className='px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded disabled:opacity-50'
            >
              Prev
            </button>
            <span className='text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default InstructorCourses
