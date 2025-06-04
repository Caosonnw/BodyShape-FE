'use client'

import { ItemTypes } from '@/components/calendar/components/dnd/draggable-event'
import { useUpdateEvent } from '@/components/calendar/hooks/use-update-event'
import { IEvent } from '@/components/calendar/interfaces'
import { cn } from '@/lib/utils'
import { differenceInMilliseconds, parseISO } from 'date-fns'
import { useDrop } from 'react-dnd'

interface DroppableTimeBlockProps {
  date: Date
  hour: number
  minute: number
  children: React.ReactNode
}

export function DroppableTimeBlock({ date, hour, minute, children }: DroppableTimeBlockProps) {
  const { updateEvent } = useUpdateEvent()

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item: { event: IEvent }) => {
        const droppedEvent = item.event

        const eventStartDate = parseISO(droppedEvent.start_date)
        const eventEndDate = parseISO(droppedEvent.end_date)

        const eventDurationMs = differenceInMilliseconds(eventEndDate, eventStartDate)

        const newStartDate = new Date(date)
        newStartDate.setHours(hour, minute, 0, 0)
        const newEndDate = new Date(newStartDate.getTime() + eventDurationMs)

        updateEvent({
          ...droppedEvent,
          start_date: newStartDate.toISOString(),
          end_date: newEndDate.toISOString()
        })

        return { moved: true }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [date, hour, minute, updateEvent]
  )

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={cn('h-[24px]', isOver && canDrop && 'bg-accent/50')}
    >
      {children}
    </div>
  )
}
