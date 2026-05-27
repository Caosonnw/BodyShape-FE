// hooks/use-checkin-socket.ts

'use client'

import { useEffect, useRef } from 'react'

import { checkinSocket } from '@/lib/checkin-socket'

export type AttendanceSocketPayload = {
  userId: number

  action: 'checkin' | 'checkout'

  checkin: {
    checkin_id: number
    user_id: number
    checkin_time: string | null
    checkout_time: string | null
  }
}

export function useCheckinSocket(onAttendanceUpdated?: (payload: AttendanceSocketPayload) => void) {
  const callbackRef = useRef(onAttendanceUpdated)

  callbackRef.current = onAttendanceUpdated

  useEffect(() => {
    // force connect nếu chưa connect
    if (!checkinSocket.connected) {
      checkinSocket.connect()
    }

    const handleConnect = () => {
      console.log('✅ Checkin socket connected:', checkinSocket.id)
    }

    const handleDisconnect = (reason: string) => {
      console.log('❌ Checkin socket disconnected:', reason)
    }

    const handleError = (err: Error) => {
      console.log('❌ SOCKET ERROR:', err.message)
    }

    const handleAttendanceUpdated = (payload: AttendanceSocketPayload) => {
      console.log('🔥 SOCKET RECEIVED:', payload)

      callbackRef.current?.(payload)
    }

    // listeners
    checkinSocket.on('connect', handleConnect)

    checkinSocket.on('disconnect', handleDisconnect)

    checkinSocket.on('connect_error', handleError)

    checkinSocket.on('attendance-updated', handleAttendanceUpdated)

    // nếu socket đã connect trước khi listener mount
    if (checkinSocket.connected) {
      console.log('✅ Already connected:', checkinSocket.id)
    }

    return () => {
      checkinSocket.off('connect', handleConnect)

      checkinSocket.off('disconnect', handleDisconnect)

      checkinSocket.off('connect_error', handleError)

      checkinSocket.off('attendance-updated', handleAttendanceUpdated)
    }
  }, [])
}
