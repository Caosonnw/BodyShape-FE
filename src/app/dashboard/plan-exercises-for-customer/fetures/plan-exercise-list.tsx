'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { VideoPlayer } from '@/components/video-player'
import { cn } from '@/lib/utils'
import { useGetPlanExercisesByCustomer } from '@/queries/usePlanExercise'
import { CheckCircle2, Dumbbell, NotebookPen, PlayCircle, Search, Timer } from 'lucide-react'
import { useMemo, useState } from 'react'

// === Kiểu tạm cho payload từ API (theo schema) ===
type ApiExercise = {
  exercise_id: number
  name: string
  description?: string | null
  muscleGroup?: string | null
  equipment?: string | null
  videoUrl?: string | null
}

type ApiItem = {
  plan_exercise_id: number
  day_number: number
  sets: number
  reps: number
  weight: number
  rest_time: number
  training_plans?: { plan_id: number; description?: string | null; diet_plan?: string | null }
  // BE có thể trả 1 trong 2 keys này:
  exercises?: ApiExercise
  exercise?: ApiExercise
}

// === Kiểu cho item đã map để render UI ===
type UIItem = {
  planExc_id: number
  day_number: number
  sets: number
  reps: number
  weight: number
  rest_time: number
  exercise: {
    exercise_id: number
    exercise_name: string
    muscle_group: string | null
    video_url: string | null
    equipment: string | null
    description: string | null
  }
}

export default function PlanExerciseList({ className }: { className?: string }) {
  const { data, isLoading, isError } = useGetPlanExercisesByCustomer()
  const [query, setQuery] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const { planId, description, items, logs } = useMemo(() => {
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

    const logs: { plan_id: number; exercise_id: number }[] = [] // thay bằng logs thật nếu có
    return { planId, description, items: mapped, logs }
  }, [data])

  const filtered: UIItem[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => {
      const name = (it.exercise?.exercise_name || '').toLowerCase()
      const mg = (it.exercise?.muscle_group || '').toLowerCase()
      return name.includes(q) || mg.includes(q)
    })
  }, [items, query])

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

  const completionByDay = useMemo(() => {
    const doneMap = new Map<number, number>()
    const totalMap = new Map<number, number>()
    for (const [day, arr] of byDay) {
      totalMap.set(day, arr.length)
      let done = 0
      for (const it of arr) {
        const hasLog = logs.some((lg) => lg.plan_id === planId && lg.exercise_id === it.exercise.exercise_id)
        if (hasLog) done++
      }
      doneMap.set(day, done)
    }
    return { done: doneMap, total: totalMap }
  }, [byDay, logs, planId])

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
              {byDay.map(([day, arr]) => {
                const done = completionByDay.done.get(day) || 0
                const total = completionByDay.total.get(day) || arr.length
                const pct = Math.round((done / Math.max(total, 1)) * 100)
                return (
                  <AccordionItem key={day} value={`day-${day}`}>
                    <AccordionTrigger>
                      <div className='flex w-full items-center justify-between pr-2'>
                        <div className='flex items-center gap-3'>
                          <Badge variant={done === total ? 'default' : 'default'} className='rounded-full'>
                            Day {day}
                          </Badge>
                          <span className='text-sm text-muted-foreground'>
                            {done}/{total} completed
                          </span>
                        </div>
                        <div className='flex items-center gap-3 w-48'>
                          <Progress value={pct} aria-label={`Completed ${pct}%`} />
                          <span className='text-xs text-muted-foreground w-10 text-right'>{pct}%</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className='space-y-3'>
                        {arr.map((it) => {
                          const log = logs.find(
                            (lg) => lg.plan_id === planId && lg.exercise_id === it.exercise.exercise_id
                          )
                          const isDone = Boolean(log)
                          const isBodyweight = typeof it.weight === 'number' && it.weight <= 0
                          const isHoldStyle = /plank|hold|wall sit/i.test(it.exercise.exercise_name || '')
                          return (
                            <li key={it.planExc_id} className='rounded-2xl border p-3'>
                              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                                <div className='flex items-start gap-3'>
                                  <Dumbbell className={cn('mt-0.5 h-5 w-5', isDone && 'text-green-600')} />
                                  <div>
                                    <div className='flex items-center gap-2'>
                                      <span className='font-medium'>{it.exercise.exercise_name}</span>
                                      {it.exercise.muscle_group ? (
                                        <Badge variant='outline' className='uppercase'>
                                          {it.exercise.muscle_group}
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
                                          {it.sets} x hold {it.reps}s
                                        </>
                                      ) : (
                                        <>
                                          {it.sets} x {it.reps}
                                        </>
                                      )}
                                      {!isBodyweight && typeof it.weight === 'number' ? (
                                        <span> · {it.weight} kg</span>
                                      ) : null}
                                      {typeof it.rest_time === 'number' ? (
                                        <span className='inline-flex items-center gap-1'>
                                          <span> · </span>
                                          <Timer className='h-3.5 w-3.5' /> {it.rest_time}s rest
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                <div className='flex items-center gap-2'>
                                  <Button
                                    className='hover:cursor-pointer'
                                    size='sm'
                                    onClick={() => alert('Hook up onLogExercise')}
                                  >
                                    <NotebookPen className='mr-2 h-4 w-4' /> Log
                                  </Button>
                                  <Button
                                    className='hover:!bg-[#f7244f] hover:!text-white hover:cursor-pointer'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => openVideo(it.exercise)}
                                    disabled={!it.exercise.video_url}
                                  >
                                    <PlayCircle className='mr-1 h-4 w-4' /> Video
                                  </Button>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}

          <Separator className='my-4' />
          <Hints />
        </CardContent>
      </Card>

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
              autoHide={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function EmptyState() {
  return (
    <div className='text-center py-8'>
      <Dumbbell className='mx-auto h-8 w-8 opacity-60' />
      <p className='mt-2 text-sm text-muted-foreground'>No exercises found in this plan.</p>
    </div>
  )
}

function Hints() {
  return (
    <div className='text-xs text-muted-foreground space-y-1'>
      <p>• Search by name or muscle group to filter quickly.</p>
      <p>• Click "Log" to record actual results after training.</p>
      <p>• The "Video" button will open instructions if the exercise has a video_url.</p>
    </div>
  )
}
