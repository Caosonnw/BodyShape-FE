'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Pencil } from 'lucide-react'

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

import { Textarea } from '@/components/ui/textarea'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'

import { useAlert } from '@/context/AlertContext'

import { getAccessTokenFromLocalStorage, handleErrorApi } from '@/lib/utils'

import { useGetCoachCustomers } from '@/queries/useCoachCustomer'

import { useAccountMe } from '@/queries/useUser'

import { CreateTrainingPlanSchema, CreateTrainingPlanType } from '@/schema/trainingPlan.schema'
import { useGetTrainingPlanById, useUpdateTrainingPlanMutation } from '@/queries/useTrainingPlan'

export default function EditTrainingPlan({
  trainingPlanId,
  setTrainingPlanId,
  onSubmitSuccess
}: {
  trainingPlanId?: number
  setTrainingPlanId: (value: number | undefined) => void
  onSubmitSuccess: () => void
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const { showAlert } = useAlert()

  const selfUser = useAccountMe(accessToken)

  const updateTrainingPlanMutation = useUpdateTrainingPlanMutation()

  const trainingPlanById = useGetTrainingPlanById({
    trainingPlanId: trainingPlanId as number,
    enabled: Boolean(trainingPlanId)
  })

  const customerList = useGetCoachCustomers(selfUser.data?.payload.data.user_id || 0)

  const form = useForm<CreateTrainingPlanType>({
    resolver: zodResolver(CreateTrainingPlanSchema),
    defaultValues: {
      coach_id: undefined,
      customer_id: undefined,
      description: '',
      diet_plan: ''
    }
  })

  const selectedCustomerId = form.watch('customer_id')

  useEffect(() => {
    const token = getAccessTokenFromLocalStorage()

    setAccessToken(token)
  }, [])

  useEffect(() => {
    const data = trainingPlanById.data?.payload.data

    if (data && selfUser.data?.payload.data.user_id) {
      form.reset({
        coach_id: selfUser.data.payload.data.user_id,

        customer_id: data.customer_id,

        description: data.description,

        diet_plan: data.diet_plan
      })
    }
  }, [trainingPlanById.data, selfUser.data, form])

  const onSubmit = async (values: CreateTrainingPlanType) => {
    if (updateTrainingPlanMutation.isPending || !trainingPlanId) return

    try {
      const body = {
        ...values,
        coach_id: selfUser.data?.payload.data.user_id
      }

      const result = await updateTrainingPlanMutation.mutateAsync({
        trainingPlanId,
        body
      })

      showAlert(result.payload.message, 'success')

      onSubmitSuccess()

      setTrainingPlanId(undefined)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={!!trainingPlanId}
      onOpenChange={(value) => {
        if (!value) {
          setTrainingPlanId(undefined)
        }
      }}
    >
      <DialogContent className='sm:max-w-[700px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit Training Plan</DialogTitle>

          <DialogDescription>Update training plan information</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='edit-training-plan-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='customer_id'
              render={() => (
                <FormItem>
                  <FormLabel>Select Customer</FormLabel>

                  <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                    {customerList.data?.payload.data.map((customer: any) => {
                      const avatarSrc = customer.avatar
                        ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${customer.avatar}`
                        : undefined

                      const isSelected = selectedCustomerId === customer.user_id

                      return (
                        <Card
                          key={customer.user_id}
                          onClick={() => form.setValue('customer_id', customer.user_id)}
                          className={cn(
                            'relative cursor-pointer border-2 p-4 transition-all hover:scale-[1.02]',
                            isSelected ? 'border-primary bg-primary/5' : 'border-border'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-12 w-12'>
                              <AvatarImage src={avatarSrc} alt={customer.full_name} />

                              <AvatarFallback>{customer.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className='flex-1'>
                              <p className='font-semibold'>{customer.full_name}</p>

                              <p className='text-sm text-muted-foreground'>{customer.email}</p>
                            </div>

                            {isSelected && (
                              <div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full'>
                                <Check className='h-4 w-4' />
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea {...field} className='min-h-[120px]' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='diet_plan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diet Plan</FormLabel>

                  <FormControl>
                    <Textarea {...field} className='min-h-[120px]' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='edit-training-plan-form' disabled={updateTrainingPlanMutation.isPending}>
            Update Training Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
