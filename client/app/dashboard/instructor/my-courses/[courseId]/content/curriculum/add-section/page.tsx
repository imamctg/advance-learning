'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { Card, CardContent } from 'components/ui/card'
import { Textarea } from 'components/ui/textarea'
import { Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface Lecture {
  title: string
  videoUrl: string
}

export default function AddSectionPage() {
  const { courseId } = useParams()
  const { t } = useTranslation()
  const router = useRouter()

  const [sectionTitle, setSectionTitle] = useState('')
  const [lectures, setLectures] = useState<Lecture[]>([
    { title: '', videoUrl: '' },
  ])
  const [loading, setLoading] = useState(false)

  const handleAddLecture = () => {
    setLectures([...lectures, { title: '', videoUrl: '' }])
  }

  const handleRemoveLecture = (index: number) => {
    const updatedLectures = lectures.filter((_, i) => i !== index)
    setLectures(updatedLectures)
  }

  const handleLectureChange = (
    index: number,
    field: keyof Lecture,
    value: string
  ) => {
    const updated = [...lectures]
    updated[index][field] = value
    setLectures(updated)
  }

  const handleSubmit = async () => {
    if (!sectionTitle.trim()) {
      return toast.error(t('sectionTitleRequired'))
    }

    if (lectures.some((lec) => !lec.title.trim() || !lec.videoUrl.trim())) {
      return toast.error(t('allLectureFieldsRequired'))
    }

    setLoading(true)
    try {
      // Replace with real API call
      await new Promise((res) => setTimeout(res, 1000))
      toast.success(t('sectionAddedSuccessfully'))
      router.push(`/dashboard/instructor/my-courses/${courseId}`)
    } catch (error) {
      toast.error(t('somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6 space-y-6'>
      <Button variant='ghost' onClick={() => router.back()}>
        <ArrowLeft className='w-4 h-4 mr-2' />
        {t('back')}
      </Button>

      <h1 className='text-2xl font-bold'>{t('addNewSection')}</h1>

      <Card>
        <CardContent className='space-y-4 p-6'>
          <div>
            <label className='block font-semibold mb-1'>
              {t('sectionTitle')}
            </label>
            <Input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder={t('enterSectionTitle')}
            />
          </div>

          <div className='space-y-4'>
            <label className='block font-semibold'>{t('lectures')}</label>
            {lectures.map((lecture, index) => (
              <div
                key={index}
                className='border p-4 rounded-lg space-y-2 relative bg-gray-50'
              >
                <div>
                  <label className='block text-sm'>{t('lectureTitle')}</label>
                  <Input
                    value={lecture.title}
                    onChange={(e) =>
                      handleLectureChange(index, 'title', e.target.value)
                    }
                    placeholder={t('enterLectureTitle')}
                  />
                </div>
                <div>
                  <label className='block text-sm'>{t('videoUrl')}</label>
                  <Input
                    value={lecture.videoUrl}
                    onChange={(e) =>
                      handleLectureChange(index, 'videoUrl', e.target.value)
                    }
                    placeholder={t('enterVideoUrl')}
                  />
                </div>
                <Button
                  type='button'
                  size='sm'
                  variant='destructive'
                  className='absolute top-2 right-2'
                  onClick={() => handleRemoveLecture(index)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))}
            <Button type='button' onClick={handleAddLecture} variant='outline'>
              <Plus className='w-4 h-4 mr-2' />
              {t('addLecture')}
            </Button>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className='w-full'>
            {loading && <Loader2 className='animate-spin w-4 h-4 mr-2' />}
            {t('saveSection')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
