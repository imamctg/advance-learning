// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { unstable_setRequestLocale } from 'next-intl/server'
import { ReactNode } from 'react'
import { Providers } from 'features/redux/provider'
import { ReactQueryProvider } from 'components/providers/ReactQueryProvider'
import ClientLayout from 'app/ClientLayout'

import enMessages from 'messages/en/index'
import bnMessages from 'messages/bn/index'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }]
}

const locales = ['en', 'bn']

type Props = {
  children: ReactNode
  params: { locale: string }
}

export default async function LocaleLayout(props: Props) {
  const { children } = props
  const { locale } = await Promise.resolve(props.params) // ✅ সঠিকভাবে `await` ব্যবহার করা হলো

  if (!locales.includes(locale)) {
    notFound()
  }

  unstable_setRequestLocale(locale)

  const messages = {
    en: enMessages,
    bn: bnMessages,
  }[locale]

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <ReactQueryProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReactQueryProvider>
      </Providers>
    </NextIntlClientProvider>
  )
}
