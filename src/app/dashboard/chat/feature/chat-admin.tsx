'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { ChatMessage } from './chat-message'
import type { User, Message } from './chat-dashboard'
import { useMobile } from '@/hooks/use-mobile-for-chat'

interface ChatProps {
  user: User
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function ChatAdmin({ user, messages, onSendMessage }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return
    onSendMessage(input)
    setInput('')
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'Đang trực tuyến'
      case 'away':
        return 'Vắng mặt'
      case 'offline':
        return 'Ngoại tuyến'
      default:
        return 'Không xác định'
    }
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Chat header */}
      <div className='p-4 border-b bg-background'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <div className='h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center'>
              <span className='text-sm font-medium'>{user.name.split(' ').pop()?.charAt(0)}</span>
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                user.status
              )}`}
            />
          </div>
          <div>
            <h2 className='font-semibold'>{user.name}</h2>
            <p className='text-sm text-muted-foreground'>{getStatusText(user.status)}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col space-y-4'>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-muted-foreground'>Chưa có tin nhắn nào</p>
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className='p-4 border-t bg-background'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className='flex gap-2'
        >
          <Input
            placeholder='Nhập phản hồi cho khách hàng...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1'
          />
          <Button type='submit' size={isMobile ? 'icon' : 'default'}>
            {isMobile ? (
              <Send className='h-4 w-4' />
            ) : (
              <>
                Gửi <Send className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
