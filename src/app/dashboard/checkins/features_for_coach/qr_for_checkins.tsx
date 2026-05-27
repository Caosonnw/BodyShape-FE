'use client'

import QRCode from 'react-qr-code'

import { useEffect, useMemo, useState, useCallback } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Badge } from '@/components/ui/badge'

import { CheckCircle2 } from 'lucide-react'

import { AnimatePresence, motion } from 'framer-motion'

import { useCheckinSocket } from '@/hooks/use-checkin-socket'

export default function QrForCheckins({
  open,
  onOpenChange,
  action,
  userId
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: 'checkin' | 'checkout'
  userId: number
}) {
  const [success, setSuccess] = useState(false)

  const qrValue = useMemo(() => {
    return JSON.stringify({
      userId,
      action
    })
  }, [userId, action])

  const handleAttendanceUpdated = useCallback(
    (payload: any) => {
      console.log('🔥 SOCKET RECEIVED:', payload)

      if (payload.userId !== userId) return

      setSuccess(true)

      setTimeout(() => {
        onOpenChange(false)

        setTimeout(() => {
          setSuccess(false)
        }, 300)
      }, 1800)
    },
    [userId, onOpenChange]
  )

  useCheckinSocket(handleAttendanceUpdated)

  useEffect(() => {
    if (!open) {
      setSuccess(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden rounded-3xl sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl'>
            {action === 'checkin' ? 'QR Checkin' : 'QR Checkout'}
          </DialogTitle>

          <DialogDescription className='text-center'>Use the mobile app to scan QR attendance.</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode='wait'>
          {!success ? (
            <motion.div
              key='qr'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className='flex flex-col items-center justify-center py-6'
            >
              <motion.div
                animate={{
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
                className='rounded-3xl bg-white p-6 shadow-sm'
              >
                <QRCode value={qrValue} size={250} />
              </motion.div>

              <div className='mt-6 text-center'>
                <Badge className='rounded-full px-4 py-2 text-sm'>{action.toUpperCase()}</Badge>

                <p className='mt-3 text-sm text-muted-foreground'>User ID: #{userId}</p>

                <div className='mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                  Waiting for customer scan...
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key='success'
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 18
              }}
              className='flex flex-col items-center justify-center py-16'
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: 'spring',
                  stiffness: 300
                }}
              >
                <CheckCircle2 className='h-28 w-28 text-green-600' />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='mt-5 text-3xl font-bold text-green-600'
              >
                Success
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='mt-2 text-sm text-muted-foreground'
              >
                Attendance updated successfully
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
