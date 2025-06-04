import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { format } from 'date-fns'
import type { Message } from './chat-dashboard'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.sender === 'agent'

  return (
    <div className={cn('flex w-full', isAgent ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex gap-3 max-w-[80%]', isAgent ? 'flex-row-reverse' : 'flex-row')}>
        <Avatar className='h-8 w-8 flex-shrink-0 flex items-center justify-center'>
          {isAgent ? (
            <div className='bg-primary h-full w-full rounded-full flex items-center justify-center'>
              <span className='text-xs font-medium text-primary-foreground'>Admin</span>
            </div>
          ) : (
            <div className='bg-muted h-full w-full rounded-full flex items-center justify-center'>
              <span className='text-xs font-medium'>KH</span>
            </div>
          )}
        </Avatar>

        <div className={cn('flex flex-col', isAgent ? 'items-end' : 'items-start')}>
          <div
            className={cn(
              'rounded-lg p-3',
              isAgent ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'
            )}
          >
            <p className='text-sm'>{message.content}</p>
          </div>
          <p className={cn('text-xs text-muted-foreground mt-1', isAgent ? 'text-right' : 'text-left')}>
            {format(message.timestamp, 'HH:mm')}
          </p>
        </div>
      </div>
    </div>
  )
}
