import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Common headers config
const getAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
})

// Course Status Management
export const submitForReview = async (courseId: string, token: string) => {
  return axios.post(
    `${API_URL}/courses/${courseId}/submit`,
    {},
    getAuthConfig(token)
  )
}

export const reviewCourse = async (
  courseId: string,
  decision: string,
  token: string,
  notes?: string
) => {
  return axios.post(
    `${API_URL}/courses/${courseId}/review`,
    {
      decision,
      notes: notes || '', // Ensure notes is always a string
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

export const publishCourse = async (courseId: string, token: string) => {
  return axios.post(
    `${API_URL}/courses/${courseId}/publish`,
    {},
    getAuthConfig(token)
  )
}

export const archiveCourse = async (courseId: string, token: string) => {
  return axios.post(`${API_URL}/${courseId}/archive`, {}, getAuthConfig(token))
}

// export const getCoursesByStatus = async (status: string, token: string) => {
//   return axios.get(`${API_URL}/status/${status}`, getAuthConfig(token))
// }

export const getCoursesByStatus = async (status: string, token: string) => {
  return axios.get(`${API_URL}/courses/status/${status}`, getAuthConfig(token))
}

// Other course operations
export const getInstructorCourses = async (
  instructorId: string,
  token: string
) => {
  return axios.get(
    `${API_URL}/courses/${instructorId}/courses`,
    getAuthConfig(token)
  )
}

export const getCourseDetails = async (courseId: string, token: string) => {
  return axios.get(
    `${API_URL}/courses/${courseId}/details`,
    getAuthConfig(token)
  )
}

export const updateCourse = async (
  courseId: string,
  data: any,
  token: string
) => {
  return axios.put(`${API_URL}/courses/${courseId}`, data, getAuthConfig(token))
}

export const getAdminNotes = async (courseId: string, token: string) => {
  return axios.get(
    `${API_URL}/courses/${courseId}/admin-notes`,
    getAuthConfig(token)
  )
}

// export const resubmitCourse = async (
//   courseId: string,
//   responseNote: string,
//   token: string
// ) => {
//   return axios.post(
//     `${API_URL}/courses/${courseId}/resubmit`,
//     { responseNote },
//     getAuthConfig(token)
//   )
// }

export const resubmitCourse = async (
  courseId: string,
  responseNote: string,
  token: string
) => {
  return axios.post(
    `${API_URL}/courses/${courseId}/resubmit`,
    { responseNote },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Add this line
      },
    }
  )
}
