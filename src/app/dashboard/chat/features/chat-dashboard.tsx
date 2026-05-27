'use client'

import { Button } from '@/components/ui/button'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { useMobile } from '@/hooks/use-mobile-for-chat'
import { usePresenceWatch } from '@/hooks/use-presence-watch'
import { useAccountMe, useGetAllUsers } from '@/queries/useUser'
import { useGetAllCoachCustomers } from '@/queries/useCoachCustomer'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChatAdmin } from './chat-admin'
import { UserSidebar } from './user-sidebar'

export type User = {
  user_id: number
  full_name: string
  email: string
  phone_number: string
  gender: boolean
  avatar?: string
  date_of_birth: string
  role: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  status: 'ONLINE' | 'OFFLINE'
}

export type Message = {
  id: string
  content: string
  sender: User
  timestamp: Date
}

type SocketMessagePayload = {
  message: {
    message_id: number
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

export function ChatDashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken'))
    }
  }, [])

  // =========================
  // ME
  // =========================
  const { data: meData } = useAccountMe(accessToken || undefined)

  const me: User | null = useMemo(() => {
    const api = (meData as any)?.payload?.data
    if (!api) return null

    return {
      user_id: api.user_id,
      full_name: api.full_name ?? 'You',
      email: api.email ?? '',
      phone_number: api.phone_number ?? '',
      gender: Boolean(api.gender),
      avatar: api.avatar ?? undefined,
      date_of_birth: api.date_of_birth ?? '',
      role: api.role ?? 'USER',
      unreadCount: 0,
      status: 'OFFLINE'
    }
  }, [meData])

  const role = me?.role?.toUpperCase()
  const isCoachOrCustomer = role === 'COACH' || role === 'CUSTOMER'

  // =========================
  // USERS (base data, no realtime status yet)
  // =========================
  const { data: coachCustomerData, isLoading: coachCustomerLoading } = useGetAllCoachCustomers(
    !!me && isCoachOrCustomer
  )

  const { data: allUsersData, isLoading: allUsersLoading } = useGetAllUsers(!!me && !isCoachOrCustomer)

  // Base users list — status ở đây chỉ là fallback, sẽ bị override bởi presence
  const [baseUsers, setBaseUsers] = useState<Omit<User, 'status'>[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [conversations, setConversations] = useState<Record<string, Message[]>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isMobile = useMobile()

  // =========================
  // PRESENCE — watch toàn bộ danh sách users
  // =========================
  const userIds = useMemo(() => baseUsers.map((u) => u.user_id), [baseUsers])

  const presenceMap = usePresenceWatch(accessToken, userIds)

  // Merge baseUsers + presenceMap → users với status realtime
  const users: User[] = useMemo(
    () =>
      baseUsers.map((u) => ({
        ...u,
        status: presenceMap[u.user_id] ?? 'OFFLINE'
      })),
    [baseUsers, presenceMap]
  )

  // Use refs to get latest values inside socket callbacks without stale closure
  const meRef = useRef(me)
  const usersRef = useRef(users)
  const selectedUserIdRef = useRef(selectedUserId)

  meRef.current = me
  usersRef.current = users
  selectedUserIdRef.current = selectedUserId

  // =========================
  // CHAT SOCKET
  // onUserOnline / onUserOffline đã được handle bởi presenceMap bên trên
  // giữ lại ở đây chỉ để tương thích nếu chat gateway cũng broadcast
  // =========================
  const { sendMessage, joinConversation, markAsSeen } = useChatSocket({
    token: accessToken,

    onNewMessage: useCallback(({ message, conversation }: SocketMessagePayload) => {
      const currentMe = meRef.current
      const currentUsers = usersRef.current
      const currentSelectedUserId = selectedUserIdRef.current

      if (!currentMe) return

      const isMe = message.sender_id === currentMe.user_id

      const targetUserId = isMe
        ? currentSelectedUserId
        : conversation.user_low_id === currentMe.user_id
          ? conversation.user_high_id
          : conversation.user_low_id

      if (!targetUserId) return

      const sender: User | undefined = isMe ? currentMe : currentUsers.find((u) => u.user_id === targetUserId)

      if (!sender) return

      setConversationId(conversation.conversation_id)

      setConversations((prev) => {
        const key = String(targetUserId)
        const old = prev[key] || []

        const filtered = old.filter(
          (m) => !(m.id.startsWith('temp-') && m.content === message.content && m.sender.user_id === sender.user_id)
        )

        if (filtered.some((m) => m.id === String(message.message_id))) {
          return prev
        }

        return {
          ...prev,
          [key]: [
            ...filtered,
            {
              id: String(message.message_id),
              content: message.content,
              sender,
              timestamp: new Date(message.created_at)
            }
          ]
        }
      })

      setBaseUsers((prev) =>
        prev.map((u) => {
          if (u.user_id !== targetUserId) return u

          const isActiveChat = selectedUserIdRef.current === targetUserId

          return {
            ...u,
            lastMessage: message.content,
            lastMessageTime: new Date(message.created_at),
            unreadCount: isMe ? u.unreadCount : isActiveChat ? 0 : u.unreadCount + 1
          }
        })
      )
    }, [])
  })

  // =========================
  // LOAD USERS
  // =========================
  useEffect(() => {
    if (!me) return

    if (isCoachOrCustomer) {
      const apiUsers = (coachCustomerData as any)?.payload?.data
      if (!apiUsers) return

      const seen = new Set<number>()

      const formatted = apiUsers
        .map((item: any) => {
          const isCoach = me.user_id === item.coach_id
          const target = isCoach ? item.customer : item.coach
          if (!target) return null

          return {
            user_id: target.user_id,
            full_name: target.full_name ?? '',
            email: target.email ?? '',
            phone_number: target.phone_number ?? '',
            gender: Boolean(target.gender),
            avatar: target.avatar ?? undefined,
            date_of_birth: target.date_of_birth ?? '',
            role: isCoach ? 'CUSTOMER' : 'COACH',
            unreadCount: 0,
            lastMessage: undefined,
            lastMessageTime: undefined
          }
        })
        .filter((u: any) => {
          if (!u) return false
          if (seen.has(u.user_id)) return false
          seen.add(u.user_id)
          return true
        })

      // Merge để giữ unreadCount / lastMessage đã có
      setBaseUsers((prev) => {
        const prevMap = new Map(prev.map((u) => [u.user_id, u]))
        return formatted.map((u: any) => {
          const existing = prevMap.get(u.user_id)
          return existing
            ? {
                ...u,
                unreadCount: existing.unreadCount,
                lastMessage: existing.lastMessage,
                lastMessageTime: existing.lastMessageTime
              }
            : u
        })
      })
    } else {
      const apiUsers = (allUsersData as any)?.payload?.data
      if (!apiUsers) return

      const formatted = apiUsers
        .filter((u: any) => u.user_id !== me.user_id)
        .map((u: any) => ({
          user_id: u.user_id,
          full_name: u.full_name ?? '',
          email: u.email ?? '',
          phone_number: u.phone_number ?? '',
          gender: Boolean(u.gender),
          avatar: u.avatar ?? undefined,
          date_of_birth: u.date_of_birth ?? '',
          role: u.role ?? 'USER',
          unreadCount: 0,
          lastMessage: undefined,
          lastMessageTime: undefined
        }))

      setBaseUsers((prev) => {
        const prevMap = new Map(prev.map((u) => [u.user_id, u]))
        return formatted.map((u: any) => {
          const existing = prevMap.get(u.user_id)
          return existing
            ? {
                ...u,
                unreadCount: existing.unreadCount,
                lastMessage: existing.lastMessage,
                lastMessageTime: existing.lastMessageTime
              }
            : u
        })
      })
    }
  }, [coachCustomerData, allUsersData, me, isCoachOrCustomer])

  // =========================
  // SELECT USER
  // =========================
  const handleUserSelect = useCallback(
    async (userId: number) => {
      setSelectedUserId(userId)

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/chat/conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ targetUserId: userId })
        })

        if (!res.ok) throw new Error('Failed to get/create conversation')

        const result = await res.json()
        const conversation = result.data

        setConversationId(conversation.conversation_id)
        joinConversation(conversation.conversation_id)

        const msgRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/chat/${conversation.conversation_id}/messages`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )

        if (!msgRes.ok) throw new Error('Failed to fetch messages')

        const msgResult = await msgRes.json()

        const formatted: Message[] = msgResult.data
          .map((m: any) => {
            const sender = m.sender_id === me?.user_id ? me! : usersRef.current.find((u) => u.user_id === m.sender_id)

            if (!sender) return null

            return {
              id: String(m.message_id),
              content: m.content,
              sender,
              timestamp: new Date(m.created_at)
            }
          })
          .filter(Boolean) as Message[]

        setConversations((prev) => ({ ...prev, [String(userId)]: formatted }))

        setBaseUsers((prev) => prev.map((u) => (u.user_id === userId ? { ...u, unreadCount: 0 } : u)))

        if (isMobile) setSidebarOpen(false)
      } catch (err) {
        console.error('handleUserSelect error:', err)
      }
    },
    [accessToken, me, isMobile, joinConversation]
  )

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedUserId || !me) return

      const temp: Message = {
        id: `temp-${Date.now()}`,
        content,
        sender: me,
        timestamp: new Date()
      }

      setConversations((prev) => ({
        ...prev,
        [String(selectedUserId)]: [...(prev[String(selectedUserId)] || []), temp]
      }))

      sendMessage(selectedUserId, content)
    },
    [selectedUserId, me, sendMessage]
  )

  // =========================
  // MARK AS SEEN
  // =========================
  const lastSeenMessageIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!conversationId || !selectedUserId) return

    const msgs = conversations[String(selectedUserId)]
    if (!msgs?.length) return

    const last = msgs[msgs.length - 1]

    if (last.sender.user_id !== me?.user_id && last.id !== lastSeenMessageIdRef.current) {
      lastSeenMessageIdRef.current = last.id
      markAsSeen(conversationId, Number(last.id))
    }
  }, [conversations, selectedUserId, conversationId, me?.user_id, markAsSeen])

  useEffect(() => {
    lastSeenMessageIdRef.current = null
  }, [selectedUserId])

  const isLoading = isCoachOrCustomer ? coachCustomerLoading : allUsersLoading

  const selectedUser = useMemo(() => users.find((u) => u.user_id === selectedUserId) ?? null, [users, selectedUserId])

  // =========================
  // UI
  // =========================
  return (
    <div className='flex h-screen w-full'>
      {isMobile && (
        <div className='fixed top-4 right-4 z-50'>
          <Button variant='outline' size='icon' onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      )}

      <div
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'} ${
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
        } w-80 border-r bg-background transition-transform`}
      >
        <UserSidebar users={users} selectedUserId={selectedUserId || 0} onUserSelect={handleUserSelect} />
      </div>

      {isMobile && sidebarOpen && (
        <div className='fixed inset-0 bg-black/50 z-30' onClick={() => setSidebarOpen(false)} />
      )}

      <div className='flex-1 flex flex-col'>
        {isLoading ? (
          <div className='flex-1 flex items-center justify-center'>Loading users...</div>
        ) : selectedUser ? (
          <ChatAdmin
            me={me!}
            user={selectedUser}
            messages={conversations[String(selectedUserId)] || []}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className='flex-1 flex items-center justify-center text-muted-foreground'>
            Choose a user to start chatting
          </div>
        )}
      </div>
    </div>
  )
}
