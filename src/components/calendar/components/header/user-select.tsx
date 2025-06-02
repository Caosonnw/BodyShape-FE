import { useCalendar } from '@/components/calendar/contexts/calendar-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function UserSelect() {
  const { users, selectedUserId, setSelectedUserId } = useCalendar()

  return (
    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
      <SelectTrigger className='flex-1 md:w-48'>
        <SelectValue />
      </SelectTrigger>

      <SelectContent align='end'>
        <SelectItem value='all'>
          <div className='flex items-center gap-1'>
            <AvatarGroup max={2}>
              {users.map((user: any) => (
                <Avatar key={user.user_id} className='size-6 text-xxs'>
                  <AvatarImage
                    src={
                      user.avatar ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}` : undefined
                    }
                    alt={user.full_name}
                  />

                  <AvatarFallback className='text-xxs'>{user.full_name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            All
          </div>
        </SelectItem>

        {users.map((user: any) => (
          <SelectItem key={user.user_id} value={user.user_id} className='flex-1'>
            <div className='flex items-center gap-2'>
              <Avatar key={user.user_id} className='size-6'>
                <AvatarImage
                  src={user.avatar ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}` : undefined}
                  alt={user.full_name}
                />
                <AvatarFallback className='text-xxs'>{user.full_name[0]}</AvatarFallback>
              </Avatar>

              <p className='truncate'>{user.full_name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
