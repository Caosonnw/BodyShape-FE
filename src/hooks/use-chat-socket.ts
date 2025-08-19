'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useChatRealTime(token: string | null, userId?: number) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!token || !userId) return

    const socket = io(process.env.NEXT_PUBLIC_PORT_SOCKET + '/chat', { auth: { token } })
    socketRef.current = socket
  }, [token, userId])
}
