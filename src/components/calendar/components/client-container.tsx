'use client'

import { CalendarAgendaView } from '@/components/calendar/components/agenda-view/calendar-agenda-view'
import { DndProviderWrapper } from '@/components/calendar/components/dnd/dnd-provider'
import { CalendarHeader } from '@/components/calendar/components/header/calendar-header'
import { CalendarMonthView } from '@/components/calendar/components/month-view/calendar-month-view'
import { CalendarDayView } from '@/components/calendar/components/week-and-day-view/calendar-day-view'
import { CalendarWeekView } from '@/components/calendar/components/week-and-day-view/calendar-week-view'
import { CalendarYearView } from '@/components/calendar/components/year-view/calendar-year-view'
import { useCalendar } from '@/components/calendar/contexts/calendar-context'
import { TCalendarView } from '@/components/calendar/types'
import { isSameDay, parseISO } from 'date-fns'
import { useMemo } from 'react'

interface IProps {
  view: TCalendarView
}

export function ClientContainer({ view }: IProps) {
  const { selectedDate, selectedUserId, events } = useCalendar()

  const mappedEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      startDate: event.start_date,
      endDate: event.end_date,
      user: event.user
    }))
  }, [events])

  const filteredEvents = useMemo(() => {
    return mappedEvents.filter((event) => {
      const eventStartDate = parseISO(event.startDate)
      const eventEndDate = parseISO(event.endDate)

      const isUserMatch = selectedUserId === 'all' || String(event.user.user_id) === String(selectedUserId)

      if (view === 'year') {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1)
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999)
        const isInSelectedYear = eventStartDate <= yearEnd && eventEndDate >= yearStart
        return isInSelectedYear && isUserMatch
      }

      if (view === 'month' || view === 'agenda') {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999)
        const isInSelectedMonth = eventStartDate <= monthEnd && eventEndDate >= monthStart
        return isInSelectedMonth && isUserMatch
      }

      if (view === 'week') {
        const dayOfWeek = selectedDate.getDay()

        const weekStart = new Date(selectedDate)
        weekStart.setDate(selectedDate.getDate() - dayOfWeek)
        weekStart.setHours(0, 0, 0, 0)

        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)

        const isInSelectedWeek = eventStartDate <= weekEnd && eventEndDate >= weekStart
        return isInSelectedWeek && isUserMatch
      }

      if (view === 'day') {
        const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0)
        const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59)
        const isInSelectedDay = eventStartDate <= dayEnd && eventEndDate >= dayStart
        return isInSelectedDay && isUserMatch
      }

      return false // Nếu không trùng view nào
    })
  }, [mappedEvents, selectedDate, selectedUserId, view])

  const singleDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate)
    const endDate = parseISO(event.endDate)
    return isSameDay(startDate, endDate)
  })

  const multiDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate)
    const endDate = parseISO(event.endDate)
    return !isSameDay(startDate, endDate)
  })

  // For year view, we only care about the start date
  // by using the same date for both start and end,
  // we ensure only the start day will show a dotư
  const eventStartDates = useMemo(() => {
    return filteredEvents.map((event) => ({
      ...event,
      endDate: event.startDate
    }))
  }, [filteredEvents])

  return (
    <div className='overflow-hidden rounded-xl border'>
      <CalendarHeader view={view} events={filteredEvents} />

      <DndProviderWrapper>
        {view === 'day' && <CalendarDayView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === 'month' && <CalendarMonthView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === 'week' && <CalendarWeekView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === 'year' && <CalendarYearView allEvents={eventStartDates} />}
        {view === 'agenda' && <CalendarAgendaView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
      </DndProviderWrapper>
    </div>
  )
}
