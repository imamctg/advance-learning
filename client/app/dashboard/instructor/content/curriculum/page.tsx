// ✅ Curriculum Page: app/dashboard/instructor/content/curriculum/page.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
// import { toast } from 'react-toastify'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

interface Section {
  _id: string
  title: string
}

export default function CurriculumPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [newSection, setNewSection] = useState('')

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true)
        const courseId = 'your-course-id' // Replace with dynamic courseId from context/router
        const res = await axios.get(`/api/courses/${courseId}/sections`)
        setSections(res.data)
      } catch (err) {
        toast.error('Failed to load sections')
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  const handleAddSection = async () => {
    if (!newSection) return toast.error('Section title required')
    try {
      const courseId = 'your-course-id'
      const res = await axios.post(`/api/courses/${courseId}/sections`, {
        title: newSection,
      })
      setSections([...sections, res.data])
      setNewSection('')
      toast.success('Section added')
    } catch (err) {
      toast.error('Failed to add section')
    }
  }

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-semibold'>📚 Curriculum</h2>

      <div className='bg-white p-4 rounded shadow'>
        <div className='flex flex-col md:flex-row gap-4 items-center'>
          <input
            type='text'
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            placeholder='New section title'
            className='border p-2 rounded flex-1'
          />
          <button
            onClick={handleAddSection}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2'
          >
            <FaPlus /> Add Section
          </button>
        </div>
      </div>

      <div className='bg-white p-4 rounded shadow'>
        <h3 className='font-medium mb-2'>Section List</h3>
        <ul className='space-y-2'>
          {loading ? (
            <p>Loading...</p>
          ) : sections.length ? (
            sections.map((section) => (
              <li
                key={section._id}
                className='flex justify-between items-center border p-2 rounded'
              >
                <span>{section.title}</span>
                <div className='flex gap-3 text-blue-600'>
                  <FaEdit className='cursor-pointer hover:text-blue-800' />
                  <FaTrash className='cursor-pointer hover:text-red-600' />
                </div>
              </li>
            ))
          ) : (
            <p className='text-gray-500'>No sections found</p>
          )}
        </ul>
      </div>
    </div>
  )
}
