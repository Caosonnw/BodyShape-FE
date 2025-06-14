import { AgendaEventCard } from '@/components/calendar/components/agenda-view/agenda-event-card'
import { IEvent } from '@/components/calendar/interfaces'
import { differenceInDays, format, parseISO, startOfDay } from 'date-fns'

interface IProps {
  date: Date
  events: IEvent[]
  multiDayEvents: IEvent[]
}

export function AgendaDayGroup({ date, events, multiDayEvents }: IProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

  return (
    <div className='space-y-4'>
      <div className='sticky top-0 flex items-center gap-4 bg-background py-2'>
        <p className='text-sm font-semibold'>{format(date, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div className='space-y-2'>
        {multiDayEvents.length > 0 &&
          multiDayEvents.map((event) => {
            const eventStart = startOfDay(parseISO(event.start_date))
            const eventEnd = startOfDay(parseISO(event.end_date))
            const currentDate = startOfDay(date)

            const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1
            const eventCurrentDay = differenceInDays(currentDate, eventStart) + 1
            return (
              <AgendaEventCard
                key={event.schedule_id}
                event={event}
                eventCurrentDay={eventCurrentDay}
                eventTotalDays={eventTotalDays}
              />
            )
          })}

        {sortedEvents.length > 0 &&
          sortedEvents.map((event) => <AgendaEventCard key={event.schedule_id} event={event} />)}
      </div>
    </div>
  )
}
