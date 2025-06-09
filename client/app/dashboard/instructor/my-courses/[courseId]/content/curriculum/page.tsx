'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from 'components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CurriculumPage() {
  const { courseId } = useParams()
  const router = useRouter()

  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get(`/api/courses/${courseId}/sections`)
        setSections(res.data)
      } catch (err) {
        console.error('Failed to load sections', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [courseId])

  const deleteSection = async (sectionId: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/sections/${sectionId}`)
      setSections((prev) => prev.filter((s) => s._id !== sectionId))
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Course Curriculum</h1>
        <Link href={`/dashboard/instructor/my-courses/${courseId}/add-section`}>
          <Button variant='default'>
            <Plus className='w-4 h-4 mr-2' />
            Add Section
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='space-y-4'>
          {sections.length === 0 ? (
            <p className='text-gray-500'>No sections added yet.</p>
          ) : (
            sections.map((section) => (
              <div
                key={section._id}
                className='border rounded-md p-4 bg-white shadow-sm'
              >
                <div className='flex justify-between items-center mb-2'>
                  <h2 className='text-lg font-semibold'>{section.title}</h2>
                  <div className='flex space-x-2'>
                    <Link
                      href={`/dashboard/instructor/my-courses/${courseId}/sections/${section._id}/add-lecture`}
                    >
                      <Button size='sm' variant='outline'>
                        Add Lecture
                      </Button>
                    </Link>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => deleteSection(section._id)}
                    >
                      <Trash2 className='w-4 h-4 text-red-500' />
                    </Button>
                  </div>
                </div>

                {section.lectures && section.lectures.length > 0 ? (
                  <ul className='ml-4 list-disc text-sm text-gray-700 space-y-1'>
                    {section.lectures.map((lecture: any) => (
                      <li key={lecture._id}>{lecture.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className='ml-4 text-sm text-gray-500'>
                    No lectures in this section.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
