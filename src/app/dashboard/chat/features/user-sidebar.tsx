'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import type { User } from './chat-dashboard'

interface UserSidebarProps {
  users: User[]
  selectedUserId: number
  onUserSelect: (userId: number) => void
}

export function UserSidebar({ users, selectedUserId, onUserSelect }: UserSidebarProps) {
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

  return (
    <div className='flex flex-col h-full'>
      {/* HEADER */}
      <div className='p-4 border-b'>
        <h2 className='text-lg font-semibold'>Customer</h2>

        <p className='text-sm text-muted-foreground'>{users.filter((u) => u.status === 'ONLINE').length} online</p>
      </div>

      {/* USERS */}
      <ScrollArea className='flex-1'>
        <div className='p-2'>
          {users.map((user) => {
            const avatarSrc = user?.avatar
              ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
              : undefined
            // console.log(avatarSrc)
            return (
              <div
                key={user.user_id}
                onClick={() => onUserSelect(user.user_id)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors',
                  selectedUserId === user.user_id && 'bg-accent'
                )}
              >
                {/* AVATAR */}
                <div className='relative'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={avatarSrc} alt={user.full_name} />

                    <AvatarFallback className='text-sm font-medium'>{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>

                  {/* STATUS DOT */}
                  <div
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
                      getStatusColor(user.status)
                    )}
                  />
                </div>

                {/* INFO */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium truncate'>{user.full_name}</h3>

                    {user.unreadCount > 0 && (
                      <Badge variant='destructive' className='text-xs'>
                        {user.unreadCount}
                      </Badge>
                    )}
                  </div>

                  {/* LAST MESSAGE */}
                  <p className='text-sm text-muted-foreground truncate'>{user.lastMessage || 'Chưa có tin nhắn'}</p>

                  {/* STATUS + TIME */}
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
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
