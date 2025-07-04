'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaBars, FaThLarge, FaTimes } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from 'features/redux/store'
import { loginSuccess, logout } from 'features/auth/redux/authSlice'
import { usePathname, useRouter } from 'next/navigation'
import { getProfileMenuByRole } from 'utils/profileMenu'
import { getRoleBadgeColor, getRoleDisplayName } from 'utils/roleUtils'
import { BookOpenIcon } from 'lucide-react'

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const pathname = usePathname()
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Restore user from localStorage
  // useEffect(() => {
  //   const stored = localStorage.getItem('user')
  //   if (stored) {
  //     const parsed = JSON.parse(stored)
  //     if (parsed.user && parsed.token) {
  //       dispatch(loginSuccess(parsed))
  //     }
  //   }
  // }, [dispatch])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.user && parsed?.token) {
          dispatch(loginSuccess(parsed))
        }
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage', err)
      localStorage.removeItem('user') // corrupted data থাকলে মুছে ফেলুন
    }
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/auth/login')
  }

  // Sidebar toggle (for dashboard)
  const handleSidebarToggle = () => {
    const event = new CustomEvent('toggleDashboardSidebar')
    window.dispatchEvent(event)
  }

  const profileMenuItems = user ? getProfileMenuByRole(user.role) : []

  console.log(user, 'user info')

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

          {!user && (
            <Link
              href='/auth/register?role=instructor'
              className='hover:text-indigo-600'
            >
              Become Instructor
            </Link>
          )}

          {user?.role === 'instructor' && (
            <Link
              href='/dashboard/instructor'
              className='text-indigo-600 hover:underline font-semibold'
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              href='/dashboard/admin'
              className='text-indigo-600 hover:underline font-semibold'
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'student' && (
            <Link
              href='/dashboard/student'
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
              <div className='flex items-center gap-2'>
                <img
                  src={user?.profileImage || '/default-avatar.png'}
                  alt='Profile'
                  className='w-10 h-10 rounded-full border cursor-pointer'
                />
              </div>

              <div className='absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                <div className='px-4 py-2 border-b'>
                  <div className='font-bold text-indigo-700'>{user.name}</div>
                  <div className='flex items-center gap-2 mt-1'>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                    <span className='text-xs text-gray-500 truncate'>
                      {user.email}
                    </span>
                  </div>
                </div>

                {profileMenuItems.map((item) =>
                  item.name === 'Logout' ? (
                    <button
                      key={item.name}
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600'
                    >
                      <item.icon className='w-4 h-4' />
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className=' px-4 py-2 hover:bg-gray-100 flex items-center gap-2'
                    >
                      <item.icon className='w-4 h-4' />
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className='md:hidden px-4 pb-4 space-y-2 text-center bg-white shadow'>
          {/* User Info Section */}
          {user && (
            <div className='px-4 py-2 border-b border-gray-200'>
              <div className='font-semibold'>{user.name}</div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          )}

          {/* Common Links */}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='block px-4 py-2 hover:text-indigo-600 hover:bg-gray-50'
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Conditional Links */}
          {!user && (
            <Link
              href='/auth/register?role=instructor'
              className='block px-4 py-2 text-green-700 font-semibold hover:bg-gray-50'
              onClick={() => setMenuOpen(false)}
            >
              Become Instructor
            </Link>
          )}

          {/* Auth Links */}
          {!user ? (
            <>
              <Link
                href='/auth/login'
                className='block px-4 py-2 text-indigo-600 hover:bg-gray-50'
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href='/auth/register'
                className='block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/${user.role}`}
                className='block px-4 py-2 text-indigo-600 font-semibold hover:bg-gray-50'
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              {profileMenuItems.map((item) =>
                item.name === 'Logout' ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                    className='flex items-center justify-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-50'
                  >
                    <item.icon className='w-4 h-4' />
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-50'
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon className='w-4 h-4' />
                    {item.name}
                  </Link>
                )
              )}
            </>
          )}
        </div>
      )}
    </header>
  )
}
