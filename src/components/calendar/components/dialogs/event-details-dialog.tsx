'use client'

import { EditEventDialog } from '@/components/calendar/components/dialogs/edit-event-dialog'
import { IEvent } from '@/components/calendar/interfaces'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, Text, User } from 'lucide-react'

interface IProps {
  event: IEvent
  children: React.ReactNode
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.start_date)
  const endDate = parseISO(event.end_date)

  // console.log(event)

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-start gap-2'>
              <User className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>Responsible</p>
                <p className='text-sm text-muted-foreground'>{event.user.full_name}</p>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <Calendar className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>Start Date</p>
                <p className='text-sm text-muted-foreground'>{format(startDate, 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <Clock className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>End Date</p>
                <p className='text-sm text-muted-foreground'>{format(endDate, 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>

            <div className='flex items-start gap-2'>
              <Text className='mt-1 size-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>Description</p>
                <p className='text-sm text-muted-foreground'>{event.description}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <EditEventDialog event={event}>
              <Button type='button' variant='outline'>
                Edit
              </Button>
            </EditEventDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
