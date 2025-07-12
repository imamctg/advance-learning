'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

interface Message {
  _id: string
  text: string
  sentAt: string
}

// const userId = 'USER_ID_HERE' // ✅ আপনি যেভাবে userId পাচ্ছেন (Redux/Auth context etc.) সেটা বসান

export default function MessagePage() {
  const userId = useSelector((state: any) => state.auth.user?.id)

  // const user = useSelector((state: any) => state.auth.user)
  // console.log('👤 Redux User Object:', user)

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/message/${userId}`
        )
        setMessages(res.data)
        console.log('📥 Messages Frontend:', res.data)
      } catch (err: any) {
        setError('Failed to load messages.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [userId])

  return (
    <div className='max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded'>
      <h1 className='text-2xl font-bold mb-4'>📩 Your Messages</h1>

      {loading ? (
        <p className='text-gray-500'>Loading messages...</p>
      ) : error ? (
        <p className='text-red-600'>{error}</p>
      ) : messages.length === 0 ? (
        <p className='text-gray-500'>No messages found.</p>
      ) : (
        <ul className='space-y-4'>
          {messages.map((msg) => (
            <li key={msg._id} className='border p-4 rounded bg-gray-50'>
              <p className='text-gray-800'>{msg.text}</p>
              <p className='text-sm text-gray-500 mt-2'>
                🕒 {new Date(msg.sentAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
