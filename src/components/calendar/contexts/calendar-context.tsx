'use client'

import { IEvent, IUser } from '@/components/calendar/interfaces'
import { TBadgeVariant, TVisibleHours, TWorkingHours } from '@/components/calendar/types'
import { createContext, useContext, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

interface ICalendarContext {
  selectedDate: Date
  setSelectedDate: (date: Date | undefined) => void
  selectedUserId: IUser['user_id'] | 'all'
  setSelectedUserId: (userId: IUser['user_id'] | 'all') => void
  badgeVariant: TBadgeVariant
  setBadgeVariant: (variant: TBadgeVariant) => void
  users: IUser[]
  workingHours: TWorkingHours
  setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>
  visibleHours: TVisibleHours
  setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>
  events: IEvent[]
}

const CalendarContext = createContext({} as ICalendarContext)

const WORKING_HOURS = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 }
}

const VISIBLE_HOURS = { from: 7, to: 18 }

export function CalendarProvider({
  children,
  users,
  events
}: {
  children: React.ReactNode
  users: IUser[]
  events: IEvent[]
}) {
  const [badgeVariant, setBadgeVariant] = useState<TBadgeVariant>('colored')
  const [visibleHours, setVisibleHours] = useState<TVisibleHours>(VISIBLE_HOURS)
  const [workingHours, setWorkingHours] = useState<TWorkingHours>(WORKING_HOURS)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedUserId, setSelectedUserId] = useState<IUser['user_id'] | 'all'>('all')

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
  }

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
        users,
        visibleHours,
        setVisibleHours,
        workingHours,
        setWorkingHours,
        events
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext)
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider.')
  return context
}
