// client/hooks/useAdminRevenue.ts
import axios from 'axios'
import { RootState } from 'features/redux/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface AdminRevenueData {
  totalRevenue: number
  platformEarnings: number
  pendingRevenue: number
  chartData?: any[]
  paymentHistory?: any[]
}

export function useAdminRevenue() {
  const token = useSelector((state: RootState) => state.auth.token)
  const [data, setData] = useState<AdminRevenueData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    const fetchRevenue = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/earnings/admin',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setData(res.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load revenue data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRevenue()
  }, [token])

  return { data, isLoading, error }
}
