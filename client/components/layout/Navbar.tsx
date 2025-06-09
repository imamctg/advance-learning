'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaBars, FaThLarge, FaTimes } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from 'features/redux/store'
import { loginSuccess, logout } from 'features/auth/redux/authSlice'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const pathname = usePathname()
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Restore user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.user && parsed.token) {
        dispatch(loginSuccess(parsed))
      }
    }
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/auth/login')
  }

  // 🔥 Sidebar toggle (for dashboard)
  const handleSidebarToggle = () => {
    const event = new CustomEvent('toggleDashboardSidebar')
    window.dispatchEvent(event)
  }

  return (
    <header className='bg-white shadow sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative'>
        {user && isDashboardPage && (
          <button
            key='dashboard-toggle'
            onClick={handleSidebarToggle}
            className='md:hidden text-xl text-indigo-600'
            aria-label='Toggle Dashboard Sidebar'
          >
            <FaThLarge />
          </button>
        )}
        {/* Center: Logo */}
        <Link
          href='/'
          className='absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-indigo-600 md:static md:translate-x-0 md:left-auto'
        >
          Course<span className='text-purple-600'>App</span>
        </Link>

        {/* Right: Navbar Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='md:hidden text-xl text-indigo-600'
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <nav className='hidden md:flex space-x-6 font-medium'>
          <Link href='/' className='hover:text-indigo-600'>
            Home
          </Link>
          <Link href='/courses' className='hover:text-indigo-600'>
            Courses
          </Link>
          <Link href='/about' className='hover:text-indigo-600'>
            About
          </Link>
          <Link href='/contact' className='hover:text-indigo-600'>
            Contact
          </Link>
          {/* <Link
            href='/become-instructor'
            className='text-green-700 font-semibold hover:underline'
          >
            Become Instructor
          </Link> */}

          <Link href='/auth/register?role=instructor'>Become Instructor</Link>
          {user && (
            <Link
              href='/dashboard/instructor'
              className='text-indigo-600 hover:underline font-semibold'
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Right Side Buttons */}
        <div className='hidden md:flex items-center gap-4'>
          {!user ? (
            <>
              <Link
                href='/auth/login'
                className='text-indigo-600 hover:underline'
              >
                Login
              </Link>
              <Link
                href='/auth/register?role=student'
                className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition'
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className='relative group'>
              <img
                src={user.profileImage || '/default-avatar.png'}
                alt='Profile'
                className='w-10 h-10 rounded-full border cursor-pointer'
              />
              <div className='absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                <div className='px-4 py-2 font-bold text-indigo-700'>
                  {user.name}
                </div>
                <div className='px-4 text-sm text-gray-500'>{user.email}</div>
                <hr className='my-2' />
                <Link
                  href='/dashboard/user/my-courses'
                  className='block px-4 py-2 hover:bg-gray-100'
                >
                  🎓 My Courses
                </Link>
                <Link
                  href='/dashboard/user/messages'
                  className='block px-4 py-2 hover:bg-gray-100'
                >
                  💬 Messages
                </Link>
                <Link
                  href='/dashboard/payment-methods'
                  className='block px-4 py-2 hover:bg-gray-100'
                >
                  💳 Payment Methods
                </Link>
                <Link
                  href='/dashboard/purchase-history'
                  className='block px-4 py-2 hover:bg-gray-100'
                >
                  📜 Purchase History
                </Link>
                <Link
                  href='/dashboard/user/account-settings'
                  className='block px-4 py-2 hover:bg-gray-100'
                >
                  ⚙️ Account Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100'
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className='md:hidden px-4 pb-4 space-y-2 text-center bg-white shadow'>
          {['Home', 'Courses', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className='block hover:text-indigo-600'
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link
            href='/become-instructor'
            className='block text-green-700 font-semibold'
            onClick={() => setMenuOpen(false)}
          >
            Become Instructor
          </Link>
          {user && (
            <Link
              href='/dashboard/user'
              className='block text-indigo-600 font-semibold'
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {!user ? (
            <>
              <Link
                href='/auth/login'
                className='block text-indigo-600'
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href='/auth/register'
                className='block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700'
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href='/dashboard/user/my-courses'
                className='block'
                onClick={() => setMenuOpen(false)}
              >
                🎓 My Courses
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setMenuOpen(false)
                }}
                className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100'
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
