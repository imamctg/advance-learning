'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const [year, setYear] = useState<number | null>(null)
  const t = useTranslations('footer')

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className='bg-gray-900 text-gray-300 py-12' data-aos='fade-up'>
      <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Brand */}
        <div>
          <h3 className='text-2xl font-bold text-white mb-3'>
            {t('brand')}
            <span className='text-purple-400'>App</span>
          </h3>
          <p className='text-sm'>{t('description')}</p>
        </div>

        {/* Explore */}
        <div>
          <h4 className='font-semibold text-white mb-3'>{t('exploreTitle')}</h4>
          <ul className='space-y-2 text-sm'>
            {[
              { key: 'courses', path: '/courses' },
              { key: 'categories', path: '/categories' },
              { key: 'about', path: '/about' },
              { key: 'contact', path: '/contact' },
            ].map(({ key, path }) => (
              <li key={key}>
                <Link href={path} className='hover:text-white'>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className='font-semibold text-white mb-3'>{t('supportTitle')}</h4>
          <ul className='space-y-2 text-sm'>
            {[
              { key: 'faq', path: '/faq' },
              { key: 'help', path: '/help-center' },
              { key: 'terms', path: '/terms-conditions' },
              { key: 'privacy', path: '/privacy-policy' },
            ].map(({ key, path }) => (
              <li key={key}>
                <Link href={path} className='hover:text-white'>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className='font-semibold text-white mb-3'>
            {t('newsletterTitle')}
          </h4>
          <p className='text-sm mb-3'>{t('newsletterDesc')}</p>
          <form className='flex flex-col'>
            <input
              type='email'
              placeholder={t('emailPlaceholder')}
              className='mb-3 px-3 py-2 rounded-t sm:rounded-l sm:rounded-tr-none bg-gray-800 text-white focus:outline-none'
            />
            <button
              type='submit'
              className='bg-indigo-600 px-2 py-3 sm:py-0 sm:rounded-r sm:rounded-l-none text-white hover:bg-indigo-700 transition'
            >
              {t('subscribe')}
            </button>
          </form>
        </div>
      </div>

      <div className='mt-10 text-center text-sm text-gray-500'>
        © {year || ''} CourseApp. {t('copyright')}
      </div>
    </footer>
  )
}
