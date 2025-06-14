import { AgendaDayGroup } from '@/components/calendar/components/agenda-view/agenda-day-group'
import { useCalendar } from '@/components/calendar/contexts/calendar-context'
import { IEvent } from '@/components/calendar/interfaces'
import { ScrollArea } from '@/components/ui/scroll-area'
import { endOfDay, format, isSameMonth, parseISO, startOfDay } from 'date-fns'
import { CalendarX2 } from 'lucide-react'
import { useMemo } from 'react'

interface IProps {
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}

export function CalendarAgendaView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useCalendar()

  const eventsByDay = useMemo(() => {
    const allDates = new Map<string, { date: Date; events: IEvent[]; multiDayEvents: IEvent[] }>()

    singleDayEvents.forEach((event) => {
      const eventDate = parseISO(event.start_date)
      if (!isSameMonth(eventDate, selectedDate)) return

      const dateKey = format(eventDate, 'yyyy-MM-dd')

      if (!allDates.has(dateKey)) {
        allDates.set(dateKey, {
          date: startOfDay(eventDate),
          events: [],
          multiDayEvents: []
        })
      }

      allDates.get(dateKey)?.events.push(event)
    })

    multiDayEvents.forEach((event) => {
      const eventStart = parseISO(event.start_date)
      const eventEnd = parseISO(event.end_date)

      let currentDate = startOfDay(eventStart)
      const lastDate = endOfDay(eventEnd)

      while (currentDate <= lastDate) {
        if (isSameMonth(currentDate, selectedDate)) {
          const dateKey = format(currentDate, 'yyyy-MM-dd')

          if (!allDates.has(dateKey)) {
            allDates.set(dateKey, {
              date: new Date(currentDate),
              events: [],
              multiDayEvents: []
            })
          }

          allDates.get(dateKey)?.multiDayEvents.push(event)
        }
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
      }
    })

    return Array.from(allDates.values()).sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [singleDayEvents, multiDayEvents, selectedDate])

  const hasAnyEvents = singleDayEvents.length > 0 || multiDayEvents.length > 0

  return (
    <div className='h-[800px]'>
      <ScrollArea className='h-full' type='always'>
        <div className='space-y-6 p-4'>
          {eventsByDay.map((dayGroup) => (
            <AgendaDayGroup
              key={format(dayGroup.date, 'yyyy-MM-dd')}
              date={dayGroup.date}
              events={dayGroup.events}
              multiDayEvents={dayGroup.multiDayEvents}
            />
          ))}

          {!hasAnyEvents && (
            <div className='flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground'>
              <CalendarX2 className='size-10' />
              <p className='text-sm md:text-base'>No events scheduled for the selected month</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
