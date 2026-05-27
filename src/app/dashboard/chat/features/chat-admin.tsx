'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send } from 'lucide-react'
import { ChatMessage } from './chat-message'
import type { User, Message } from './chat-dashboard'
import { useMobile } from '@/hooks/use-mobile-for-chat'

interface ChatProps {
  me: User
  user: User
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function ChatAdmin({ me, user, messages, onSendMessage }: ChatProps) {
  const [input, setInput] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isMobile = useMobile()

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant'
    })
  }

  useEffect(() => {
    scrollToBottom(messages.length > 1)
  }, [messages])

  const handleSendMessage = () => {
    const trimmed = input.trim()

    if (!trimmed) return

    onSendMessage(trimmed)

    setInput('')
  }

  const getStatusColor = (status: User['status']) => (status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400')

  const getStatusText = (status: User['status']) => (status === 'ONLINE' ? 'Online' : 'Offline')

  function getInitials(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 3)
      .toUpperCase()
  }

  const avatarSrc = user?.avatar ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}` : undefined

  return (
    <div className='flex flex-col h-full'>
      {/* HEADER */}
      <div className='p-4 border-b bg-background'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={avatarSrc} alt={user.full_name} />

              <AvatarFallback className='text-sm font-medium'>{getInitials(user.full_name)}</AvatarFallback>
            </Avatar>

            {/* STATUS */}
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                user.status
              )}`}
            />
          </div>

          <div>
            <h2 className='font-semibold'>{user.full_name}</h2>

            <p className='text-sm text-muted-foreground'>{getStatusText(user.status)}</p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col space-y-4'>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-muted-foreground'>Chưa có tin nhắn nào</p>
          </div>
        ) : (
          messages.map((message) => <ChatMessage me={me} key={message.id} message={message} user={user} />)
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className='p-4 border-t bg-background'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className='flex gap-2'
        >
          <Input
            placeholder='Enter your message ...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1'
          />

          <Button type='submit' size={isMobile ? 'icon' : 'default'} disabled={!input.trim()}>
            {isMobile ? (
              <Send className='h-4 w-4' />
            ) : (
              <>
                Send <Send className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
