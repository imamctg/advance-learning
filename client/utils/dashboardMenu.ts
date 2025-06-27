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
      name: 'Course Review',
      icon: FaBook,
      subItems: [
        {
          name: 'Review Queue',
          href: '/dashboard/admin/courses/review',
          subItems: [
            {
              name: 'Pending Review',
              href: '/dashboard/admin/courses?status=under_review',
            },
            {
              name: 'Changes Requested',
              href: '/dashboard/admin/courses?status=changes_requested',
            },
          ],
        },
        {
          name: 'Approved Courses',
          href: '/dashboard/admin/courses/approved',
          subItems: [
            {
              name: 'All Approved',
              href: '/dashboard/admin/courses?status=approved',
            },
            {
              name: 'Published',
              href: '/dashboard/admin/courses?status=published',
            },
          ],
        },
        {
          name: 'Management',
          subItems: [
            { name: 'All Courses', href: '/dashboard/admin/courses' },
            {
              name: 'Rejected',
              href: '/dashboard/admin/courses?status=rejected',
            },
            {
              name: 'Archived',
              href: '/dashboard/admin/courses?status=archived',
            },
          ],
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
      name: 'Course Manager',
      icon: FaBook,
      subItems: [
        {
          name: 'My Courses',
          href: '/dashboard/instructor/courses',
          subItems: [
            { name: 'All Courses', href: '/dashboard/instructor/courses' },
            {
              name: 'Drafts',
              href: '/dashboard/instructor/courses?status=draft',
            },
            {
              name: 'Under Review',
              href: '/dashboard/instructor/courses?status=under_review',
            },
            {
              name: 'Changes Needed',
              href: '/dashboard/instructor/courses?status=changes_requested',
            },
          ],
        },
        {
          name: 'Approved Courses',
          href: '/dashboard/instructor/courses/approved',
          subItems: [
            {
              name: 'Ready to Publish',
              href: '/dashboard/instructor/courses?status=approved',
            },
            {
              name: 'Published',
              href: '/dashboard/instructor/courses?status=published',
            },
          ],
        },
        {
          name: 'Actions',
          subItems: [
            {
              name: 'Create New',
              href: '/dashboard/instructor/courses/create',
            },
            {
              name: 'Archived',
              href: '/dashboard/instructor/courses?status=archived',
            },
            {
              name: 'Rejected',
              href: '/dashboard/instructor/courses?status=rejected',
            },
          ],
        },
      ],
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
