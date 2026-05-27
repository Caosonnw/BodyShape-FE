'use client'

import { format } from 'date-fns'
import { CalendarDays, CheckCircle2, Clock3, QrCode, User, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateAttendanceMutation, useGetCheckinByTodayUser } from '@/queries/useCheckin'
import { useGetCoachCustomers } from '@/queries/useCoachCustomer'
import QrForCheckins from '@/app/dashboard/checkins/features_for_coach/qr_for_checkins'
import ScanQrCustomer from '@/app/dashboard/checkins/features_for_coach/scan_qr_customer'
import { useAlert } from '@/context/AlertContext'

interface Props {
  user_id: number
}

export default function ForCoach({ user_id }: Props) {
  const [openQR, setOpenQR] = useState(false)
  const [action, setAction] = useState<'checkin' | 'checkout'>('checkin')
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const { data } = useGetCheckinByTodayUser(user_id)
  const { data: customerData, isLoading: customerLoading } = useGetCoachCustomers(user_id)

  const customers = customerData?.payload.data || []
  const attendanceMutation = useCreateAttendanceMutation()
  const todayCheckin = data?.payload.data
  const checkedIn = !!todayCheckin?.checkin_time
  const checkedOut = !!todayCheckin?.checkout_time

  const { showAlert } = useAlert()

  const handleManualAttendance = async (type: 'checkin' | 'checkout') => {
    try {
      const response = await attendanceMutation.mutateAsync({
        userId: user_id,
        action: type
      })

      showAlert(
        response?.payload?.message || `${type === 'checkin' ? 'Check-in' : 'Check-out'} successful`,
        'success',
        {
          description:
            type === 'checkin' ? 'Coach has successfully checked in.' : 'Coach has successfully checked out.',
          duration: 3000
        }
      )
    } catch (error: any) {
      showAlert(error?.message || 'Something went wrong', 'error', {
        description: 'Attendance action failed.',
        duration: 3000
      })
    }
  }

  return (
    <div className='bg-muted/30 p-4 lg:p-0'>
      <div className='mx-auto max-w-7xl space-y-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Attendance Dashboard</h1>

            <p className='text-muted-foreground mt-1'>Manage checkin / checkout with QR code.</p>
          </div>
        </div>

        {/* Overview */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card className='rounded-3xl border-0 shadow-sm'>
            <CardContent className='flex items-center justify-between p-6'>
              <div>
                <p className='text-sm text-muted-foreground'>Today's Status</p>

                <h2 className='mt-2 text-2xl font-bold'>
                  {checkedOut ? 'Completed' : checkedIn ? 'Checked In' : 'Not Checked In'}
                </h2>
              </div>

              <div className='rounded-2xl bg-primary/10 p-4'>
                <CheckCircle2 className='size-8 text-primary' />
              </div>
            </CardContent>
          </Card>

          <Card className='rounded-3xl border-0 shadow-sm'>
            <CardContent className='flex items-center justify-between p-6'>
              <div>
                <p className='text-sm text-muted-foreground'>Checkin Time</p>

                <h2 className='mt-2 text-2xl font-bold'>
                  {todayCheckin?.checkin_time ? format(new Date(todayCheckin.checkin_time), 'HH:mm') : '--:--'}
                </h2>
              </div>

              <div className='rounded-2xl bg-green-500/10 p-4'>
                <Clock3 className='size-8 text-green-600' />
              </div>
            </CardContent>
          </Card>

          <Card className='rounded-3xl border-0 shadow-sm'>
            <CardContent className='flex items-center justify-between p-6'>
              <div>
                <p className='text-sm text-muted-foreground'>Checkout Time</p>

                <h2 className='mt-2 text-2xl font-bold'>
                  {todayCheckin?.checkout_time ? format(new Date(todayCheckin.checkout_time), 'HH:mm') : '--:--'}
                </h2>
              </div>

              <div className='rounded-2xl bg-orange-500/10 p-4'>
                <CalendarDays className='size-8 text-orange-600' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Layout */}
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Left */}
          <div className='space-y-6 lg:col-span-2'>
            <Card className='rounded-3xl border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='size-5' />
                  Attendance Information
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='rounded-2xl border bg-background p-5'>
                    <p className='text-sm text-muted-foreground'>User ID</p>

                    <h3 className='mt-2 text-xl font-semibold'>#{user_id}</h3>
                  </div>

                  <div className='rounded-2xl border bg-background p-5'>
                    <p className='text-sm text-muted-foreground'>Today</p>

                    <h3 className='mt-2 text-xl font-semibold'>{format(new Date(), 'dd/MM/yyyy')}</h3>
                  </div>
                </div>

                <div className='rounded-2xl border border-dashed p-5'>
                  <div className='flex items-start gap-3'>
                    {checkedOut ? (
                      <CheckCircle2 className='mt-1 size-5 text-green-600' />
                    ) : checkedIn ? (
                      <Clock3 className='mt-1 size-5 text-orange-500' />
                    ) : (
                      <XCircle className='mt-1 size-5 text-red-500' />
                    )}

                    <div>
                      <h4 className='font-semibold'>Today's Attendance</h4>

                      <p className='mt-1 text-sm text-muted-foreground'>
                        {checkedOut
                          ? 'You have completed checkin and checkout today.'
                          : checkedIn
                            ? 'You have checked in and are currently in your work shift / training session.'
                            : 'You have not checked in today.'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className='rounded-3xl border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <QrCode className='size-5' />
                  Attendance Actions
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className='grid gap-4 md:grid-cols-3'>
                  <Button
                    disabled={checkedIn || attendanceMutation.isPending}
                    className='h-28 rounded-3xl text-lg font-semibold'
                    onClick={() => handleManualAttendance('checkin')}
                  >
                    Checkin
                  </Button>

                  <Button
                    variant='secondary'
                    disabled={!checkedIn || checkedOut || attendanceMutation.isPending}
                    className='h-28 rounded-3xl text-lg font-semibold text-white'
                    onClick={() => handleManualAttendance('checkout')}
                  >
                    Checkout
                  </Button>

                  <Button
                    variant='outline'
                    className='h-28 rounded-3xl text-lg font-semibold'
                    onClick={() => setOpenCustomerDialog(true)}
                  >
                    Open Customer QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div>
            <Card className='sticky top-6 rounded-3xl border-0 shadow-sm'>
              <CardHeader>
                <CardTitle>Quick Guide</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4 text-sm text-muted-foreground'>
                <div className='rounded-2xl bg-muted p-4'>
                  <p className='font-medium text-foreground'>1. Checkin / Checkout</p>

                  <p className='mt-1'>Click the button to perform attendance for the coach.</p>
                </div>

                <div className='rounded-2xl bg-muted p-4'>
                  <p className='font-medium text-foreground'>2. Open Customer QR</p>

                  <p className='mt-1'>Select a customer to open their checkin QR.</p>
                </div>

                <div className='rounded-2xl bg-muted p-4'>
                  <p className='font-medium text-foreground'>3. Scan QR</p>

                  <p className='mt-1'>Customer uses the app to scan the QR attendance.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* QR Popup */}
      <QrForCheckins open={openQR} onOpenChange={setOpenQR} action={action} userId={selectedCustomer?.user_id} />

      {/* Customer Dialog */}
      <ScanQrCustomer
        openCustomerDialog={openCustomerDialog}
        setOpenCustomerDialog={setOpenCustomerDialog}
        customers={customers}
        loading={customerLoading}
        setSelectedCustomer={setSelectedCustomer}
        setAction={setAction}
        setOpenQR={setOpenQR}
      />
    </div>
  )
}
