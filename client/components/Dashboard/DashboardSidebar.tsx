'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'features/redux/store'
import { useState, ComponentType } from 'react'
import {
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaSignOutAlt,
  FaThLarge,
} from 'react-icons/fa'
import { menuByRole } from 'utils/dashboardMenu'
import { logout } from 'features/auth/redux/authSlice'

export interface MenuItem {
  name: string
  href?: string
  icon?: ComponentType<{ className?: string }>
  subItems?: MenuItem[]
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const role = user?.role as keyof typeof menuByRole
  const menuItems = role ? menuByRole[role] : []

  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const params = useParams()
  const courseId = params?.courseId

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((item) => item !== menuName)
        : [...prev, menuName]
    )
  }

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = '/auth/login'
  }

  return (
    <>
      {/* Toggle Button - always on top left */}
      <div className='fixed top-4 left-4 z-50 md:hidden'>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='text-white bg-gray-900 p-2 rounded-md'
        >
          <FaThLarge className='w-5 h-5' />
        </button>
        {/* Left: Dashboard Sidebar Toggle */}
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed  top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
      >
        <div className='h-full flex flex-col justify-between'>
          <div className=' p-4 overflow-y-auto flex-1'>
            <div className='pt-16 md:pt-0 mb-4 border-b border-gray-700 pb-4'>
              <h2 className=' text-lg font-semibold'>
                {user?.name || 'Welcome'}
              </h2>
              <p className='text-sm text-gray-400'>{user?.email}</p>
            </div>

            <h3 className='text-xl font-bold mb-4 capitalize'>{role} Panel</h3>

            <nav className='space-y-1'>
              {menuItems?.map((item) =>
                item.subItems ? (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className='w-full flex items-center justify-between px-4 py-2 rounded hover:bg-gray-800 text-left'
                    >
                      <span className='flex items-center gap-2'>
                        {item.icon && <item.icon className='w-4 h-4' />}
                        {item.name}
                      </span>
                      {openMenus.includes(item.name) ? (
                        <FaChevronUp className='w-4 h-4' />
                      ) : (
                        <FaChevronDown className='w-4 h-4' />
                      )}
                    </button>
                    {openMenus.includes(item.name) &&
                      item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href!}
                          className={`block ml-6 px-4 py-1.5 rounded hover:bg-gray-700 transition ${
                            pathname === sub.href
                              ? 'bg-gray-800 font-semibold'
                              : ''
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}

                    {/* {openMenus.includes(item.name) &&
                      item.subItems.map((sub, index) => (
                        <Link
                          key={`${item.name}-${sub.name}-${index}`}
                          href={
                            sub.href?.replace(
                              '[courseId]',
                              courseId as string
                            ) || '#'
                          }
                          className={`block ml-6 px-4 py-1.5 rounded hover:bg-gray-700 transition ${
                            pathname ===
                            sub.href?.replace('[courseId]', courseId as string)
                              ? 'bg-gray-800 font-semibold'
                              : ''
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))} */}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition ${
                      pathname === item.href ? 'bg-gray-800 font-semibold' : ''
                    }`}
                  >
                    {item.icon && <item.icon className='w-4 h-4' />}
                    {item.name}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Logout */}
          <div className='p-4 border-t border-gray-700'>
            <button
              onClick={handleLogout}
              className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition'
            >
              <FaSignOutAlt className='w-4 h-4' />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
