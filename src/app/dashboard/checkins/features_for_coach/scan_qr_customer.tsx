'use client'

import { format } from 'date-fns'
import { Check, CheckCircle2, Clock3, Loader2, LogIn, LogOut } from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Badge } from '@/components/ui/badge'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useGetCheckinByTodayUser } from '@/queries/useCheckin'

import { AttendanceSocketPayload, useCheckinSocket } from '@/hooks/use-checkin-socket'

interface Props {
  openCustomerDialog: boolean
  setOpenCustomerDialog: (open: boolean) => void
  customers: any[]
  loading?: boolean
  setSelectedCustomer: (customer: any) => void
  setAction: (action: 'checkin' | 'checkout') => void
  setOpenQR: (open: boolean) => void
}

function CustomerAttendanceCard({
  customer,
  setSelectedCustomer,
  setAction,
  setOpenCustomerDialog,
  setOpenQR
}: {
  customer: any
  setSelectedCustomer: (customer: any) => void
  setAction: (action: 'checkin' | 'checkout') => void
  setOpenCustomerDialog: (open: boolean) => void
  setOpenQR: (open: boolean) => void
}) {
  const { data } = useGetCheckinByTodayUser(customer.user_id)

  const [liveAttendance, setLiveAttendance] = useState<any>(null)

  const [waitingForScan, setWaitingForScan] = useState(false)

  // initial sync from query
  useEffect(() => {
    if (data?.payload?.data) {
      setLiveAttendance(data.payload.data)
    }
  }, [data])

  // realtime socket
  useCheckinSocket((payload: AttendanceSocketPayload) => {
    if (payload.userId !== customer.user_id) return

    console.log('🔥 Attendance Updated:', payload)

    setLiveAttendance(payload.checkin)

    setWaitingForScan(false)

    setTimeout(() => {
      setOpenQR(false)
    }, 1200)
  })

  const attendance = liveAttendance

  const checkedIn = !!attendance?.checkin_time

  const checkedOut = !!attendance?.checkout_time

  const isCompleted = checkedIn && checkedOut

  const currentAction: 'checkin' | 'checkout' = checkedIn && !checkedOut ? 'checkout' : 'checkin'

  const buttonText = useMemo(() => {
    if (waitingForScan) {
      return 'Waiting Scan...'
    }

    if (checkedIn && !checkedOut) {
      return 'Check Out'
    }

    return 'Check In'
  }, [waitingForScan, checkedIn, checkedOut])

  const handleAction = () => {
    setSelectedCustomer(customer)

    setAction(currentAction)

    setWaitingForScan(true)

    setOpenCustomerDialog(false)

    setOpenQR(true)
  }

  return (
    <div className='rounded-3xl border bg-background p-4 transition hover:border-primary/30 hover:shadow-sm'>
      <div className='flex items-start justify-between gap-4'>
        {/* LEFT */}
        <div className='flex items-start gap-3'>
          <Avatar className='h-14 w-14 rounded-full'>
            <AvatarImage
              src={customer.avatar ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${customer.avatar}` : ''}
              className='object-cover'
            />

            <AvatarFallback>
              {customer.full_name
                ?.split(' ')
                ?.map((word: string) => word[0])
                ?.join('')
                ?.slice(0, 2)
                ?.toUpperCase() || 'CU'}
            </AvatarFallback>
          </Avatar>

          <div className='space-y-2'>
            <div>
              <div className='flex items-center gap-2'>
                <p className='font-semibold'>{customer.full_name}</p>

                {isCompleted ? (
                  <Badge className='rounded-full bg-green-600 hover:bg-green-600'>Completed</Badge>
                ) : checkedIn ? (
                  <Badge className='rounded-full bg-orange-500 hover:bg-orange-500'>Checked In</Badge>
                ) : (
                  <Badge variant='outline' className='rounded-full'>
                    Not Checked In
                  </Badge>
                )}
              </div>

              <p className='text-sm text-muted-foreground'>{customer.email}</p>
            </div>

            {/* Attendance */}
            <div className='space-y-1 text-xs text-muted-foreground'>
              {attendance?.checkin_time ? (
                <div className='flex items-center gap-1'>
                  <LogIn className='h-3.5 w-3.5 text-green-600' />

                  <span>Check In: {format(new Date(attendance.checkin_time), 'HH:mm:ss')}</span>
                </div>
              ) : (
                <div className='flex items-center gap-1'>
                  <Clock3 className='h-3.5 w-3.5' />

                  <span>Haven't checked in today</span>
                </div>
              )}

              {attendance?.checkout_time && (
                <div className='flex items-center gap-1'>
                  <LogOut className='h-3.5 w-3.5 text-orange-500' />

                  <span>Check Out: {format(new Date(attendance.checkout_time), 'HH:mm:ss')}</span>
                </div>
              )}
            </div>

            {/* Waiting */}
            {waitingForScan && (
              <div className='mt-2 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs'>
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
                Waiting customer scan QR...
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className='flex flex-col items-end'>
          {!isCompleted ? (
            <button
              onClick={handleAction}
              disabled={waitingForScan}
              className={`rounded-2xl px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 ${
                checkedIn && !checkedOut ? 'bg-orange-500' : 'bg-primary'
              }`}
            >
              <div className='flex items-center gap-2'>
                {waitingForScan ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />

                    {buttonText}
                  </>
                ) : checkedIn && !checkedOut ? (
                  <>
                    <LogOut className='h-4 w-4' />
                    Check Out
                  </>
                ) : (
                  <>
                    <LogIn className='h-4 w-4' />
                    Check In
                  </>
                )}
              </div>
            </button>
          ) : (
            <div className='flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm text-muted-foreground'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              Done
            </div>
          )}
        </div>
      </div>

      {/* Success */}
      {!waitingForScan && attendance && (
        <div className='mt-3 flex items-center gap-2 text-xs text-green-600'>
          <Check className='h-4 w-4' />
          Attendance synced realtime
        </div>
      )}
    </div>
  )
}

export default function ScanQrCustomer({
  openCustomerDialog,
  setOpenCustomerDialog,
  customers,
  loading,
  setSelectedCustomer,
  setAction,
  setOpenQR
}: Props) {
  return (
    <Dialog open={openCustomerDialog} onOpenChange={setOpenCustomerDialog}>
      <DialogContent className='rounded-3xl sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>

          <DialogDescription>Select a customer to open their checkin / checkout QR</DialogDescription>
        </DialogHeader>

        <div className='max-h-[500px] space-y-3 overflow-y-auto pr-1'>
          {loading ? (
            <div className='py-10 text-center text-sm text-muted-foreground'>Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className='py-10 text-center text-sm text-muted-foreground'>No customers available.</div>
          ) : (
            customers.map((customer: any) => (
              <CustomerAttendanceCard
                key={customer.user_id}
                customer={customer}
                setSelectedCustomer={setSelectedCustomer}
                setAction={setAction}
                setOpenCustomerDialog={setOpenCustomerDialog}
                setOpenQR={setOpenQR}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
