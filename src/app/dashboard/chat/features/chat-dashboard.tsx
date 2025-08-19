'use client'

import { Button } from '@/components/ui/button'
import { useMobile } from '@/hooks/use-mobile-for-chat'
import { Menu, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UserSidebar } from './user-sidebar'
import { ChatAdmin } from './chat-admin'
import { useAccountMe } from '@/queries/useUser'

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
  status: 'online' | 'offline'
}

export type Message = {
  id: string
  content: string
  sender: User
  timestamp: Date
}

/** Mock data cho sidebar */
const sampleUsers: User[] = [
  {
    user_id: 1,
    full_name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone_number: '0901000001',
    gender: true,
    avatar: undefined,
    date_of_birth: '1990-01-01',
    role: 'CUSTOMER',
    lastMessage: 'Tôi cần hỗ trợ về sản phẩm',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 1,
    status: 'online'
  },
  {
    user_id: 2,
    full_name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone_number: '0901000002',
    gender: false,
    avatar: undefined,
    date_of_birth: '1992-02-02',
    role: 'CUSTOMER',
    lastMessage: 'Cảm ơn bạn đã hỗ trợ!',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 0,
    status: 'offline'
  },
  {
    user_id: 3,
    full_name: 'Lê Minh Cường',
    email: 'cuong.le@email.com',
    phone_number: '0901000003',
    gender: true,
    avatar: undefined,
    date_of_birth: '1988-03-03',
    role: 'CUSTOMER',
    lastMessage: 'Khi nào có thể giao hàng?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 1,
    status: 'online'
  },
  {
    user_id: 4,
    full_name: 'Phạm Thu Dung',
    email: 'dung.pham@email.com',
    phone_number: '0901000004',
    gender: false,
    avatar: undefined,
    date_of_birth: '1995-04-04',
    role: 'CUSTOMER',
    lastMessage: 'Tôi muốn đổi trả sản phẩm',
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
    unreadCount: 3,
    status: 'offline'
  },
  {
    user_id: 5,
    full_name: 'Hoàng Văn Em',
    email: 'em.hoang@email.com',
    phone_number: '0901000005',
    gender: true,
    avatar: undefined,
    date_of_birth: '1993-05-05',
    role: 'CUSTOMER',
    lastMessage: '',
    lastMessageTime: undefined,
    unreadCount: 0,
    status: 'online'
  }
]

