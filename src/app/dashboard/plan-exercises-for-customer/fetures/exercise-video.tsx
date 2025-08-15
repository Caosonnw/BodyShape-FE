'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { VideoPlayer } from '@/components/video-player'

export function buildExerciseVideoSrc(videoUrl?: string | null) {
  const API = process.env.NEXT_PUBLIC_API_ENDPOINT
  const fallback = 'https://peach.blender.org/wp-content/uploads/bbb.mp4'

  if (videoUrl && /^https?:\/\//i.test(videoUrl)) return videoUrl
  if (videoUrl && API) {
    const base = API.replace(/\/+$/, '')
    const file = videoUrl.replace(/^\/+/, '')
    return `${base}/videos/${file}`
  }
  if (API) {
    const base = API.replace(/\/+$/, '')
    return `${base}/videos/1750833005152_724856168_Daily_Workout_Routine_Day_-_Day_1.mp4`
  }
  return fallback
}

type VideoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  title?: string
  poster?: string
  /** Extra classes for DialogContent (e.g., to make it larger) */
  contentClassName?: string
  /** Extra classes for VideoPlayer */
  playerClassName?: string
}

export function VideoDialog({
  open,
  onOpenChange,
  src,
  title = 'Exercise Video',
  poster = '/images/logo-color.png',
  contentClassName = '!max-w-[70vw] p-0',
  playerClassName = 'h-[calc(100vh-10rem)] rounded-md'
}: VideoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <VideoPlayer className={playerClassName} src={src} poster={poster} size='full' autoHide />
      </DialogContent>
    </Dialog>
  )
}
