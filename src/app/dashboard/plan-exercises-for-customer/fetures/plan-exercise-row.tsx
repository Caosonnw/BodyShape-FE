'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Timer, NotebookPen, CheckCircle2, Dumbbell, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateWorkoutLogMutation } from '@/queries/useWorkoutLog'
import { UIItem, WorkoutLog } from '@/types/types'
import CreateLogForm from '@/app/dashboard/plan-exercises-for-customer/fetures/create-log-form'

export default function PlanExerciseRow({
  item,
  planId,
  existingLog,
  onOpenVideo
}: {
  item: UIItem
  planId: number
  existingLog: WorkoutLog | null
  onOpenVideo: () => void
}) {
  const createLog = useCreateWorkoutLogMutation()
  const [open, setOpen] = useState(false)

  const isDone = !!existingLog
  const isBodyweight = typeof item.weight === 'number' && item.weight <= 0
  const isHoldStyle = /plank|hold|wall sit/i.test(item.exercise.exercise_name || '')

  const openLog = () => setOpen(true)

  return (
    <>
      <li className='rounded-2xl border p-3 hover:bg-[#eaebef]'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <div className='flex items-start gap-3'>
            <Dumbbell className={cn('mt-0.5 h-5 w-5', isDone && 'text-green-600')} />
            <div>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>{item.exercise.exercise_name}</span>
                {item.exercise.muscle_group ? (
                  <Badge variant='outline' className='uppercase'>
                    {item.exercise.muscle_group}
                  </Badge>
                ) : null}
                {isDone ? (
                  <span className='inline-flex items-center gap-1 text-green-600 text-xs'>
                    <CheckCircle2 className='h-4 w-4' /> Logged
                  </span>
                ) : null}
              </div>

              <div className='text-sm text-muted-foreground mt-0.5'>
                {isHoldStyle ? (
                  <>
                    {item.sets} x hold {item.reps}s
                  </>
                ) : (
                  <>
                    {item.sets} x {item.reps}
                  </>
                )}
                {!isBodyweight && typeof item.weight === 'number' ? <span> · {item.weight} kg</span> : null}
                {typeof item.rest_time === 'number' ? (
                  <span className='inline-flex items-center gap-1'>
                    <span> · </span>
                    <Timer className='h-3.5 w-3.5' /> {item.rest_time}s rest
                  </span>
                ) : null}
              </div>

              {existingLog ? (
                <div className='text-xs mt-1'>
                  <span className='opacity-70'>You logged: </span>
                  <span className='font-medium'>
                    {existingLog.actual_sets} x {existingLog.actual_reps}
                    {existingLog.actual_weight ? ` · ${existingLog.actual_weight} kg` : ''}
                  </span>
                  {existingLog.workout_date ? (
                    <span className='opacity-70'> · {new Date(existingLog.workout_date).toLocaleDateString()}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              onClick={openLog}
              className={
                isDone
                  ? 'bg-muted text-muted-foreground hover:cursor-pointer hover:bg-[#f7244f] hover:text-white'
                  : 'hover:cursor-pointer'
              }
            >
              <NotebookPen className='mr-2 h-4 w-4' />
              {isDone ? 'View Log' : 'Log'}
            </Button>

            <Button
              className='hover:!bg-[#f7244f] hover:!text-white hover:cursor-pointer'
              variant='outline'
              size='sm'
              onClick={onOpenVideo}
              disabled={!item.exercise.video_url}
            >
              <PlayCircle className='mr-1 h-4 w-4' /> Video
            </Button>
          </div>
        </div>
      </li>

      {/* Log dialog */}
      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{existingLog ? 'Your Log' : 'Log Exercise'}</DialogTitle>
          </DialogHeader>

          {existingLog ? (
            <div className='space-y-3 text-sm'>
              <div className='font-medium'>{item.exercise.exercise_name}</div>
              <div className='text-muted-foreground'>
                Plan #{planId} · Day {item.day_number}
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <div>
                  <span className='opacity-70'>Sets</span>
                  <div className='font-medium'>{existingLog.actual_sets}</div>
                </div>
                <div>
                  <span className='opacity-70'>Reps</span>
                  <div className='font-medium'>{existingLog.actual_reps}</div>
                </div>
                <div>
                  <span className='opacity-70'>Weight</span>
                  <div className='font-medium'>{existingLog.actual_weight} kg</div>
                </div>
              </div>

              <div>
                <span className='opacity-70'>Date</span>
                <div className='font-medium'>{new Date(existingLog.workout_date).toLocaleDateString()}</div>
              </div>

              {existingLog.notes ? (
                <div>
                  <span className='opacity-70'>Notes</span>
                  <div className='whitespace-pre-wrap'>{existingLog.notes}</div>
                </div>
              ) : null}

              <div className='flex justify-end'>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
          ) : (
            <CreateLogForm
              defaults={{ sets: item.sets, reps: item.reps, weight: item.weight }}
              onCancel={() => setOpen(false)}
              onSave={(payload) => {
                if (!item.exercise.exercise_id || !item.planExc_id || !item.customer_id || !item.plan_id) return
                createLog.mutate(
                  {
                    actual_sets: payload.actual_sets,
                    actual_reps: payload.actual_reps,
                    actual_weight: payload.actual_weight,
                    notes: payload.notes || undefined,
                    workout_date: payload.workout_date,
                    exercise_id: item.exercise.exercise_id,
                    plan_exercise_id: item.planExc_id,
                    customer_id: item.customer_id,
                    plan_id: item.plan_id
                  },
                  { onSuccess: () => setOpen(false) }
                )
              }}
              isSaving={createLog.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
