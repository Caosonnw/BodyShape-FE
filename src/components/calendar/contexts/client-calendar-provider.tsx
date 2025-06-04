'use client'

import { CalendarProvider } from '@/components/calendar/contexts/calendar-context'
import { IEvent, IUser } from '@/components/calendar/interfaces'
import { CalendarSkeleton } from '@/components/calendar/loading/calendar-skeleton'
import { getEvents, getUsers } from '@/components/calendar/requests'
import { useSchedulesQuery } from '@/queries/useSchedule'
import { useEffect, useState } from 'react'

export function ClientCalendarProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<IUser[] | null>(null)
  // const [events, setEvents] = useState<IEvent[] | null>(null)
  const { data: events } = useSchedulesQuery()

  useEffect(() => {
    async function fetchData() {
      const [eventsData, usersData] = await Promise.all([getEvents(), getUsers()])
      await new Promise((resolve) => setTimeout(resolve, 800))
      // setEvents(eventsData)
      setUsers(usersData)
    }

    fetchData()
  }, [])

  if (!events || !users) {
    return <CalendarSkeleton view='month' />
  }
  return (
    <CalendarProvider events={events} users={users}>
      {children}
    </CalendarProvider>
  )
}
