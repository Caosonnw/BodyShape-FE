// lib/checkin-socket.ts

'use client'

import { io } from 'socket.io-client'

export const checkinSocket = io(`${process.env.NEXT_PUBLIC_PORT_SOCKET}/checkins`, {
  autoConnect: false,

  transports: ['websocket'],

  reconnection: true,

  reconnectionAttempts: 10,

  reconnectionDelay: 1000
})
