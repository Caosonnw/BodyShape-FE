import { TEventColor } from '@/components/calendar/types'

export interface IUser {
  user_id: string
  full_name: string
  avatar: string | null
}

export interface IEvent {
  schedule_id: number
  start_date: string
  end_date: string
  title: string
  color: TEventColor
  description: string
  user: IUser
}

export interface ICalendarCell {
  day: number
  currentMonth: boolean
  date: Date
}
