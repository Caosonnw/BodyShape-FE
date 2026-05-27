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
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { useAlert } from '@/context/AlertContext'
import { getAccessTokenFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { useGetCoachCustomers } from '@/queries/useCoachCustomer'
import { useCreateTrainingPlanMutation } from '@/queries/useTrainingPlan'
import { useAccountMe } from '@/queries/useUser'
import { CreateTrainingPlanSchema, CreateTrainingPlanType } from '@/schema/trainingPlan.schema'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddTrainingPlan() {
  const [open, setOpen] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const addTrainingPlanMutation = useCreateTrainingPlanMutation()

  const selfUser = useAccountMe(accessToken)

  const customerList = useGetCoachCustomers(selfUser.data?.payload.data.id || 0)

  const { showAlert } = useAlert()

  const form = useForm<CreateTrainingPlanType>({
    resolver: zodResolver(CreateTrainingPlanSchema),
    defaultValues: {
      coach_id: undefined,
      description: '',
      diet_plan: '',
      customer_id: undefined
    }
  })

  const selectedCustomerId = form.watch('customer_id')

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateTrainingPlanType) => {
    console.log(values)

    if (addTrainingPlanMutation.isPending) return

    try {
      const body = {
        ...values,
        coach_id: selfUser.data?.payload.data.user_id
      }

      const result = await addTrainingPlanMutation.mutateAsync(body)

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

  useEffect(() => {
    const token = getAccessTokenFromLocalStorage()
    setAccessToken(token)
  }, [])

  useEffect(() => {
    if (selfUser.data?.payload.data.user_id) {
      form.setValue('coach_id', selfUser.data.payload.data.user_id)
    }
  }, [selfUser.data, form])

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-10 gap-1 text-[13px]'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span>Create Training Plan</span>
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[700px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Create Training Plan</DialogTitle>

          <DialogDescription>Create personalized training and diet plans for your customers</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='add-training-plan-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Customer Selection */}
            <FormField
              control={form.control}
              name='customer_id'
              render={({ field }) => (
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

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea placeholder='Enter training description...' {...field} className='min-h-[120px]' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Diet Plan */}
            <FormField
              control={form.control}
              name='diet_plan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diet Plan</FormLabel>

                  <FormControl>
                    <Textarea placeholder='Enter diet plan...' {...field} className='min-h-[120px]' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='add-training-plan-form' disabled={addTrainingPlanMutation.isPending}>
            Create Training Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
