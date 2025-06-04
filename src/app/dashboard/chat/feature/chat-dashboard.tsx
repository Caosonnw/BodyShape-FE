'use client'

import { Button } from '@/components/ui/button'
import { useMobile } from '@/hooks/use-mobile-for-chat'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { UserSidebar } from './user-sidebar'
import { ChatAdmin } from '@/app/dashboard/chat/feature/chat-admin'

export type Message = {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  status: 'online' | 'offline' | 'away'
}

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    lastMessage: 'Tôi cần hỗ trợ về sản phẩm',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    status: 'online'
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    lastMessage: 'Cảm ơn bạn đã hỗ trợ!',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 0,
    status: 'away'
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    email: 'cuong.le@email.com',
    lastMessage: 'Khi nào có thể giao hàng?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 1,
    status: 'online'
  },
  {
    id: '4',
    name: 'Phạm Thu Dung',
    email: 'dung.pham@email.com',
    lastMessage: 'Tôi muốn đổi trả sản phẩm',
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
    unreadCount: 3,
    status: 'offline'
  },
  {
    id: '5',
    name: 'Hoàng Văn Em',
    email: 'em.hoang@email.com',
    lastMessage: 'Làm sao để thanh toán?',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    status: 'online'
  }
]

const initialMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      content: 'Xin chào! Tôi cần hỗ trợ về sản phẩm của các bạn.',
      sender: 'user',
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: '1-2',
      content: 'Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?',
      sender: 'agent',
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: '1-3',
      content: 'Tôi cần hỗ trợ về sản phẩm',
      sender: 'user',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ],
  '2': [
    {
      id: '2-1',
      content: 'Cảm ơn bạn đã hỗ trợ tôi hôm qua!',
      sender: 'user',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '2-2',
      content: 'Rất vui được giúp đỡ bạn! Còn gì khác tôi có thể hỗ trợ không?',
      sender: 'agent',
      timestamp: new Date(Date.now() - 14 * 60 * 1000)
    }
  ],
  '3': [
    {
      id: '3-1',
      content: 'Khi nào có thể giao hàng?',
      sender: 'user',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
  ],
  '4': [
    {
      id: '4-1',
      content: 'Tôi muốn đổi trả sản phẩm vì không đúng size',
      sender: 'user',
      timestamp: new Date(Date.now() - 65 * 60 * 1000)
    },
    {
      id: '4-2',
      content: 'Tôi hiểu vấn đề của bạn. Chúng tôi có chính sách đổi trả trong 30 ngày.',
      sender: 'agent',
      timestamp: new Date(Date.now() - 62 * 60 * 1000)
    },
    {
      id: '4-3',
      content: 'Vậy tôi cần làm gì để đổi trả?',
      sender: 'user',
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ],
  '5': [
    {
      id: '5-1',
      content: 'Làm sao để thanh toán qua ví điện tử?',
      sender: 'user',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '5-2',
      content: 'Chúng tôi hỗ trợ thanh toán qua MoMo, ZaloPay và VNPay. Bạn muốn sử dụng ví nào?',
      sender: 'agent',
      timestamp: new Date(Date.now() - 118 * 60 * 1000)
    }
  ]
}

export function ChatDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<string>('1')
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [conversations, setConversations] = useState<Record<string, Message[]>>(initialMessages)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()

  const selectedUser = users.find((user) => user.id === selectedUserId)

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
    // Mark messages as read
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, unreadCount: 0 } : user)))
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleSendMessage = (content: string) => {
    if (!selectedUserId || !content.trim()) return

    const agentMessage: Message = {
      id: `${selectedUserId}-${Date.now()}`,
      content,
      sender: 'agent',
      timestamp: new Date()
    }

    setConversations((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), agentMessage]
    }))

    // Update user's last message
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUserId ? { ...user, lastMessage: content, lastMessageTime: new Date() } : user
      )
    )

    // Simulate customer response
    setTimeout(() => {
      const customerMessage: Message = {
        id: `${selectedUserId}-${Date.now() + 1}`,
        content: getCustomerResponse(content),
        sender: 'user',
        timestamp: new Date()
      }

      setConversations((prev) => ({
        ...prev,
        [selectedUserId]: [...(prev[selectedUserId] || []), customerMessage]
      }))

      // Update unread count for the customer
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUserId
            ? {
                ...user,
                unreadCount: user.unreadCount + 1,
                lastMessage: customerMessage.content,
                lastMessageTime: new Date()
              }
            : user
        )
      )
    }, 1500)
  }

  const getCustomerResponse = (agentInput: string): string => {
    const agentInputLower = agentInput.toLowerCase()

    if (agentInputLower.includes('chào') || agentInputLower.includes('hello')) {
      return 'Chào bạn! Cảm ơn bạn đã phản hồi nhanh.'
    } else if (agentInputLower.includes('giá') || agentInputLower.includes('199')) {
      return 'Giá này có thể giảm được không? Tôi đang so sánh với các nhà cung cấp khác.'
    } else if (agentInputLower.includes('giao hàng') || agentInputLower.includes('2-3 ngày')) {
      return 'Tôi ở Hà Nội, có thể giao nhanh hơn được không?'
    } else if (agentInputLower.includes('cảm ơn') || agentInputLower.includes('hỗ trợ')) {
      return 'Vâng, tôi còn muốn hỏi thêm về chính sách bảo hành.'
    } else if (agentInputLower.includes('bảo hành')) {
      return 'Bảo hành bao lâu vậy? Có bảo hành tại nhà không?'
    } else if (agentInputLower.includes('30 ngày') || agentInputLower.includes('đổi trả')) {
      return 'Vậy tôi cần giữ hóa đơn và hộp đựng phải không?'
    } else {
      return 'Tôi hiểu rồi. Cho tôi suy nghĩ thêm và sẽ liên hệ lại sau nhé.'
    }
  }

  return (
    <div className='flex h-screen w-full'>
      {/* Mobile menu button */}
      {isMobile && (
        <div className='fixed top-4 left-4 z-50'>
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
        ${isMobile ? 'w-80' : 'w-80'}
        border-r bg-background
      `}
      >
        <UserSidebar users={users} selectedUserId={selectedUserId} onUserSelect={handleUserSelect} />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className='fixed inset-0 bg-black/50 z-30' onClick={() => setSidebarOpen(false)} />
      )}

      {/* Chat area */}
      <div className='flex-1 flex flex-col'>
        {selectedUser ? (
          <ChatAdmin
            user={selectedUser}
            messages={conversations[selectedUserId] || []}
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
