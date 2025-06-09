import { useQuery } from '@tanstack/react-query'

export const useEarnings = () => {
  return useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/api/earnings')
      if (!res.ok) throw new Error('Failed to fetch earnings')
      return res.json()
    },
  })
}
