// 'use client'

// import axios from 'axios'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import RevenueChart from 'components/admin/charts/RevenueChart'

// interface Stats {
//   totalUsers: number
//   totalCourses: number
//   monthlyRevenue: number
//   pendingApprovals: number
//   todayOrders: number
//   totalOrders: number
//   todayEarnings: number
//   newUsersToday: number
//   refundRequests: number
//   soldCourses: {
//     title: string
//     totalSold: number
//   }[]
// }

// export default function AdminDashboardPage() {
//   const [stats, setStats] = useState<Stats | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/admin/stats')
//         setStats(res.data)
//       } catch (err) {
//         console.error('Failed to fetch stats:', err)
//       }
//     }

//     fetchStats()
//   }, [])

//   const handleAddLectureClick = () => {
//     const courseId = '660a123456abcdef1234'
//     const sectionId = '660b123456abcdef5678'

//     router.push(
//       `/admin/dashboard/courses/${courseId}/sections/${sectionId}/add-lecture`
//     )
//   }

//   return (
//     <div className='p-6'>
//       <h2 className='text-2xl font-bold mb-4'>📊 Dashboard Overview</h2>

//       {/* Main Stats Cards */}
//       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
//         <StatCard title='Total Users' value={stats?.totalUsers} />
//         <StatCard title='Total Courses' value={stats?.totalCourses} />
//         <StatCard title='Monthly Revenue' value={`$${stats?.monthlyRevenue}`} />
//         <StatCard title='Pending Approvals' value={stats?.pendingApprovals} />
//         <StatCard title='Today Orders' value={stats?.todayOrders} />
//         <StatCard title='Total Orders' value={stats?.totalOrders} />
//         <StatCard title='Today Earnings' value={`$${stats?.todayEarnings}`} />
//         <StatCard title='New Users Today' value={stats?.newUsersToday} />
//         <StatCard title='Refund Requests' value={stats?.refundRequests} />
//       </div>

//       {/* Sold Courses */}
//       <div className='mt-10'>
//         <h3 className='text-lg font-semibold mb-3'>🔥 Sold Courses</h3>
//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//           {stats?.soldCourses?.map((course, idx) => (
//             <div
//               key={idx}
//               className='bg-white border p-4 rounded-lg shadow hover:shadow-md transition'
//             >
//               <p className='text-sm text-gray-500'>Course</p>
//               <h4 className='text-lg font-semibold'>{course.title}</h4>
//               <p className='text-sm text-green-600'>Sold: {course.totalSold}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Add Lecture Button */}
//       <div className='my-6'>
//         <button
//           onClick={handleAddLectureClick}
//           className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
//         >
//           ➕ Add Lecture
//         </button>
//       </div>

//       {/* Revenue Chart */}
//       <RevenueChart />
//     </div>
//   )
// }

// // Reusable Card Component
// const StatCard = ({ title, value }: { title: string; value: any }) => (
//   <div className='bg-white p-5 rounded-lg shadow'>
//     <h3 className='text-sm text-gray-500'>{title}</h3>
//     <p className='text-2xl font-bold text-gray-800'>{value ?? '—'}</p>
//   </div>
// )

'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminRevenue } from 'hooks/useAdminRevenue'
import RevenueChart from 'components/admin/charts/RevenueChart'

interface Stats {
  totalUsers: number
  totalCourses: number
  monthlyRevenue: number
  pendingApprovals: number
  todayOrders: number
  totalOrders: number
  todayEarnings: number
  newUsersToday: number
  refundRequests: number
  soldCourses: {
    title: string
    totalSold: number
  }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const router = useRouter()

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useAdminRevenue()
  console.log(revenueData, 'data')
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats')
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>📊 Dashboard Overview</h2>

      {/* Main Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard title='Total Users' value={stats?.totalUsers} />
        <StatCard title='Total Courses' value={stats?.totalCourses} />
        <StatCard title='Monthly Revenue' value={`$${stats?.monthlyRevenue}`} />
        <StatCard title='Pending Approvals' value={stats?.pendingApprovals} />
        <StatCard title='Today Orders' value={stats?.todayOrders} />
        <StatCard title='Total Orders' value={stats?.totalOrders} />
        <StatCard title='Today Earnings' value={`$${stats?.todayEarnings}`} />
        <StatCard title='New Users Today' value={stats?.newUsersToday} />
        <StatCard title='Refund Requests' value={stats?.refundRequests} />

        {/* ✅ Admin Total Earning Card */}
        <StatCard
          title='Admin Total Earning'
          value={
            revenueLoading
              ? 'Loading...'
              : revenueError
              ? 'Error'
              : `$${revenueData?.platformEarnings?.toFixed(2)}`
          }
        />
      </div>

      {/* Sold Courses */}
      <div className='mt-10'>
        <h3 className='text-lg font-semibold mb-3'>🔥 Sold Courses</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {stats?.soldCourses?.map((course, idx) => (
            <div
              key={idx}
              className='bg-white border p-4 rounded-lg shadow hover:shadow-md transition'
            >
              <p className='text-sm text-gray-500'>Course</p>
              <h4 className='text-lg font-semibold'>{course.title}</h4>
              <p className='text-sm text-green-600'>Sold: {course.totalSold}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart chartData={revenueData?.chartData} />
    </div>
  )
}

// Reusable Stat Card Component
const StatCard = ({ title, value }: { title: string; value: any }) => (
  <div className='bg-white p-5 rounded-lg shadow'>
    <h3 className='text-sm text-gray-500'>{title}</h3>
    <p className='text-2xl font-bold text-gray-800'>{value ?? '—'}</p>
  </div>
)
