'use client'

import * as React from 'react'
import { format, getMonth, getYear, setMonth, setYear } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'

interface DatePickerProps {
  startYear?: number
  endYear?: number
  value?: Date // Giá trị nhận vào từ form
  onDateChange?: (date: Date) => void
}

export function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  value,
  onDateChange
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(value || new Date())

  React.useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month))
    setDate(newDate)
    onDateChange?.(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year))
    setDate(newDate)
    onDateChange?.(newDate)
  }

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData)
      onDateChange?.(selectedData)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[250px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 !z-[9999]'>
        <div className='flex justify-between p-2'>
          <Select onValueChange={handleMonthChange} value={months[getMonth(date)]}>
            <SelectTrigger className='w-[110px]'>
              <SelectValue placeholder='Month' />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
            <SelectTrigger className='w-[110px]'>
              <SelectValue placeholder='Year' />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}
