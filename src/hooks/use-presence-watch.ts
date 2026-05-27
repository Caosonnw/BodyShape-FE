'use client'

import { Status } from '@/types/types'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

/**
 * Watch presence status của nhiều users cùng lúc.
 *
 * - Kết nối 1 lần đến /presence socket khi token sẵn sàng
 * - Khi userIds thay đổi → emit presence:watch cho các id mới
 * - Trả về map { [userId]: 'ONLINE' | 'OFFLINE' }
 */
export function usePresenceWatch(token: string | null, userIds: number[]): Record<number, Status> {
  const socketRef = useRef<Socket | null>(null)
  const [statusMap, setStatusMap] = useState<Record<number, Status>>({})
  const watchedIdsRef = useRef<Set<number>>(new Set())

  // ─── Khởi tạo socket một lần khi có token ───────────────────────────────
  useEffect(() => {
    if (!token) return

    const socket = io(process.env.NEXT_PUBLIC_PORT_SOCKET + '/presence', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })
    socketRef.current = socket

    socket.on('connect', () => {
      // Re-watch tất cả ids đang track sau khi reconnect
      const ids = Array.from(watchedIdsRef.current)
      if (ids.length > 0) {
        socket.emit('presence:watch', { userIds: ids })
      }
    })

    // Nhận snapshot trạng thái hiện tại: { [userId]: 'ONLINE' | 'OFFLINE' }
    socket.on('presence:now', (map: Record<number, Status>) => {
      setStatusMap((prev) => ({ ...prev, ...map }))
    })

    // Nhận update realtime khi 1 user thay đổi trạng thái
    socket.on('presence:update', ({ userId, status }: { userId: number; status: Status }) => {
      setStatusMap((prev) => ({ ...prev, [userId]: status }))
    })

    socket.on('presence:error', (e: any) => console.error('[presence] error', e))

    return () => {
      socket.disconnect()
      socketRef.current = null
      watchedIdsRef.current.clear()
    }
  }, [token])

  // ─── Khi danh sách userIds thay đổi → watch các id mới ──────────────────
  useEffect(() => {
    if (!socketRef.current || userIds.length === 0) return

    const newIds = userIds.filter((id) => !watchedIdsRef.current.has(id))
    if (newIds.length === 0) return

    newIds.forEach((id) => watchedIdsRef.current.add(id))

    // Chỉ emit nếu socket đang connected
    if (socketRef.current.connected) {
      socketRef.current.emit('presence:watch', { userIds: newIds })
    }
    // Nếu chưa connected, handler 'connect' ở trên sẽ re-watch toàn bộ
  }, [userIds])

  return statusMap
}
