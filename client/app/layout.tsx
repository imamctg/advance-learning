import './globals.css'
import { Providers } from 'features/redux/provider'
import RestoreAuth from 'components/auth/RestoreAuth'
import Navbar from 'components/layout/Navbar'
import Footer from 'components/layout/Footer'
import ClientToaster from 'components/feedback/ClientToaster'
import AOSInitializer from 'components/layout/AOSInitializer'
import { ReactQueryProvider } from 'components/providers/ReactQueryProvider'

export const metadata = {
  title: 'Course Platform',
  description: 'Buy and sell courses like Udemy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      {/* <body suppressHydrationWarning> */}
      <body suppressHydrationWarning={true} data-gramm='false'>
        <ReactQueryProvider>
          <Providers>
            <AOSInitializer /> {/* ✅ এখন এখানে AOS initialize হবে */}
            <RestoreAuth />
            <Navbar />
            <main className='min-h-screen'>{children}</main>
            <Footer />
            <ClientToaster />{' '}
            {/* ✅ Toaster now rendered in client side only */}
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
