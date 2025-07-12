'use client'

import '/lib/i18n'
import { useTranslation } from 'react-i18next'
import { Download } from 'lucide-react'
import { Button } from 'components/ui/button'
import { Card, CardContent } from 'components/ui/card'
import { Badge } from 'components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useEarnings } from 'hooks/useEarnings'

// ডামি ডেটা শুধু চার্ট এবং হিস্ট্রির জন্য (যদি API থেকে না পাওয়া যায়)
const dummyChartData = [
  { month: 'Jan', earnings: 100 },
  { month: 'Feb', earnings: 150 },
  { month: 'Mar', earnings: 200 },
  { month: 'Apr', earnings: 250 },
  { month: 'May', earnings: 300 },
  { month: 'Jun', earnings: 234.56 },
]

const dummyHistoryData = [
  {
    date: '2025-05-01',
    amount: 120,
    status: 'Paid',
    method: 'Bkash',
  },
  {
    date: '2025-04-15',
    amount: 100,
    status: 'Pending',
    method: 'Nagad',
  },
]

export default function EarningsPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useEarnings()

  if (isLoading) return <p className='p-6'>Loading...</p>
  if (error) return <p className='p-6 text-red-500'>Failed to load earnings.</p>

  // API ডেটা এবং ডামি ডেটা মিশ্রিত করুন
  const earningsData = {
    total: (data as any)?.totalEarnings || 0,
    monthly: (data as any)?.monthlyEarnings || 0, // আপনার API থেকে monthly ডেটা আনুন
    pending: data?.pendingEarnings || 0,
    chart: data?.chartData || dummyChartData, // API থেকে চার্ট ডেটা আনুন
    history: data?.paymentHistory || dummyHistoryData, // API থেকে হিস্ট্রি ডেটা আনুন
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>{t('earnings')}</h1>
        <Button variant='outline'>
          <Download className='w-4 h-4 mr-2' />
          {t('downloadReport')}
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>{t('totalEarnings')}</p>
            <p className='text-2xl font-semibold text-green-600'>
              ${earningsData.total.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>{t('thisMonth')}</p>
            <p className='text-2xl font-semibold text-blue-600'>
              ${earningsData.monthly.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>{t('pending')}</p>
            <p className='text-2xl font-semibold text-yellow-600'>
              ${earningsData.pending.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='bg-white p-6 rounded-2xl shadow border'>
        <h2 className='text-lg font-semibold mb-4'>{t('monthlyEarnings')}</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={earningsData.chart}>
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='earnings' fill='#6366f1' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='bg-white p-6 rounded-2xl shadow border'>
        <h2 className='text-lg font-semibold mb-4'>{t('paymentHistory')}</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm text-left'>
            <thead>
              <tr className='border-b bg-gray-50'>
                <th className='py-2 px-4'>{t('date')}</th>
                <th className='py-2 px-4'>{t('amount')}</th>
                <th className='py-2 px-4'>{t('status')}</th>
                <th className='py-2 px-4'>{t('method')}</th>
              </tr>
            </thead>
            <tbody>
              {earningsData.history.map((item: any, index: number) => (
                <tr key={index} className='border-b hover:bg-gray-50'>
                  <td className='py-2 px-4'>{item.date}</td>
                  <td className='py-2 px-4'>${item.amount.toFixed(2)}</td>
                  <td className='py-2 px-4'>
                    <Badge
                      variant={item.status === 'Paid' ? 'default' : 'secondary'}
                    >
                      {t(item.status.toLowerCase())}
                    </Badge>
                  </td>
                  <td className='py-2 px-4'>{item.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
