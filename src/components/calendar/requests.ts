import { CALENDAR_ITENS_MOCK, USERS_MOCK } from '@/components/calendar/mocks'

export const getEvents = async () => {
  // TO DO: implement this
  // Increase the delay to better see the loading state
  // await new Promise(resolve => setTimeout(resolve, 800));
  return CALENDAR_ITENS_MOCK
}

export const getUsers = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    throw new Error('Access token is required')
  }

  const res = await fetch('http://localhost:8080/user/get-coach-customers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Failed to fetch users: ${error.message}`)
  }

  const data = await res.json()
  return data.data
}
