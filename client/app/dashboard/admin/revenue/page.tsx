'use client'
import { useAdminRevenue } from 'hooks/useAdminRevenue'
import { Download } from 'lucide-react'
import { Button } from 'components/ui/button'
import { Card, CardContent } from 'components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Dummy data for chart and history (if not available from API)
const dummyChartData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 8000 },
  { month: 'Mar', revenue: 12000 },
  { month: 'Apr', revenue: 9000 },
  { month: 'May', revenue: 15000 },
  { month: 'Jun', revenue: 18000 },
]

const dummyHistoryData = [
  {
    date: '2025-05-01',
    amount: 5000,
    status: 'Processed',
    method: 'Bank Transfer',
  },
  {
    date: '2025-04-15',
    amount: 3000,
    status: 'Pending',
    method: 'Stripe',
  },
]

export default function RevenuePage() {
  const { data, isLoading, error } = useAdminRevenue()

  if (isLoading) return <p className='p-6'>Loading revenue data...</p>
  if (error) return <p className='p-6 text-red-500'>{error}</p>

  // Combine API data with dummy data
  const revenueData = {
    total: data?.totalRevenue || 0,
    platform: data?.platformEarnings || 0,
    pending: data?.pendingRevenue || 0,
    chart: data?.chartData || dummyChartData,
    history: data?.paymentHistory || dummyHistoryData,
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Revenue Dashboard</h1>
        <Button variant='outline'>
          <Download className='w-4 h-4 mr-2' />
          Download Report
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Total Revenue</p>
            <p className='text-2xl font-semibold text-green-600'>
              ${revenueData.total.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Platform Earnings</p>
            <p className='text-2xl font-semibold text-blue-600'>
              ${revenueData.platform.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Pending Revenue</p>
            <p className='text-2xl font-semibold text-yellow-600'>
              ${revenueData.pending.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='bg-white p-6 rounded-2xl shadow border'>
        <h2 className='text-lg font-semibold mb-4'>Monthly Revenue</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={revenueData.chart}>
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='revenue' fill='#6366f1' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='bg-white p-6 rounded-2xl shadow border'>
        <h2 className='text-lg font-semibold mb-4'>Payment History</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm text-left'>
            <thead>
              <tr className='border-b bg-gray-50'>
                <th className='py-2 px-4'>Date</th>
                <th className='py-2 px-4'>Amount</th>
                <th className='py-2 px-4'>Status</th>
                <th className='py-2 px-4'>Method</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.history.map((item: any, index: number) => (
                <tr key={index} className='border-b hover:bg-gray-50'>
                  <td className='py-2 px-4'>{item.date}</td>
                  <td className='py-2 px-4'>${item.amount.toFixed(2)}</td>
                  <td className='py-2 px-4'>
                    <span
                      className={`px-2 py-1 rounded ${
                        item.status === 'Processed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status}
                    </span>
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
