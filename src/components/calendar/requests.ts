import { IEvent } from '@/components/calendar/interfaces'
import { TEventColor } from '@/components/calendar/types'

export const getEvents = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    throw new Error('Access token is required')
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/schedules/get-schedules`, {
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
  const events: IEvent[] = data.data.map((item: any) => ({
    schedule_id: item.schedule_id,
    start_date: item.start_date,
    end_date: item.end_date,
    title: item.title,
    color: item.color as TEventColor,
    description: item.description,
    user: {
      user_id: String(item.customers?.users?.user_id ?? ''),
      full_name: item.customers?.users?.full_name ?? '',
      avatar: item.customers?.users?.avatar ?? null
    }
  }))

  return events
}

export const getUsers = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    throw new Error('Access token is required')
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/coach-customers/get-coach-customers`, {
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
