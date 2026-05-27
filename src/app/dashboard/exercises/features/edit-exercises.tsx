'use client'
import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { VideoPlayer } from '@/components/video-player'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useGetExerciseById, useUpdateExerciseMutation } from '@/queries/useExercise'
import { UpdateExerciseSchema, UpdateExerciseType } from '@/schema/exercise.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

export default function EditExercise({
  exerciseId,
  setId,
  onSubmitSuccess
}: {
  exerciseId?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const { showAlert } = useAlert()
  const { data } = useGetExerciseById({ exerciseId: exerciseId as number, enabled: Boolean(exerciseId) })
  const updateExercise = useUpdateExerciseMutation()

  const form = useForm<UpdateExerciseType>({
    resolver: zodResolver(UpdateExerciseSchema),
    defaultValues: {
      exercise_name: '',
      description: '',
      muscle_group: '',
      equipment_needed: '',
      video_url: ''
    }
  })

  const reset = () => {
    setId(undefined)
  }

  useEffect(() => {
    if (data) {
      const { exercise_name, description, muscle_group, equipment_needed, video_url } = data?.payload.data
      form.reset({
        exercise_name,
        description,
        muscle_group,
        equipment_needed,
        video_url
      })
    }
  }, [form, data])

  const onSubmit = async (values: UpdateExerciseType) => {
    if (updateExercise.isPending) return
    try {
      let body: UpdateExerciseType & { exerciseId: number } = { exerciseId: exerciseId as number, ...values }
      const result = await updateExercise.mutateAsync(body)
      showAlert(result.payload.message, 'success')
      reset()
      onSubmitSuccess?.()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const videoUrl = form.watch('video_url')
    ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/videos/${form.watch('video_url')}`
    : ''

  return (
    <Dialog
      open={Boolean(exerciseId)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>Fields name, email, password are compulsory</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-exercise-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Exercise Name */}
            <FormField
              control={form.control}
              name='exercise_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Please enter exercise name' {...field} className='input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Please enter package description' {...field} className='input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Muscle Group */}
            <FormField
              control={form.control}
              name='muscle_group'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Muscle Group</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select muscle group' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='chest'>Chest</SelectItem>
                        <SelectItem value='back'>Back</SelectItem>
                        <SelectItem value='legs'>Legs</SelectItem>
                        <SelectItem value='arms'>Arms</SelectItem>
                        <SelectItem value='shoulders'>Shoulders</SelectItem>
                        <SelectItem value='core'>Core</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Equipment Needed */}
            <FormField
              control={form.control}
              name='equipment_needed'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Needed</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select equipment needed' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='dumbbell'>Dumbbell</SelectItem>
                        <SelectItem value='barbell'>Barbell</SelectItem>
                        <SelectItem value='kettlebell'>Kettlebell</SelectItem>
                        <SelectItem value='resistance_band'>Resistance Band</SelectItem>
                        <SelectItem value='bodyweight'>Bodyweight</SelectItem>
                        <SelectItem value='none'>None</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video URL */}
            {videoUrl ? (
              <div className='flex flex-col gap-2'>
                <VideoPlayer src={videoUrl} autoPlay />
                <Button
                  variant='destructive'
                  onClick={() => {
                    form.setValue('video_url', '')
                  }}
                >
                  Remove Video
                </Button>
              </div>
            ) : (
              <FormField
                control={form.control}
                name='video_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder='Please enter video URL' {...field} className='input' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* File Upload */}
            {videoUrl ? null : (
              <FormField
                control={form.control}
                name='video_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Video</FormLabel>
                    <FormControl>
                      <FileUpload value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-exercise-form' className='hover:cursor-pointer'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
