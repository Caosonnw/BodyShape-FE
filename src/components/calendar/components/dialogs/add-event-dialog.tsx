'use client'

import { useCalendar } from '@/components/calendar/contexts/calendar-context'
import { eventSchema, TEventFormData } from '@/components/calendar/schemas'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SingleDayPicker } from '@/components/ui/single-day-picker'
import { Textarea } from '@/components/ui/textarea'
import { TimeInput } from '@/components/ui/time-input'
import { useDisclosure } from '@/hooks/use-disclosure'
import { zodResolver } from '@hookform/resolvers/zod'
import type { TimeValue } from 'react-aria-components'
import { useForm } from 'react-hook-form'

interface IProps {
  children: React.ReactNode
  startDate?: Date
  startTime?: { hour: number; minute: number }
}

export function AddEventDialog({ children, startDate, startTime }: IProps) {
  const { users } = useCalendar()

  const { isOpen, onClose, onToggle } = useDisclosure()

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      user: '',
      title: '',
      description: '',
      startDate: typeof startDate !== 'undefined' ? startDate : undefined,
      startTime: typeof startTime !== 'undefined' ? startTime : undefined
    }
  })

  const onSubmit = (values: TEventFormData) => {
    // TO DO: Create use-add-event hook
    console.log('Submit values:', values)
    onClose()
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Add a gym training session for the selected user. Choose the time, date, and provide any session notes if
            needed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='event-form' onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 py-4'>
            <FormField
              control={form.control}
              name='user'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder='Select an option'>
                          {field.value ? (
                            <div className='flex items-center gap-2'>
                              <Avatar className='size-6'>
                                <AvatarImage
                                  src={
                                    users.find((u) => String(u.user_id) === field.value)?.avatar
                                      ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${
                                          users.find((u) => String(u.user_id) === field.value)?.avatar
                                        }`
                                      : undefined
                                  }
                                  alt={users.find((u) => String(u.user_id) === field.value)?.full_name}
                                />
                                <AvatarFallback className='text-xxs'>
                                  {users.find((u) => String(u.user_id) === field.value)?.full_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <p className='truncate'>
                                {users.find((u) => String(u.user_id) === field.value)?.full_name}
                              </p>
                            </div>
                          ) : null}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.user_id} value={String(user.user_id)}>
                            <div className='flex items-center gap-2'>
                              <Avatar className='size-6'>
                                <AvatarImage
                                  src={
                                    user.avatar
                                      ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
                                      : undefined
                                  }
                                  alt={user.full_name}
                                />
                                <AvatarFallback className='text-xxs'>{user.full_name[0]}</AvatarFallback>
                              </Avatar>
                              <p className='truncate'>{user.full_name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='title'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor='title'>Title</FormLabel>

                  <FormControl>
                    <Input id='title' placeholder='Enter a title' data-invalid={fieldState.invalid} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-start gap-2'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field, fieldState }) => (
                  <FormItem className='flex-1'>
                    <FormLabel htmlFor='startDate'>Start Date</FormLabel>

                    <FormControl>
                      <SingleDayPicker
                        id='startDate'
                        value={field.value}
                        onSelect={(date) => field.onChange(date as Date)}
                        placeholder='Select a date'
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='startTime'
                render={({ field, fieldState }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Start Time</FormLabel>

                    <FormControl>
                      <TimeInput
                        value={field.value as TimeValue}
                        onChange={field.onChange}
                        hourCycle={12}
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex items-start gap-2'>
              <FormField
                control={form.control}
                name='endDate'
                render={({ field, fieldState }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <SingleDayPicker
                        value={field.value}
                        onSelect={(date) => field.onChange(date as Date)}
                        placeholder='Select a date'
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endTime'
                render={({ field, fieldState }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>End Time</FormLabel>

                    <FormControl>
                      <TimeInput
                        value={field.value as TimeValue}
                        onChange={field.onChange}
                        hourCycle={12}
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='color'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue placeholder='Select an option' />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value='blue'>
                          <div className='flex items-center gap-2'>
                            <div className='size-3.5 rounded-full bg-blue-600' />
                            Blue
                          </div>
                        </SelectItem>

                        <SelectItem value='green'>
                          <div className='flex items-center gap-2'>
                            <div className='size-3.5 rounded-full bg-green-600' />
                            Green
                          </div>
                        </SelectItem>

                        <SelectItem value='red'>
                          <div className='flex items-center gap-2'>
                            <div className='size-3.5 rounded-full bg-red-600' />
                            Red
                          </div>
                        </SelectItem>

                        <SelectItem value='yellow'>
                          <div className='flex items-center gap-2'>
                            <div className='size-3.5 rounded-full bg-yellow-600' />
                            Yellow
                          </div>
                        </SelectItem>

                        <SelectItem value='purple'>
                          <div className='flex items-center gap-2'>
                            <div className='size-3.5 rounded-full bg-purple-600' />
                            Purple
                          </div>
                        </SelectItem>

                        <SelectItem value='orange'>
                          <div className='flex items-center gap-2'>
                            <div className='size-3.5 rounded-full bg-orange-600' />
                            Orange
                          </div>
                        </SelectItem>

                        <SelectItem value='gray'>
                          <div className='flex items-center gap-2'>
                            <div className='size-3.5 rounded-full bg-neutral-600' />
                            Gray
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea {...field} value={field.value} data-invalid={fieldState.invalid} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>

          <Button form='event-form' type='submit'>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
