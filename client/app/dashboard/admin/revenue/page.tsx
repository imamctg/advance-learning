// components/admin/finance/RevenueReport.tsx
'use client'
import { DatePicker } from 'components/admin/ui/DatePicker'
import { Select } from 'components/admin/ui/Select'
import { FinanceOverviewChart } from 'components/finance/FinanceOverviewChart'
import { RevenueBreakdownTable } from 'components/finance/RevenueBreakdownTable'
import { useState } from 'react'

export default function RevenueReport() {
  const [timeRange, setTimeRange] = useState('monthly')
  const [dateRange, setDateRange] = useState({ start: null, end: null })

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-bold'>রেভিনিউ রিপোর্ট</h3>
        <div className='flex space-x-4'>
          <Select
            options={[
              { value: 'daily', label: 'ডেইলি' },
              { value: 'weekly', label: 'সাপ্তাহিক' },
              { value: 'monthly', label: 'মাসিক' },
              { value: 'yearly', label: 'বার্ষিক' },
              { value: 'custom', label: 'কাস্টম' },
            ]}
            value={timeRange}
            onChange={setTimeRange}
          />
          {timeRange === 'custom' && (
            <DatePicker
              mode='range'
              selected={dateRange}
              onSelect={setDateRange}
            />
          )}
        </div>
      </div>

      <FinanceOverviewChart />

      <div className='mt-8'>
        <h4 className='font-medium mb-4'>ব্রেকডাউন বাই ক্যাটাগরি</h4>
        <RevenueBreakdownTable />
      </div>
    </div>
  )
}