/** Mock dữ liệu hội thoại */
const initialMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      content: 'Xin chào! Tôi cần hỗ trợ về sản phẩm của các bạn.',
      sender: sampleUsers[0],
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: '1-2',
      content: 'Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?',
      sender: {
        user_id: 999,
        full_name: 'Admin',
        email: 'admin@email.com',
        phone_number: '',
        gender: true,
        avatar: undefined,
        date_of_birth: '',
        role: 'ADMIN',
        lastMessage: '',
        lastMessageTime: undefined,
        unreadCount: 0,
        status: 'online'
      },
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: '1-3',
      content: 'Tôi cần hỗ trợ về sản phẩm',
      sender: sampleUsers[0],
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ],
  '2': [
    {
      id: '2-1',
      content: 'Cảm ơn bạn đã hỗ trợ tôi hôm qua!',
      sender: sampleUsers[1],
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '2-2',
      content: 'Rất vui được giúp đỡ bạn! Còn gì khác tôi có thể hỗ trợ không?',
      sender: {
        user_id: 999,
        full_name: 'Admin',
        email: 'admin@email.com',
        phone_number: '',
        gender: true,
        avatar: undefined,
        date_of_birth: '',
        role: 'ADMIN',
        lastMessage: '',
        lastMessageTime: undefined,
        unreadCount: 0,
        status: 'online'
      },
      timestamp: new Date(Date.now() - 14 * 60 * 1000)
    }
  ],
  '3': [
    {
      id: '3-1',
      content: 'Khi nào có thể giao hàng?',
      sender: sampleUsers[2],
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
  ],
  '4': [
    {
      id: '4-1',
      content: 'Tôi muốn đổi trả sản phẩm vì không đúng size',
      sender: sampleUsers[3],
      timestamp: new Date(Date.now() - 65 * 60 * 1000)
    },
    {
      id: '4-2',
      content: 'Tôi hiểu vấn đề của bạn. Chúng tôi có chính sách đổi trả trong 30 ngày.',
      sender: {
        user_id: 999,
        full_name: 'Admin',
        email: 'admin@email.com',
        phone_number: '',
        gender: true,
        avatar: undefined,
        date_of_birth: '',
        role: 'ADMIN',
        lastMessage: '',
        lastMessageTime: undefined,
        unreadCount: 0,
        status: 'online'
      },
      timestamp: new Date(Date.now() - 62 * 60 * 1000)
    },
    {
      id: '4-3',
      content: 'Vậy tôi cần làm gì để đổi trả?',
      sender: sampleUsers[3],
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ],
  '5': []
}

export function ChatDashboard() {
  // Lấy accessToken (client-only)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken'))
    }
  }, [])

  // Lấy thông tin user đang đăng nhập
  const { data } = useAccountMe(accessToken)

  // Chuẩn hoá payload `/me` sang shape User của FE
  const me: User | null = useMemo(() => {
    const api = (data as any)?.payload?.data as any | undefined
    if (!api) return null
    return {
      user_id: api.user_id,
      full_name: api.full_name ?? 'You',
      email: api.email ?? '',
      phone_number: api.phone_number ?? '',
      gender: Boolean(api.gender),
      avatar: api.avatar ?? undefined,
      date_of_birth: api.date_of_birth ?? '',
      role: api.role ?? 'ADMIN',
      lastMessage: '',
      lastMessageTime: undefined,
      unreadCount: 0,
      status: String(api.status || 'offline').toLowerCase() === 'online' ? 'online' : 'offline'
    }
  }, [data])

  const [selectedUserId, setSelectedUserId] = useState<number>(0)
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [conversations, setConversations] = useState<Record<string, Message[]>>(initialMessages)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()

  const selectedUser = users.find((user) => user.user_id === selectedUserId) || null

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId)
    // Đánh dấu đã đọc
    setUsers((prev) => prev.map((user) => (user.user_id === userId ? { ...user, unreadCount: 0 } : user)))
    if (isMobile) setSidebarOpen(false)
  }

  const handleSendMessage = (content: string) => {
    if (!selectedUserId || !content.trim() || !me) return

    const agentMessage: Message = {
      id: `${selectedUserId}-${Date.now()}`,
      content,
      sender: me,
      timestamp: new Date()
    }

    setConversations((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), agentMessage]
    }))

    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === selectedUserId ? { ...user, lastMessage: content, lastMessageTime: new Date() } : user
      )
    )
  }

  return (
    <div className='flex h-screen w-full'>
      {/* Nút mở/đóng sidebar trên mobile */}
      {isMobile && (
        <div className='fixed top-4 right-4 z-50'>
          <Button variant='outline' size='icon' onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className='h-4 w-4' /> : <Menu className='h-4 w-4' />}
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-80 border-r bg-background
        `}
      >
        <UserSidebar users={users} selectedUserId={selectedUserId} onUserSelect={handleUserSelect} />
      </div>

      {/* Overlay khi mở sidebar trên mobile */}
      {isMobile && sidebarOpen && (
        <div className='fixed inset-0 bg-black/50 z-30' onClick={() => setSidebarOpen(false)} />
      )}

      {/* Khu vực chat */}
      <div className='flex-1 flex flex-col'>
        {selectedUser ? (
          <ChatAdmin
            me={
              me || {
                user_id: 0,
                full_name: 'Loading…',
                email: '',
                phone_number: '',
                gender: true,
                date_of_birth: '',
                role: 'ADMIN',
                unreadCount: 0,
                status: 'online'
              }
            }
            user={selectedUser}
            messages={conversations[String(selectedUserId)] || []}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <p className='text-muted-foreground'>Choose a customer to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
