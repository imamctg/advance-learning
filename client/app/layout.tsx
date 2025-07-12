// app/layout.tsx
import './globals.css'

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
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
