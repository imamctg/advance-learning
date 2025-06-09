// app/about/page.tsx

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Advanced Learning',
  description:
    'Learn more about our mission, vision, and the team behind Advanced Learning.',
}

const AboutPage = () => {
  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold text-center mb-6'>About Us</h1>
      <p className='text-lg text-gray-700 leading-relaxed'>
        Welcome to <strong>Advanced Learning</strong>, your number one platform
        for high-quality online courses. We are dedicated to delivering the best
        learning experience, with a focus on modern technology, expert
        instructors, and interactive course design.
      </p>

      <div className='mt-10'>
        <h2 className='text-2xl font-semibold mb-3'>Our Mission</h2>
        <p className='text-gray-700'>
          To make education accessible, affordable, and enjoyable for learners
          worldwide. We aim to empower individuals by providing practical,
          skill-based learning.
        </p>
      </div>

      <div className='mt-10'>
        <h2 className='text-2xl font-semibold mb-3'>Our Vision</h2>
        <p className='text-gray-700'>
          To be a global leader in online education by delivering top-notch
          learning experiences and helping people achieve their personal and
          professional goals.
        </p>
      </div>
    </div>
  )
}

export default AboutPage
