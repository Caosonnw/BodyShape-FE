import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import type { Message, User } from './chat-dashboard'

interface ChatMessageProps {
  me: User
  message: Message
  user: User
}

export function ChatMessage({ me, message, user }: ChatMessageProps) {
  const isMe = message.sender?.user_id === me?.user_id

  function getInitials(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 3)
      .toUpperCase()
  }

  const avatarSrc = isMe
    ? me?.avatar
      ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${me.avatar}`
      : undefined
    : undefined

  const avatarName = isMe ? me.full_name : user.full_name

  return (
    <div className={cn('flex w-full', isMe ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex gap-3 max-w-[80%]', isMe ? 'flex-row-reverse' : 'flex-row')}>
        <Avatar className='h-8 w-8 flex-shrink-0'>
          <AvatarImage src={avatarSrc} alt={avatarName} />
          <AvatarFallback
            className={cn('text-xs font-medium', isMe ? 'bg-primary text-primary-foreground' : 'bg-muted')}
          >
            {getInitials(avatarName)}
          </AvatarFallback>
        </Avatar>

        <div className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
          <div
            className={cn(
              'rounded-lg p-3',
              isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'
            )}
          >
            <p className='text-sm whitespace-pre-wrap break-words'>{message.content}</p>
          </div>
          <p className={cn('text-xs text-muted-foreground mt-1', isMe ? 'text-right' : 'text-left')}>
            {format(message.timestamp, 'HH:mm')}
          </p>
        </div>
      </div>
    </div>
  )
}
