'use client'

import { Status } from '@/types/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSelfPresence(token: string | null, userId?: number, initial?: Status) {
  const socketRef = useRef<Socket | null>(null)
  const [status, setStatus] = useState<Status | undefined>(initial)

  useEffect(() => {
    // nếu chưa có token hoặc userId, bỏ qua
    if (!token || !userId) return

    const socket = io(process.env.NEXT_PUBLIC_PORT_SOCKET + '/presence', { auth: { token } })
    socketRef.current = socket

    const handleNow = (map: Record<number, Status>) => {
      if (map[userId]) setStatus(map[userId])
    }
    const handleUpdate = ({ userId: uid, status }: { userId: number; status: Status }) => {
      if (uid === userId) setStatus(status)
    }

    socket.on('connect', () => {
      socket.emit('presence:watch', { userIds: [userId] })
    })
    socket.on('presence:now', handleNow)
    socket.on('presence:update', handleUpdate)
    socket.on('presence:error', (e) => console.error('presence error', e))

    const onPageHide = () => socket.disconnect()
    window.addEventListener('pagehide', onPageHide)
    window.addEventListener('beforeunload', onPageHide)

    return () => {
      window.removeEventListener('pagehide', onPageHide)
      window.removeEventListener('beforeunload', onPageHide)
      socket.off('presence:now', handleNow)
      socket.off('presence:update', handleUpdate)
      socket.disconnect()
    }
  }, [token, userId])

  // Nếu chưa có realtime trả về thì dùng initial từ getMe
  const effective = useMemo<Status | undefined>(() => status ?? initial, [status, initial])
  return effective
}
