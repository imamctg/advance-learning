// client/middleware.ts

import { NextRequest, NextResponse } from 'next/server'

// protect এই রুটগুলো
const adminRoutes = ['/admin', '/admin/dashboard', '/admin/users']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1️⃣ Cookie থেকে token/role পড়া
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  // 2️⃣ যদি admin route হয়
  // if (adminRoutes.some((route) => pathname.startsWith(route))) {
  //   if (!token || role !== 'admin') {
  //     // যদি না থাকে বা admin না হয়
  //     const url = request.nextUrl.clone()
  //     url.pathname = '/unauthorized' // বা '/login'
  //     return NextResponse.redirect(url)
  //   }
  // }

  return NextResponse.next()
}

// ✅ middleware config অংশ
// export const config = {
//   matcher: ['/admin/:path*'], // এই রুটগুলোতে middleware চালু হবে
// }
