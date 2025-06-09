'use client'

import Link from 'next/link'
import Testimonials from 'components/layout/Testimonials'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
// import ClientLayout from './ClientLayout'

const categories = [
  { name: 'Web Development', icon: '💻' },
  { name: 'Design', icon: '🎨' },
  { name: 'Marketing', icon: '📈' },
  { name: 'Data Science', icon: '📊' },
]

const testimonials = [
  {
    name: 'Imam Hossain',
    comment: 'This platform changed my career. The instructors are amazing!',
    image: '/users/user-1.jpg',
    rating: 5,
  },
  {
    name: 'Ayesha Akter',
    comment: 'I love the flexibility and certificate options.',
    image: '/users/user-2.jpg',
    rating: 4,
  },
]

export default function Homepage() {
  const [courses, setCourses] = useState([])
  // const router = useRouter()

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/courses')
      .then((res) => setCourses(res.data.data))
      .catch((err) => console.error(err))
  }, [])
  return (
    // <ClientLayout>
    <main
      className='bg-white overflow-x-hidden;
'
    >
      {/* HERO */}
      <section
        className='relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4 text-center overflow-hidden'
        data-aos='fade-down'
      >
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-700/20 to-transparent'></div>
        <div className='relative z-10 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>
            Learn From The Best Instructors
          </h1>
          <p className='text-xl mb-6'>
            Explore thousands of online courses and level up your skills.
          </p>
          <Link
            href='/courses'
            className='bg-white text-indigo-700 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition'
          >
            🔍 Browse Courses
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className='py-16 px-6 bg-gray-50' data-aos='fade-up'>
        <h2 className='text-3xl font-bold text-center mb-10'>
          Popular Categories
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto'>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className='bg-white p-6 rounded-md shadow hover:shadow-lg text-center font-semibold border hover:border-indigo-500 transition flex flex-col items-center'
            >
              <span className='text-3xl mb-2'>{cat.icon}</span>
              {cat.name}
            </div>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className='py-16 px-6'>
        <h2 className='text-3xl font-bold text-center mb-10' data-aos='fade-up'>
          Featured Courses
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'>
          {courses.map((course, i) => (
            <div
              key={course.title}
              className='bg-white rounded-md shadow hover:shadow-lg transition border'
              data-aos='flip-left'
              data-aos-delay={i * 100}
            >
              <img
                src={course.thumbnail || 'https://via.placeholder.com/400x250'}
                alt={course.title}
                className='w-full h-48 object-cover rounded-t-md'
              />
              <div className='p-4'>
                <h3 className='text-xl font-bold'>{course.title}</h3>
                <p className='text-gray-600 mb-2'>{course.instructor}</p>
                <p className='text-indigo-700 font-semibold'>${course.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className='py-16 px-6 bg-gray-100'>
        <h2 className='text-3xl font-bold text-center mb-10' data-aos='fade-up'>
          Why Choose CourseApp?
        </h2>
        <div className='w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          <div data-aos='fade-right'>
            <span className='text-4xl'>🎓</span>
            <h4 className='text-lg font-bold mt-2'>Expert Instructors</h4>
            <p className='text-gray-600'>Learn from industry experts</p>
          </div>
          <div data-aos='fade-up'>
            <span className='text-4xl'>⏱️</span>
            <h4 className='text-lg font-bold mt-2'>Flexible Learning</h4>
            <p className='text-gray-600'>Study anytime, anywhere</p>
          </div>
          <div data-aos='fade-left'>
            <span className='text-4xl'>🏆</span>
            <h4 className='text-lg font-bold mt-2'>Certificates</h4>
            <p className='text-gray-600'>Get certified after completion</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className='py-16 px-6 bg-white'>
        <h2 className='text-3xl font-bold text-center mb-10' data-aos='fade-up'>
          What Our Students Say
        </h2>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6'>
          {testimonials.map((t, i) => (
            <div
              key={i}
              className='bg-gray-50 p-6 rounded-md shadow flex flex-col md:flex-row gap-4 items-center'
              data-aos='fade-up'
              data-aos-delay={i * 100}
            >
              <img
                src={t.image}
                alt={t.name}
                className='w-16 h-16 rounded-full object-cover border-2 border-indigo-500'
              />
              <div>
                <p className='text-gray-700 italic'>" {t.comment} "</p>
                <div className='flex items-center mt-2 gap-1 text-yellow-500'>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill='currentColor' />
                  ))}
                </div>
                <p className='text-sm text-gray-500 mt-1'>— {t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className='py-16 px-6 text-center bg-indigo-600 text-white'
        data-aos='zoom-in-up'
      >
        <h2 className='text-3xl font-bold mb-4'>Ready to Start Learning?</h2>
        <p className='mb-6'>Join thousands of learners today!</p>
        <Link
          href='/auth/register'
          className='bg-white text-indigo-700 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition'
        >
          🚀 Get Started
        </Link>
      </section>
    </main>
    // </ClientLayout>
  )
}
