'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import {
  FaUserGraduate,
  FaEnvelope,
  FaBookOpen,
  FaSearch,
  FaPaperPlane,
} from 'react-icons/fa'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'

interface Student {
  _id: string
  name: string
  email: string
  enrolledCourses: {
    _id: string
    title: string
  }[]
  joinedAt: string
}

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('/api/instructor/students')
        setStudents(res.data)
        setFilteredStudents(res.data)
      } catch (error) {
        console.error(error)
        toast.error('Failed to load students')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(term.toLowerCase()) ||
        s.email.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredStudents(filtered)
  }

  const handleSendMessage = async () => {
    if (!selectedStudent || !messageText.trim()) return
    try {
      await axios.post('/api/instructor/message', {
        studentId: selectedStudent._id,
        message: messageText,
      })
      toast.success('Message sent')
      setMessageText('')
      setSelectedStudent(null)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message')
    }
  }

  return (
    <div className='p-6'>
      <h2 className='text-3xl font-bold mb-6 flex items-center gap-2'>
        <FaUserGraduate className='text-blue-600' /> Enrolled Students
      </h2>

      {/* Search Bar */}
      <div className='flex items-center gap-2 mb-6'>
        <Input
          type='text'
          placeholder='Search by name or email'
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className='w-full max-w-md'
        />
        <FaSearch className='text-gray-500' />
      </div>

      {/* Student Cards */}
      {loading ? (
        <p className='text-gray-600'>Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <div className='bg-white p-6 rounded shadow text-center text-gray-500'>
          No students found.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className='bg-white p-5 rounded-lg shadow hover:shadow-md border border-gray-100 transition'
            >
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <FaUserGraduate className='text-gray-600' /> {student.name}
              </h3>
              <p className='text-sm text-gray-600 flex items-center gap-1 mt-1'>
                <FaEnvelope className='text-gray-500' /> {student.email}
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                Joined: {new Date(student.joinedAt).toLocaleDateString()}
              </p>

              <div className='mt-4'>
                <h4 className='font-medium text-sm mb-1 flex items-center gap-2'>
                  <FaBookOpen className='text-blue-500' /> Courses:
                </h4>
                <ul className='list-disc ml-5 text-sm text-gray-700 space-y-1'>
                  {student.enrolledCourses.map((course) => (
                    <li key={course._id}>{course.title}</li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => setSelectedStudent(student)}
                className='mt-4 text-sm bg-blue-600 hover:bg-blue-700'
              >
                <FaPaperPlane className='mr-2' /> Message
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {selectedStudent && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
            <h3 className='text-lg font-bold mb-2'>
              Send Message to {selectedStudent.name}
            </h3>
            <textarea
              className='w-full border rounded p-2 mb-4 min-h-[100px]'
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder='Write your message...'
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setSelectedStudent(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <FaPaperPlane className='mr-1' /> Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
