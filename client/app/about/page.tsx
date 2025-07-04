// app/about/page.tsx

import { Metadata } from 'next'
import { Target, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Advanced Learning',
  description:
    'Learn more about our mission, vision, and the team behind Advanced Learning.',
}

const AboutPage = () => {
  return (
    <div className='bg-gradient-to-b from-white via-blue-50 to-white min-h-screen py-16 px-4'>
      <div className='max-w-5xl mx-auto text-center'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-blue-700 mb-4'>
          About Advanced Learning
        </h1>
        <p className='text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
          Welcome to{' '}
          <span className='font-semibold text-blue-600'>Advanced Learning</span>
          , your premier destination for high-quality online education. Our
          mission is to make learning engaging, accessible, and effective —
          powered by expert instructors and cutting-edge technology.
        </p>
      </div>

      <div className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
        {/* Mission */}
        <div className='bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-600'>
          <div className='flex items-center mb-4'>
            <Target className='text-blue-600 w-6 h-6 mr-2' />
            <h2 className='text-2xl font-semibold text-gray-800'>
              Our Mission
            </h2>
          </div>
          <p className='text-gray-700 leading-relaxed'>
            To make education accessible, affordable, and enjoyable for learners
            around the globe. We focus on practical, skill-based learning that
            helps individuals thrive in today’s digital world.
          </p>
        </div>

        {/* Vision */}
        <div className='bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-600'>
          <div className='flex items-center mb-4'>
            <Eye className='text-blue-600 w-6 h-6 mr-2' />
            <h2 className='text-2xl font-semibold text-gray-800'>Our Vision</h2>
          </div>
          <p className='text-gray-700 leading-relaxed'>
            To become a global leader in online education by continuously
            innovating our learning experiences, and helping people achieve
            their personal and professional goals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
