// import { NextRequest } from 'next/server'
// import createMiddleware from 'next-intl/middleware'
// import nextIntlConfig from './next-intl.config'

// const intlMiddleware = createMiddleware({
//   locales: nextIntlConfig.locales,
//   defaultLocale: nextIntlConfig.defaultLocale,
//   localePrefix: 'always',
// })

// export default function middleware(request: NextRequest) {
//   return intlMiddleware(request)
// }

// export const config = {
//   matcher: ['/', '/(en|bn)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
// }

import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import nextIntlConfig from './next-intl.config'

let intlMiddleware: ReturnType<typeof createMiddleware>

try {
  intlMiddleware = createMiddleware({
    locales: nextIntlConfig.locales,
    defaultLocale: nextIntlConfig.defaultLocale,
    localePrefix: 'always',
  })
} catch (error) {
  console.error('❌ Error creating intl middleware:', error)
}

export default function middleware(request: NextRequest) {
  try {
    return intlMiddleware?.(request) || NextResponse.next()
  } catch (error) {
    console.error('❌ Middleware execution error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/', '/(en|bn)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
}
