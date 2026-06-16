'use client'

import PlanExerciseRow from '@/app/dashboard/plan-exercises-for-customer/fetures/plan-exercise-row'
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UIItem, WorkoutLog } from '@/types/types'

export default function PlanDaySection({
  day,
  items,
  planId,
  existingByExerciseId,
  logsLoading,
  onOpenVideo
}: {
  day: number
  items: UIItem[]
  planId: number
  existingByExerciseId: Record<number, WorkoutLog | null>
  logsLoading: boolean
  onOpenVideo: (exercise: { video_url?: string | null }) => void
}) {
  const total = items.length
  const done = items.reduce((acc, it) => acc + (existingByExerciseId[it.exercise.exercise_id] ? 1 : 0), 0)
  const pct = Math.round((done / Math.max(total, 1)) * 100)

  return (
    <AccordionItem value={`day-${day}`}>
      <AccordionTrigger className='hover:no-underline'>
        <div className='flex w-full items-center justify-between pr-2'>
          <div className='flex items-center gap-3'>
            <Badge variant='default' className='rounded-full'>
              Day {day}
            </Badge>
            <span className='text-sm text-muted-foreground'>
              {logsLoading ? 'Calculating…' : `${done}/${total} completed`}
            </span>
          </div>
          <div className='flex items-center gap-3 w-48'>
            <Progress value={logsLoading ? 0 : pct} aria-label={`Day ${day} progress`} />
            <span className='text-xs text-muted-foreground w-10 text-right'>{logsLoading ? '...' : `${pct}%`}</span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <ul className='space-y-3'>
          {items.map((it) => (
            <PlanExerciseRow
              key={it.planExc_id}
              item={it}
              planId={planId}
              existingLog={existingByExerciseId[it.exercise.exercise_id] || null}
              onOpenVideo={() => onOpenVideo(it.exercise)}
            />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  )
}
