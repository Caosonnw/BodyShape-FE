'use client'

import { CalendarProvider } from '@/components/calendar/contexts/calendar-context'
import { IEvent, IUser } from '@/components/calendar/interfaces'
import { getEvents, getUsers } from '@/components/calendar/requests'
import { useEffect, useState } from 'react'

export function ClientCalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<IEvent[] | null>(null)
  const [users, setUsers] = useState<IUser[] | null>(null)

  useEffect(() => {
    async function fetchData() {
      const [eventsData, usersData] = await Promise.all([getEvents(), getUsers()])
      await new Promise((resolve) => setTimeout(resolve, 800))
      setEvents(eventsData)
      setUsers(usersData)
    }

    fetchData()
  }, [])

  if (!events || !users) {
    return <div>Loading...</div>
  }
  return (
    <CalendarProvider events={events} users={users}>
      {children}
    </CalendarProvider>
  )
}
