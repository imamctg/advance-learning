'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { Coupon } from 'types/coupon'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [expiresAt, setExpiresAt] = useState('')
  const [search, setSearch] = useState('')

  // Fetch coupons from backend
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${baseURL}/instructor/coupons`)
      setCoupons(res.data)
    } catch (err) {
      toast.error('Failed to fetch coupons')
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !discount || !expiresAt) {
      return toast.error('All fields required')
    }
    try {
      await axios.post(`${baseURL}/instructor/coupons`, {
        code,
        discount,
        expiresAt,
      })
      toast.success('Coupon created')
      setCode('')
      setDiscount(0)
      setExpiresAt('')
      fetchCoupons()
    } catch (err) {
      toast.error('Failed to create coupon')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    try {
      await axios.delete(`${baseURL}/instructor/coupons/${id}`)
      toast.success('Coupon deleted')
      fetchCoupons()
    } catch (err) {
      toast.error('Failed to delete coupon')
    }
  }

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='p-6 space-y-8'>
      <h2 className='text-2xl font-bold text-gray-800'>💸 Coupons</h2>

      {/* Create Coupon Form */}
      <form
        onSubmit={handleCreate}
        className='bg-white p-4 rounded-lg shadow flex flex-col md:flex-row items-center gap-4'
      >
        <input
          type='text'
          placeholder='Code (e.g., NEW20)'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='border rounded p-2 w-full md:w-1/4'
        />
        <input
          type='number'
          placeholder='Discount (%)'
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className='border rounded p-2 w-full md:w-1/4'
        />
        <input
          type='date'
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className='border rounded p-2 w-full md:w-1/4'
        />
        <button
          type='submit'
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto'
        >
          Create Coupon
        </button>
      </form>

      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search coupons...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='border p-2 rounded w-full md:w-1/3'
      />

      {/* Coupons List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className='bg-white p-4 rounded shadow flex flex-col justify-between'
          >
            <div>
              <h4 className='text-lg font-semibold text-gray-800'>
                {coupon.code}
              </h4>
              <p className='text-sm text-gray-600'>
                Discount: {coupon.discount}%
              </p>
              <p className='text-sm text-gray-600'>
                Expiry:{' '}
                <span
                  className={`font-medium ${
                    new Date(coupon.expiresAt) < new Date()
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {format(new Date(coupon.expiresAt), 'dd MMM yyyy')}
                </span>
              </p>
            </div>
            <button
              onClick={() => handleDelete(coupon._id)}
              className='mt-4 text-red-600 hover:underline text-sm self-end'
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {filteredCoupons.length === 0 && (
        <p className='text-gray-500 text-sm'>No coupons found.</p>
      )}
    </div>
  )
}
