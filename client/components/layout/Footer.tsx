'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className='bg-gray-900 text-gray-300 py-12' data-aos='fade-up'>
      <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div>
          <h3 className='text-2xl font-bold text-white mb-3'>
            Course<span className='text-purple-400'>App</span>
          </h3>
          <p className='text-sm'>
            Learn from industry experts and upgrade your skills at your pace.
          </p>
        </div>

        <div>
          <h4 className='font-semibold text-white mb-3'>Explore</h4>
          <ul className='space-y-2 text-sm'>
            {['Courses', 'Categories', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className='hover:text-white'
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='font-semibold text-white mb-3'>Support</h4>
          <ul className='space-y-2 text-sm'>
            {['FAQ', 'Help-Center', 'Terms-Conditions', 'Privacy-Policy'].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className='hover:text-white'
                  >
                    {item
                      .replace('Terms-Conditions', 'Terms & Conditions')
                      .replace('Help-Center', 'Help Center')}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h4 className='font-semibold text-white mb-3'>Newsletter</h4>
          <p className='text-sm mb-3'>Stay updated with our latest offers</p>
          <form className='flex flex-col'>
            <input
              type='email'
              placeholder='Your email'
              className='mb-3 px-3 py-2 rounded-t sm:rounded-l sm:rounded-tr-none bg-gray-800 text-white focus:outline-none'
            />
            <button
              type='submit'
              className='bg-indigo-600 px-2 py-3 sm:py-0 sm:rounded-r sm:rounded-l-none text-white hover:bg-indigo-700 transition'
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className='mt-10 text-center text-sm text-gray-500'>
        © {year ? year : ''} CourseApp. All rights reserved.
      </div>
    </footer>
  )
}
