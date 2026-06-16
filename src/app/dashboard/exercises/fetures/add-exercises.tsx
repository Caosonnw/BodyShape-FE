'use client'
import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { VideoPlayer } from '@/components/video-player'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useCreateExerciseMutation } from '@/queries/useExercise'
import { CreateExerciseSchema, CreateExerciseType } from '@/schema/exercise.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export default function AddExercise() {
  const [open, setOpen] = useState(false)
  const addExerciseMutation = useCreateExerciseMutation()
  const { showAlert } = useAlert()
  const form = useForm<CreateExerciseType>({
    resolver: zodResolver(CreateExerciseSchema),
    defaultValues: {
      exercise_name: '',
      description: '',
      muscle_group: '',
      equipment_needed: '',
      video_url: ''
    }
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateExerciseType) => {
    if (addExerciseMutation.isPending) return
    try {
      let body = values
      const result = await addExerciseMutation.mutateAsync(body)
      showAlert(result.payload.message, 'success')
      reset()
      setOpen(false)
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
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-10 gap-1 text-[13px] hover:cursor-pointer'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Exercise</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[800px] max-h-screen overflow-auto' onEscapeKeyDown={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
          <DialogDescription>
            Fields exercise name, description, muscle group, equipment needed and video url are compulsory
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-exercise-form'
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

            {/* File Upload */}
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
            {/* Video URL */}
            <FormField
              control={form.control}
              name='video_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Video</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name='video_url'
                      render={({ field }) => <FileUpload value={field.value} onChange={field.onChange} />}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('video_url') && (
              <VideoPlayer
                className='h-[calc(70vh-4rem)] rounded-md'
                src={videoUrl}
                poster='/images/about-1.jpg'
                size='full'
                autoHide={true}
              />
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-exercise-form' className='hover:cursor-pointer'>
            Add Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
