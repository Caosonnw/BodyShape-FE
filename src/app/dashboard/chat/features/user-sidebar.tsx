'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import type { User } from './chat-dashboard'

interface UserSidebarProps {
  users: User[]
  selectedUserId: string
  onUserSelect: (userId: string) => void
}

export function UserSidebar({ users, selectedUserId, onUserSelect }: UserSidebarProps) {
  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'offline':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-semibold'>Customer</h2>
        <p className='text-sm text-muted-foreground'>{users.filter((u) => u.status === 'online').length} online</p>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-2'>
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors',
                selectedUserId === user.id && 'bg-accent'
              )}
              onClick={() => onUserSelect(user.id)}
            >
              <div className='relative'>
                <Avatar className='h-10 w-10 bg-primary/20 flex items-center justify-center'>
                  <span className='text-sm font-medium'>{user.name.split(' ').pop()?.charAt(0)}</span>
                </Avatar>
                <div
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
                    getStatusColor(user.status)
                  )}
                />
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-medium truncate'>{user.name}</h3>
                  {user.unreadCount > 0 && (
                    <Badge variant='destructive' className='text-xs'>
                      {user.unreadCount}
                    </Badge>
                  )}
                </div>

                <p className='text-sm text-muted-foreground truncate'>{user.lastMessage || 'Chưa có tin nhắn'}</p>

                <div className='flex items-center justify-between mt-1'>
                  <span className='text-xs text-muted-foreground'>{getStatusText(user.status)}</span>
                  {user.lastMessageTime && (
                    <span className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(user.lastMessageTime, {
                        addSuffix: true,
                        locale: vi
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
