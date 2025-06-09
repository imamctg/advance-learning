'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from 'components/ui/button'
import { Upload, Trash2 } from 'lucide-react'
import axios from 'axios'

export default function VideosAndFilesPage() {
  const { courseId } = useParams()
  const [files, setFiles] = useState([])

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await axios.get(`/api/courses/${courseId}/files`)
      setFiles(res.data)
    }
    fetchFiles()
  }, [courseId])

  const handleDelete = async (fileId: string) => {
    await axios.delete(`/api/courses/${courseId}/files/${fileId}`)
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Videos & Files</h1>
      <Button variant='default' className='mb-4'>
        <Upload className='w-4 h-4 mr-2' />
        Upload File
      </Button>
      <ul className='space-y-2'>
        {files.map((file: any) => (
          <li
            key={file.id}
            className='flex justify-between p-3 bg-gray-100 rounded-md'
          >
            <span>{file.name}</span>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => handleDelete(file.id)}
            >
              <Trash2 className='w-4 h-4 text-red-500' />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
