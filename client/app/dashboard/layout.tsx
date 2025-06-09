// // client/app/dashboard/layout.tsx
// 'use client'

// import DashboardSidebar from 'components/Dashboard/DashboardSidebar'
// import React from 'react'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // const user = useSelector((state: RootState) => state.auth.user)
//   return (
//     <div className='flex h-screen mt-3 mb-3'>
//       <DashboardSidebar />

//       <main className='flex-1 p-6 bg-gray-100 overflow-y-auto'>{children}</main>
//     </div>
//   )
// }

// app/dashboard/layout.tsx
'use client'

import DashboardSidebar from 'components/Dashboard/DashboardSidebar'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className='flex-1 md:ml-10 p-4 overflow-y-auto'>{children}</main>
    </div>
  )
}
