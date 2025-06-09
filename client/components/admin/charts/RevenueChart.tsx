'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

export const data = {
  labels,
  datasets: [
    {
      label: 'Revenue',
      data: [1200, 2100, 1800, 2500, 2200, 3000, 2800],
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Monthly Revenue (in USD)',
    },
  },
}

export default function RevenueChart() {
  return (
    <div className='bg-white p-6 rounded-lg shadow mt-10'>
      <h3 className='text-lg font-semibold mb-4 text-gray-800'>
        📈 Revenue Overview
      </h3>
      <Line options={options} data={data} />
    </div>
  )
}
