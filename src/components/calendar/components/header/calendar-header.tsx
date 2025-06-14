import { AddEventDialog } from '@/components/calendar/components/dialogs/add-event-dialog'
import { DateNavigator } from '@/components/calendar/components/header/date-navigator'
import { TodayButton } from '@/components/calendar/components/header/today-button'
import { UserSelect } from '@/components/calendar/components/header/user-select'
import { IEvent } from '@/components/calendar/interfaces'
import { TCalendarView } from '@/components/calendar/types'
import { Button } from '@/components/ui/button'
import { CalendarRange, Columns, Grid2x2, Grid3x3, List, Plus } from 'lucide-react'
import Link from 'next/link'

interface IProps {
  view: TCalendarView
  events: IEvent[]
}

export function CalendarHeader({ view, events }: IProps) {
  return (
    <div className='flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex items-center gap-3'>
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className='flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between'>
        <div className='flex w-full items-center gap-1.5'>
          <div className='inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none'>
            <Button
              asChild
              aria-label='View by day'
              size='icon'
              variant={view === 'day' ? 'default' : 'outline'}
              className='rounded-r-none [&_svg]:size-5'
            >
              <Link href='/dashboard/day-view'>
                <List strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              aria-label='View by week'
              size='icon'
              variant={view === 'week' ? 'default' : 'outline'}
              className='-ml-px rounded-none [&_svg]:size-5'
            >
              <Link href='/dashboard/week-view'>
                <Columns strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              aria-label='View by month'
              size='icon'
              variant={view === 'month' ? 'default' : 'outline'}
              className='-ml-px rounded-none [&_svg]:size-5'
            >
              <Link href='/dashboard/month-view'>
                <Grid2x2 strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              aria-label='View by year'
              size='icon'
              variant={view === 'year' ? 'default' : 'outline'}
              className='-ml-px rounded-none [&_svg]:size-5'
            >
              <Link href='/dashboard/year-view'>
                <Grid3x3 strokeWidth={1.8} />
              </Link>
            </Button>

            <Button
              asChild
              aria-label='View by agenda'
              size='icon'
              variant={view === 'agenda' ? 'default' : 'outline'}
              className='-ml-px rounded-l-none [&_svg]:size-5'
            >
              <Link href='/dashboard/agenda-view'>
                <CalendarRange strokeWidth={1.8} />
              </Link>
            </Button>
          </div>

          <UserSelect />
        </div>

        <AddEventDialog>
          <Button className='w-full sm:w-auto hover:cursor-pointer'>
            <Plus />
            Add Event
          </Button>
        </AddEventDialog>
      </div>
    </div>
  )
}
