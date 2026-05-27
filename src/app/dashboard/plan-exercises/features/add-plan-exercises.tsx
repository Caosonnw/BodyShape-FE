'use client'
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
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useGetAllExercises } from '@/queries/useExercise'
import { useCreatePlanExerciseMutation } from '@/queries/usePlanExercise'
import { CreatePlanExerciseSchema, CreatePlanExerciseType } from '@/schema/planExercise.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddPlanExercise() {
  const [open, setOpen] = useState(false)
  const exerciseList = useGetAllExercises()
  const addPlanExerciseMutation = useCreatePlanExerciseMutation()
  const { showAlert } = useAlert()
  const form = useForm<CreatePlanExerciseType>({
    resolver: zodResolver(CreatePlanExerciseSchema),
    defaultValues: {
      day_number: 0,
      sets: 0,
      reps: 0,
      weight: 0,
      rest_time: 0,
      exercise_id: 0
    }
  })

  // console.log(form.getValues())

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreatePlanExerciseType) => {
    if (addPlanExerciseMutation.isPending) return
    try {
      let body = values
      const result = await addPlanExerciseMutation.mutateAsync(body)
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

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-10 gap-1 text-[13px] hover:cursor-pointer'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Plan Exercise</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto' onEscapeKeyDown={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
          <DialogDescription>Fields equipment name, description, location and status are compulsory</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-plan-exercise-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Exercise */}
            <FormField
              control={form.control}
              name='exercise_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise</FormLabel>

                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select exercise' />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {exerciseList.data?.payload.data?.map((exercise: any) => (
                        <SelectItem key={exercise.exercise_id} value={exercise.exercise_id.toString()}>
                          {exercise.exercise_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Day Number */}
            <FormField
              control={form.control}
              name='day_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day Number</FormLabel>

                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter training day'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sets */}
            <FormField
              control={form.control}
              name='sets'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sets</FormLabel>

                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter sets'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reps */}
            <FormField
              control={form.control}
              name='reps'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reps</FormLabel>

                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter reps'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight */}
            <FormField
              control={form.control}
              name='weight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>

                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter weight'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rest Time */}
            <FormField
              control={form.control}
              name='rest_time'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rest Time (seconds)</FormLabel>

                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter rest time'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-plan-exercise-form' className='hover:cursor-pointer'>
            Add Plan Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
