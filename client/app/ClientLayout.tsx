'use client'

import AOSInitializer from 'components/layout/AOSInitializer'
import RestoreAuth from 'components/auth/RestoreAuth'
import ClientToaster from 'components/feedback/ClientToaster'
import Navbar from 'components/layout/Navbar'
import Footer from 'components/layout/Footer'
import { Providers } from 'features/redux/provider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <AOSInitializer />
      <RestoreAuth />
      <Navbar />
      <main className='min-h-screen'>{children}</main>
      <Footer />
      <ClientToaster />
    </Providers>
  )
}
