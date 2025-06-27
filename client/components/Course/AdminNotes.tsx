// // components/Course/AdminNotes.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useSelector } from 'react-redux'
// import { RootState } from 'features/redux/store'
// import { toast } from 'react-hot-toast'

// export default function AdminNotes({ courseId }) {
//   const token = useSelector((state: RootState) => state.auth.token)
//   const user = useSelector((state: RootState) => state.auth.user)
//   const [notes, setNotes] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/courses/${courseId}/admin-notes`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         setNotes(res.data)
//       } catch (error) {
//         toast.error('Failed to load admin notes')
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (courseId) fetchNotes()
//   }, [courseId, token])

//   if (loading) return <div className='p-4'>Loading notes...</div>

//   return (
//     <div className='space-y-4'>
//       <h3 className='font-bold text-lg mb-2'>Course Change History</h3>

//       {notes.length === 0 ? (
//         <p>No admin notes available</p>
//       ) : (
//         <div className='space-y-4'>
//           {notes.map((note, index) => (
//             <div key={index} className='border rounded-lg p-4'>
//               <div className='flex justify-between items-start'>
//                 <div>
//                   <p className='font-medium'>
//                     {note.admin?.name ||
//                       (note.adminId === user?._id ? 'You' : 'Admin')}
//                   </p>
//                   <p className='text-sm text-gray-500'>
//                     {new Date(note.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//                 <span
//                   className={`px-2 py-1 text-xs rounded ${
//                     note.type === 'request'
//                       ? 'bg-blue-100 text-blue-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}
//                 >
//                   {note.adminId === user?._id
//                     ? 'Your Response'
//                     : note.type === 'request'
//                     ? 'Change Request'
//                     : 'Admin Note'}
//                 </span>
//               </div>
//               <p className='mt-2'>{note.note || note.message}</p>

//               {note.responseNote && (
//                 <div className='mt-3 p-3 bg-gray-50 rounded'>
//                   <p className='font-medium'>
//                     {note.adminId === user?._id
//                       ? 'Your Response'
//                       : 'Instructor Response'}
//                   </p>
//                   <p>{note.responseNote}</p>
//                   <p className='text-xs text-gray-500 mt-1'>
//                     {new Date(note.updatedAt).toLocaleString()}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// components/Course/AdminNotes.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { toast } from 'react-hot-toast'

interface Note {
  type: 'note' | 'request' | 'response'
  message: string
  createdAt: Date | string
  admin?: {
    _id: string
    name: string
    email: string
  }
  responseNote?: string
  updatedAt?: Date | string
}

export default function AdminNotes({ courseId }) {
  const token = useSelector((state: RootState) => state.auth.token)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/admin-notes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        // Transform the data to include instructor responses
        const transformedNotes = res.data
          .map((note: any) => {
            if (note.responseNote) {
              return [
                {
                  type: note.type,
                  message: note.message || note.note,
                  createdAt: note.createdAt,
                  admin: note.admin,
                },
                {
                  type: 'response',
                  message: note.responseNote,
                  createdAt: note.updatedAt,
                  admin: {
                    _id: 'instructor',
                    name: 'Instructor',
                    email: '',
                  },
                },
              ]
            }
            return {
              type: note.type,
              message: note.message || note.note,
              createdAt: note.createdAt,
              admin: note.admin,
            }
          })
          .flat()

        setNotes(transformedNotes)
      } catch (error) {
        toast.error('Failed to load admin notes')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId && token) {
      fetchNotes()
    }
  }, [courseId, token])

  if (loading) return <div className='p-4'>Loading notes...</div>

  return (
    <div className='space-y-4'>
      <h3 className='font-bold text-lg mb-2'>Course Communication History</h3>

      {notes.length === 0 ? (
        <p>No communication history available</p>
      ) : (
        <div className='space-y-4'>
          {notes
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((note, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  note.type === 'response' ? 'bg-gray-50 ml-8' : ''
                }`}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-medium'>
                      {note.admin?.name ||
                        (note.type === 'response' ? 'Instructor' : 'Admin')}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      note.type === 'request'
                        ? 'bg-blue-100 text-blue-800'
                        : note.type === 'response'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {note.type === 'request'
                      ? 'Change Request'
                      : note.type === 'response'
                      ? 'Instructor Response'
                      : 'Admin Note'}
                  </span>
                </div>
                <p className='mt-2'>{note.message}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
