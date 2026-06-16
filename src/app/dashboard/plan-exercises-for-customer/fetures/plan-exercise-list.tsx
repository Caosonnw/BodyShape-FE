'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { VideoPlayer } from '@/components/video-player'
import { cn } from '@/lib/utils'
import { useGetPlanExercisesByCustomer } from '@/queries/usePlanExercise'
import { Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Accordion } from '@/components/ui/accordion'
import { useGetWorkoutLogsByExercises } from '@/queries/useWorkoutLog'
import { ApiExercise, ApiItem, UIItem, WorkoutLog } from '@/types/types'
import EmptyState from '@/app/dashboard/plan-exercises-for-customer/fetures/empty-state'
import PlanDaySection from '@/app/dashboard/plan-exercises-for-customer/fetures/plan-day-section'
import Hints from '@/app/dashboard/plan-exercises-for-customer/fetures/hints'

export default function PlanExerciseList({ className }: { className?: string }) {
  const { data, isLoading, isError } = useGetPlanExercisesByCustomer()
  const [query, setQuery] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // map API -> UI items
  const { planId, description, items } = useMemo(() => {
    const apiData = ((data as any)?.payload?.data || []) as ApiItem[]
    const first = apiData[0]
    const planId = first?.training_plans?.plan_id ?? 0
    const description = first?.training_plans?.description ?? undefined

    const mapped: UIItem[] = apiData.map((it) => {
      const ex = (it.exercises ?? it.exercise) as ApiExercise | undefined
      return {
        planExc_id: it.plan_exercise_id ?? 0,
        day_number: it.day_number ?? 0,
        sets: it.sets ?? 0,
        reps: it.reps ?? 0,
        weight: it.weight ?? 0,
        rest_time: it.rest_time ?? 0,
        plan_id: (it as any)?.training_plans?.plan_id ?? 0,
        customer_id: (it as any)?.customer?.customer_id ?? (it as any)?.customers?.users?.user_id ?? 0,
        exercise: {
          exercise_id: ex?.exercise_id ?? 0,
          exercise_name: ex?.name ?? '',
          muscle_group: ex?.muscleGroup ?? null,
          video_url: ex?.videoUrl ?? null,
          equipment: ex?.equipment ?? null,
          description: ex?.description ?? null
        }
      }
    })
    return { planId, description, items: mapped }
  }, [data])

  // search filter
  const filtered: UIItem[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => {
      const name = (it.exercise?.exercise_name || '').toLowerCase()
      const mg = (it.exercise?.muscle_group || '').toLowerCase()
      return name.includes(q) || mg.includes(q)
    })
  }, [items, query])

  // group by day
  const byDay = useMemo(() => {
    const m = new Map<number, UIItem[]>()
    for (const it of filtered) {
      const arr = m.get(it.day_number) || []
      arr.push(it)
      m.set(it.day_number, arr)
    }
    const entries = Array.from(m.entries()).map(
      ([day, arr]) =>
        [
          day,
          arr.sort((a, b) => (a.exercise.exercise_name || '').localeCompare(b.exercise.exercise_name || ''))
        ] as const
    )
    entries.sort((a, b) => a[0] - b[0])
    return entries
  }, [filtered])

  // batch logs
  const exerciseIds = useMemo(
    () => Array.from(new Set(filtered.map((it) => it.exercise.exercise_id).filter(Boolean))),
    [filtered]
  )
  const logsQueries = useGetWorkoutLogsByExercises(exerciseIds, true)

  const existingByExerciseId: Record<number, WorkoutLog | null> = useMemo(() => {
    const map: Record<number, WorkoutLog | null> = {}
    logsQueries.forEach((q, idx) => {
      const eid = exerciseIds[idx]
      const raw = ((q.data as any)?.payload?.data ?? (q.data as any)?.data?.data ?? []) as WorkoutLog[]
      const match = raw?.find((lg) => lg?.training_plans?.plan_id === planId) || null
      map[eid] = match
    })
    return map
  }, [logsQueries, exerciseIds, planId])

  const logsLoading = logsQueries.some((q) => q.isLoading)

  // Video open helper
  const openVideo = (exercise: { video_url?: string | null }) => {
    if (!exercise?.video_url) return
    const finalUrl = exercise.video_url.startsWith('http')
      ? exercise.video_url
      : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/videos/${exercise.video_url}`
    setVideoUrl(finalUrl)
  }

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className='text-xl'>Training Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-muted-foreground'>Loading exercise list...</div>
        </CardContent>
      </Card>
    )
  }
  if (isError) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className='text-xl'>Training Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-red-600'>Failed to load training plan data.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={cn('mx-5', className)}>
        <CardHeader>
          <CardTitle className='flex items-center justify-between gap-4'>
            <span className='text-xl'>Training Plan #{planId ?? ''}</span>
            <div className='flex items-center gap-2 w-full max-w-md'>
              <div className='relative w-full'>
                <Search className='absolute left-2 top-2.5 h-4 w-4' />
                <Input
                  className='pl-8 font-medium'
                  placeholder='Search exercises by name or muscle group...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </CardTitle>
          {description ? <p className='text-sm text-muted-foreground mt-1'>{description}</p> : null}
        </CardHeader>

        <CardContent>
          {byDay.length === 0 ? (
            <EmptyState />
          ) : (
            <Accordion type='multiple' className='w-full'>
              {byDay.map(([day, arr]) => (
                <PlanDaySection
                  key={day}
                  day={day}
                  items={arr}
                  planId={planId}
                  existingByExerciseId={existingByExerciseId}
                  logsLoading={logsLoading}
                  onOpenVideo={openVideo}
                />
              ))}
            </Accordion>
          )}

          <Separator className='my-4' />
          <Hints />
        </CardContent>
      </Card>

      {/* Video dialog */}
      <Dialog open={!!videoUrl} onOpenChange={() => setVideoUrl(null)}>
        <DialogContent className='!max-w-[70vw]'>
          <DialogHeader>
            <DialogTitle>Exercise Video</DialogTitle>
          </DialogHeader>
          {videoUrl && (
            <VideoPlayer
              className='h-[calc(100vh-10rem)] rounded-md'
              src={videoUrl}
              poster='/images/logo-color.png'
              size='full'
              autoHide
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
