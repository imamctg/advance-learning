'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'

interface Lecture {
  title: string
  videoUrl: string
  isFreePreview: boolean
  file?: File
  duration?: number
  description?: string
  resourceFile?: File
}

interface Section {
  title: string
  lectures: Lecture[]
}

const CreateCoursePage = () => {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  // const [instructor, setInstructor] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [introVideo, setIntroVideo] = useState<File | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user, 'instructor create page')
  const instructorId = user?.id

  console.log(instructorId, 'instructorId')
  const token = useSelector((state: RootState) => state.auth.token)
  console.log(token)
  const addSection = () => {
    setSections([...sections, { title: '', lectures: [] }])
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const updateSectionTitle = (index: number, title: string) => {
    const updated = [...sections]
    updated[index].title = title
    setSections(updated)
  }

  const addLecture = (sectionIndex: number) => {
    const updated = [...sections]
    updated[sectionIndex].lectures.push({
      title: '',
      videoUrl: '',
      isFreePreview: false,
      duration: 0,
      description: '',
      resourceFile: null,
    })
    setSections(updated)
  }

  const updateLecture = (
    sectionIndex: number,
    lectureIndex: number,
    field: keyof Lecture,
    value: any
  ) => {
    const updated = [...sections]
    const lecture = updated[sectionIndex].lectures[lectureIndex]

    if (field === 'title' || field === 'videoUrl') {
      lecture[field] = value as string
    } else if (field === 'description') {
      lecture[field] = value as string
    } else if (field === 'duration') {
      lecture[field] = value as number
    } else if (field === 'isFreePreview') {
      lecture[field] = value as boolean
    } else if (field === 'file') {
      lecture[field] = value as File
    }

    setSections(updated)
  }

  const removeLecture = (sectionIndex: number, lectureIndex: number) => {
    const updated = [...sections]
    updated[sectionIndex].lectures.splice(lectureIndex, 1)
    setSections(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!thumbnail || !introVideo) {
      alert('Please upload thumbnail and intro video.')
      return
    }

    try {
      const formData = new FormData()

      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('instructor', instructorId)

      formData.append('thumbnail', thumbnail)
      formData.append('introVideo', introVideo)

      // Add lecture files and metadata
      formData.append('sections', JSON.stringify(sections)) // lecture titles, isFreePreview flags

      // Append each lecture file separately
      sections.forEach((section, sIndex) => {
        section.lectures.forEach((lecture, lIndex) => {
          if (lecture.file) {
            formData.append(`lectureFile_${sIndex}_${lIndex}`, lecture.file)
          }
          if (lecture.resourceFile) {
            console.log(lecture.resourceFile)
            formData.append(
              `lectureResource_${sIndex}_${lIndex}`,
              lecture.resourceFile
            )
          }
        })
      })

      const res = await axios.post(
        'http://localhost:5000/api/courses',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      router.push('/dashboard/admin/courses')
    } catch (error: any) {
      console.error(
        'Upload or creation failed:',
        error.response?.data || error.message
      )
    }
  }

  return (
    <div className='max-w-4xl mx-auto mt-4 p-6 border rounded-lg shadow space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Create a New Course</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <label className='font-semibold'>
          Upload Course Thumbnail (Image){' '}
        </label>
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          required
        />
        <br />
        <label className='font-semibold mt-2'>Upload Intro Video </label>
        <input
          type='file'
          accept='video/*'
          onChange={(e) => setIntroVideo(e.target.files?.[0] || null)}
          required
        />
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className='w-full border px-3 py-2 rounded'
        />
        <textarea
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className='w-full border px-3 py-2 rounded'
        />
        <input
          type='number'
          placeholder='Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className='w-full border px-3 py-2 rounded'
        />
        {/* <input
          type='text'
          placeholder='Instructor'
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          required
          className='w-full border px-3 py-2 rounded'
        /> */}

        <div>
          <h3 className='text-lg font-semibold mb-2'>Course Sections</h3>
          {sections.map((section, sIndex) => (
            <div key={sIndex} className='border p-3 mb-4 rounded space-y-2'>
              <div className='flex justify-between'>
                <input
                  type='text'
                  placeholder='Section Title'
                  value={section.title}
                  onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                  className='w-full border px-3 py-2 rounded mb-2'
                />
                <button
                  type='button'
                  onClick={() => removeSection(sIndex)}
                  className='text-red-600 ml-2'
                >
                  🗑️
                </button>
              </div>

              {section.lectures.map((lecture, lIndex) => (
                <div key={lIndex} className='border p-2 rounded mb-2'>
                  <input
                    type='text'
                    placeholder='Lecture Title'
                    value={lecture.title}
                    onChange={(e) =>
                      updateLecture(sIndex, lIndex, 'title', e.target.value)
                    }
                    className='w-full border px-2 py-1 rounded'
                  />

                  <textarea
                    placeholder='Lecture Description (optional)'
                    value={lecture.description ?? ''}
                    onChange={(e) =>
                      updateLecture(
                        sIndex,
                        lIndex,
                        'description',
                        e.target.value
                      )
                    }
                    className='w-full border px-2 py-1 rounded'
                  />

                  <input
                    type='number'
                    placeholder='Duration (in minutes)'
                    value={lecture.duration?.toString() ?? ''}
                    onChange={(e) =>
                      updateLecture(
                        sIndex,
                        lIndex,
                        'duration',
                        parseInt(e.target.value) || 0
                      )
                    }
                    className='w-full border px-2 py-1 rounded'
                  />

                  <label className='block'>Upload Lecture Video</label>
                  <input
                    type='file'
                    accept='video/*'
                    onChange={(e) =>
                      updateLecture(sIndex, lIndex, 'file', e.target.files?.[0])
                    }
                    className='w-full border px-2 py-1 rounded'
                  />

                  <label className='block'>
                    Upload Resource File (optional)
                  </label>
                  <input
                    type='file'
                    onChange={(e) =>
                      updateLecture(
                        sIndex,
                        lIndex,
                        'resourceFile',
                        e.target.files?.[0]
                      )
                    }
                    className='w-full border px-2 py-1 rounded'
                  />

                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={lecture.isFreePreview}
                      onChange={(e) =>
                        updateLecture(
                          sIndex,
                          lIndex,
                          'isFreePreview',
                          e.target.checked
                        )
                      }
                    />
                    <span className='ml-2'>Free Preview</span>
                  </label>

                  <button
                    type='button'
                    onClick={() => removeLecture(sIndex, lIndex)}
                    className='text-red-500'
                  >
                    Remove Lecture
                  </button>
                </div>
              ))}
              <button
                type='button'
                onClick={() => addLecture(sIndex)}
                className='bg-gray-200 px-3 py-1 rounded hover:bg-gray-300'
              >
                ➕ Add Lecture
              </button>
            </div>
          ))}

          <button
            type='button'
            onClick={addSection}
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          >
            ➕ Add Section
          </button>
        </div>

        <button
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
        >
          ✅ Create Course
        </button>
      </form>
    </div>
  )
}

export default CreateCoursePage
