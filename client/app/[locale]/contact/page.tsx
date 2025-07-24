'use client'

import { Mail, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import { useTranslations } from 'next-intl'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const ContactPage = () => {
  const t = useTranslations('contact') // ✅ Translation hook

  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    recaptchaToken: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }))
      setIsSignedIn(true)
    }
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleCaptcha = (value: string | null) => {
    setForm((prev) => ({ ...prev, recaptchaToken: value || '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await axios.post(
        `${baseURL}/contact`,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          token: form.recaptchaToken,
        },
        user ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      if (res.data.success) {
        toast.success(t('success'))
        setForm({
          name: user?.name || '',
          email: user?.email || '',
          message: '',
          recaptchaToken: '',
        })
      } else {
        toast.error(res.data.message || t('error'))
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Network error. Please check your connection.'

      if (message.toLowerCase().includes('captcha')) {
        toast.error(t('captchaError'))
      } else {
        toast.error(`😞 ${message}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-12'>
      <h1 className='text-4xl font-bold text-center text-indigo-700 mb-4'>
        {t('title')}
      </h1>
      <p className='text-center text-gray-600 mb-12'>{t('description')}</p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-xl rounded-2xl p-8 border'>
        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Mail className='text-indigo-600' />
            <span>{t('contactEmail')}</span>
          </div>
          <div className='flex items-center gap-4'>
            <Phone className='text-indigo-600' />
            <span>{t('phone')}</span>
          </div>
          <div className='flex items-center gap-4'>
            <MapPin className='text-indigo-600' />
            <span>{t('address')}</span>
          </div>
          <p className='text-gray-500 mt-6'>{t('responseTime')}</p>
        </div>

        <form className='space-y-4' onSubmit={handleSubmit}>
          {!isSignedIn && (
            <>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  {t('name')}
                </label>
                <input
                  type='text'
                  id='name'
                  value={form.name}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                  placeholder={t('name')}
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  {t('email')}
                </label>
                <input
                  type='email'
                  id='email'
                  value={form.email}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                  placeholder={t('email')}
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-700'
            >
              {t('message')}
            </label>
            <textarea
              id='message'
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder={t('messagePlaceholder')}
            />
          </div>

          {!isSignedIn && (
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleCaptcha}
              size='normal'
            />
          )}

          <button
            type='submit'
            disabled={submitting}
            className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50'
          >
            {submitting ? t('sending') : t('send')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
