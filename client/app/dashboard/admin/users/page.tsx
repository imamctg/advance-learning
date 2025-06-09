'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface User {
  _id: string
  name: string
  email: string
  role: string
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users')
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${userId}/role`, {
        role: newRole,
      })
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      )
    } catch (error) {
      console.error('Failed to change role:', error)
    }
  }

  const handleDelete = async (userId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this user?')
    if (!confirm) return
    console.log(userId)
    try {
      setLoading(true)
      await axios.delete(`http://localhost:5000/api/users/${userId}`)
      setUsers((prev) => prev.filter((user) => user._id !== userId))
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleUpdate = async () => {
    if (!editingUser) return
    console.log(editingUser._id)
    try {
      setLoading(true)
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      })

      setUsers((prev) =>
        prev.map((user) => (user._id === editingUser._id ? editingUser : user))
      )
      setEditingUser(null)
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>User List</h1>
      {loading && <p className='text-red-500 mb-2'>Processing...</p>}

      <table className='min-w-full border text-sm'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2'>SL</th>
            <th className='border p-2'>Name</th>
            <th className='border p-2'>Email</th>
            <th className='border p-2'>Role</th>
            <th className='border p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className='border p-2 text-center'>{index + 1}</td>
              {/* Serial Number */}
              <td className='border p-2'>{user.name}</td>
              <td className='border p-2'>{user.email}</td>
              <td className='border p-2'>
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user._id, e.target.value)}
                  className='border px-2 py-1 rounded'
                >
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                  <option value='instructor'>Instructor</option>
                </select>
              </td>
              <td className='border p-2 space-x-2'>
                <button
                  onClick={() => handleEdit(user)}
                  className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className='mt-6 border p-4 rounded shadow-md bg-gray-100'>
          <h2 className='text-xl font-semibold mb-2'>Edit User</h2>
          <div className='space-y-2'>
            <div>
              <label className='block font-medium'>Name</label>
              <input
                type='text'
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className='w-full border px-2 py-1 rounded'
              />
            </div>
            <div>
              <label className='block font-medium'>Email</label>
              <input
                type='email'
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className='w-full border px-2 py-1 rounded'
              />
            </div>
            <div>
              <label className='block font-medium'>Role</label>
              <select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                className='w-full border px-2 py-1 rounded'
              >
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
                <option value='instructor'>Instructor</option>
              </select>
            </div>
            <div className='space-x-2'>
              <button
                onClick={handleUpdate}
                className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600'
              >
                Update
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className='bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
