import { Skeleton } from '@/components/ui/skeleton'

export function CalendarSkeleton({ view }: { view: 'day' | 'week' | 'month' | 'year' | 'agenda' }) {
  return (
    <div className='mx-6 h-screen overflow-hidden rounded-xl border'>
      <div className='p-4 border-b'>
        <Skeleton className='h-6 w-1/3 mb-2' />
        <Skeleton className='h-5 w-1/4' />
      </div>

      <div className='p-4 grid gap-4'>
        {view === 'month' && (
          <div className='grid grid-cols-7 gap-2'>
            {Array.from({ length: 56 }).map((_, i) => (
              <Skeleton key={i} className='h-24 rounded-md' />
            ))}
          </div>
        )}

        {view === 'week' || view === 'day' ? (
          <div className='flex flex-col gap-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-20 rounded-md' />
            ))}
          </div>
        ) : null}

        {view === 'agenda' && (
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Skeleton className='h-5 w-1/2 mb-2' />
                <Skeleton className='h-16 rounded-md' />
              </div>
            ))}
          </div>
        )}

        {view === 'year' && (
          <div className='grid grid-cols-3 gap-4'>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className='h-24 rounded-md' />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
