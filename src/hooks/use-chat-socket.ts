// hooks/use-chat-socket.ts
'use client'

import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

type NewMessagePayload = {
  conversationId: number
  message: {
    message_id: number
    conversation_id: number
    sender_id: number
    content: string
    created_at: string
  }
  conversation: {
    conversation_id: number
    user_low_id: number
    user_high_id: number
  }
}

type Props = {
  token: string | null
  onNewMessage?: (data: NewMessagePayload) => void
  onSeen?: (data: { conversationId: number; userId: number; messageId: number }) => void
  onTypingStart?: (data: { conversationId: number; userId: number }) => void
  onTypingStop?: (data: { conversationId: number; userId: number }) => void
  onUserOnline?: (data: { userId: number }) => void
  onUserOffline?: (data: { userId: number }) => void
  onConversationUpdated?: (data: any) => void
}

export function useChatSocket({
  token,
  onNewMessage,
  onSeen,
  onTypingStart,
  onTypingStop,
  onUserOnline,
  onUserOffline,
  onConversationUpdated
}: Props) {
  const socketRef = useRef<Socket | null>(null)

  // Store callbacks in refs so socket listeners always call the latest version
  // without needing to re-register (avoids stale closure bug)
  const onNewMessageRef = useRef(onNewMessage)
  const onSeenRef = useRef(onSeen)
  const onTypingStartRef = useRef(onTypingStart)
  const onTypingStopRef = useRef(onTypingStop)
  const onUserOnlineRef = useRef(onUserOnline)
  const onUserOfflineRef = useRef(onUserOffline)
  const onConversationUpdatedRef = useRef(onConversationUpdated)

  // Keep refs up to date on every render
  onNewMessageRef.current = onNewMessage
  onSeenRef.current = onSeen
  onTypingStartRef.current = onTypingStart
  onTypingStopRef.current = onTypingStop
  onUserOnlineRef.current = onUserOnline
  onUserOfflineRef.current = onUserOffline
  onConversationUpdatedRef.current = onConversationUpdated

  useEffect(() => {
    if (!token) return

    const socket = io(`${process.env.NEXT_PUBLIC_PORT_SOCKET}/chat`, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('✅ Chat socket connected:', socket.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Chat socket disconnected:', reason)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message)
    })

    // Gateway emits: { conversationId, message, conversation }
    socket.on('message:new', (data: NewMessagePayload) => {
      onNewMessageRef.current?.(data)
    })

    socket.on('conversation:updated', (data: any) => {
      onConversationUpdatedRef.current?.(data)
    })

    socket.on('message:seen:update', (data: any) => {
      onSeenRef.current?.(data)
    })

    socket.on('typing:start', (data: any) => {
      onTypingStartRef.current?.(data)
    })

    socket.on('typing:stop', (data: any) => {
      onTypingStopRef.current?.(data)
    })

    socket.on('user:online', (data: any) => {
      onUserOnlineRef.current?.(data)
    })

    socket.on('user:offline', (data: any) => {
      onUserOfflineRef.current?.(data)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token]) // Only re-connect when token changes

  // =========================================================
  // ACTIONS
  // =========================================================

  const sendMessage = useCallback((receiverId: number, content: string) => {
    socketRef.current?.emit('message:send', { receiverId, content })
  }, [])

  const joinConversation = useCallback((conversationId: number) => {
    socketRef.current?.emit('conversation:join', { conversationId })
  }, [])

  const leaveConversation = useCallback((conversationId: number) => {
    socketRef.current?.emit('conversation:leave', { conversationId })
  }, [])

  const markAsSeen = useCallback((conversationId: number, messageId: number) => {
    socketRef.current?.emit('message:seen', { conversationId, messageId })
  }, [])

  const typingStart = useCallback((conversationId: number) => {
    socketRef.current?.emit('typing:start', { conversationId })
  }, [])

  const typingStop = useCallback((conversationId: number) => {
    socketRef.current?.emit('typing:stop', { conversationId })
  }, [])

  return {
    socket: socketRef.current,
    sendMessage,
    joinConversation,
    leaveConversation,
    markAsSeen,
    typingStart,
    typingStop
  }
}
