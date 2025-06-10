'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from 'components/ui/button'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Textarea } from 'components/ui/textarea'
import { Input } from 'components/ui/input'
import { RootState } from 'features/redux/store'
import { useSelector } from 'react-redux'

interface AddLectureFormProps {
  courseId: string
  sectionId: string
}

export default function AddLectureForm({
  courseId,
  sectionId,
}: AddLectureFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isFreePreview, setIsFreePreview] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !videoFile) {
      return toast.error(t('allFieldsRequired'))
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('video', videoFile)
    formData.append('isFreePreview', String(isFreePreview))

    try {
      setLoading(true)

      const res = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/sections/${sectionId}/lectures`,
        formData,
        {
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success(t('lectureAddedSuccessfully'))
      setTitle('')
      setVideoFile(null)
      setDescription('')
      setIsFreePreview(false)

      router.refresh()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white p-6 rounded shadow'
    >
      {/* Title */}
      <div>
        <label className='block font-semibold mb-1'>{t('lectureTitle')}</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('enterLectureTitle')}
          required
        />
      </div>

      {/* Video Upload */}
      <div>
        <label className='block font-semibold mb-1'>{t('uploadVideo')}</label>
        <Input
          type='file'
          accept='video/*'
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className='block font-semibold mb-1'>{t('description')}</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('optionalDescription')}
        />
      </div>

      {/* Free Preview Checkbox */}
      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          checked={isFreePreview}
          onChange={(e) => setIsFreePreview(e.target.checked)}
        />
        <label className='font-medium'>{t('freePreview')}</label>
      </div>

      {/* Submit Button */}
      <Button type='submit' disabled={loading} className='w-full'>
        {loading && <Loader2 className='animate-spin w-4 h-4 mr-2' />}
        {t('addLecture')}
      </Button>
    </form>
  )
}
