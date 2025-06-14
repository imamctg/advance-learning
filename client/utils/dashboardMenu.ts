import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaChartBar,
  FaEnvelope,
  FaCreditCard,
  FaHistory,
  FaCog,
  FaAward,
  FaLifeRing,
  FaInbox,
  FaTags,
  FaStar,
  FaFolderOpen,
} from 'react-icons/fa'
import { IconType } from 'react-icons'

interface DashboardMenuItem {
  name: string
  href: string
  icon: IconType
}

export interface MenuItem {
  name: string
  href?: string
  icon?: IconType // ✅ ঠিক টাইপ
  subItems?: MenuItem[]
}

export const menuByRole: Record<
  'admin' | 'student' | 'instructor' | 'moderator' | 'developer',
  MenuItem[]
> = {
  admin: [
    {
      name: 'Dashboard',
      href: '/dashboard/admin',
      icon: FaTachometerAlt,
    },
    {
      name: 'Courses',
      icon: FaBook,
      subItems: [
        { name: 'All Courses', href: '/dashboard/admin/courses' },
        {
          name: 'Create Course',
          href: '/dashboard/admin/courses/create-course',
        },
      ],
    },
    {
      name: 'Users',
      href: '/dashboard/admin/users',
      icon: FaUsers,
    },
    {
      name: 'Revenue',
      href: '/dashboard/admin/revenue',
      icon: FaChartBar,
    },
    {
      name: 'Messages',
      href: '/dashboard/admin/messages',
      icon: FaEnvelope,
    },
  ],
  student: [
    {
      name: 'My Courses',
      href: '/dashboard/student/my-courses',
      icon: FaBook,
    },
    {
      name: 'Certificates',
      href: '/dashboard/student/certificates',
      icon: FaAward,
    },
    {
      name: 'Messages',
      href: '/dashboard/student/messages',
      icon: FaEnvelope,
    },
    {
      name: 'Payment Method',
      href: '/dashboard/student/payment-method',
      icon: FaCreditCard,
    },
    {
      name: 'Purchase History',
      href: '/dashboard/student/purchase-history',
      icon: FaHistory,
    },
    {
      name: 'Account Settings',
      href: '/dashboard/student/account-settings',
      icon: FaCog,
    },
  ],

  instructor: [
    {
      name: 'Dashboard',
      href: '/dashboard/instructor',
      icon: FaTachometerAlt,
    },
    {
      name: 'My Courses',
      href: '/dashboard/instructor/my-courses',
      icon: FaBook,
    },
    {
      name: 'Content',
      icon: FaFolderOpen,
      subItems: [
        {
          name: 'Curriculum',
          href: '/dashboard/instructor/content/curriculum',
        },
        {
          name: 'Videos & Files',
          href: '/dashboard/instructor/content/videos-&-files',
        },
        {
          name: 'Quizzes',
          href: '/dashboard/instructor/content/quizzes',
        },
        {
          name: 'Assignments',
          href: '/dashboard/instructor/content/assignments',
        },
      ],
    },
    {
      name: 'Students',
      href: '/dashboard/instructor/students',
      icon: FaUsers,
    },
    {
      name: 'Earnings',
      href: '/dashboard/instructor/earnings',
      icon: FaChartBar,
    },
    {
      name: 'Reviews',
      href: '/dashboard/instructor/reviews',
      icon: FaStar,
    },
    {
      name: 'Coupons',
      href: '/dashboard/instructor/coupons',
      icon: FaTags,
    },
    {
      name: 'Messages',
      href: '/dashboard/instructor/messages',
      icon: FaInbox,
    },
    {
      name: 'Settings',
      icon: FaCog,
      subItems: [
        {
          name: 'Profile',
          href: '/dashboard/instructor/profile',
        },
        {
          name: 'Account',
          href: '/dashboard/instructor/account',
        },
      ],
    },
    {
      name: 'Support',
      href: '/dashboard/instructor/support',
      icon: FaLifeRing,
    },
  ],
  moderator: [],
  developer: [],
}
