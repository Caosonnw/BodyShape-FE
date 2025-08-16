'use client'

import { Dumbbell } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className='text-center py-8'>
      <Dumbbell className='mx-auto h-8 w-8 opacity-60' />
      <p className='mt-2 text-sm text-muted-foreground'>No exercises found in this plan.</p>
    </div>
  )
}
