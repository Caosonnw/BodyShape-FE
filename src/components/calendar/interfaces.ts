import { TEventColor } from '@/components/calendar/types'

export interface IUser {
  user_id: string
  full_name: string
  avatar: string | null
}

export interface IEvent {
  id: number
  startDate: string
  endDate: string
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
