'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Role } from '@/constants/type'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useCreateCoachCustomerMuatation } from '@/queries/useCoachCustomer'
import { useGetUserRoleCoach, useGetUserRoleCustomer } from '@/queries/useUser'
import { CreateCoachCustomerSchema, CreateCoachCustomerType } from '@/schema/coachCustomer.schema'
import { GetUserByRoleType } from '@/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const roleColors: Record<string, string> = {
  [Role.COACH]: 'bg-yellow-500 text-white',
  [Role.CUSTOMER]: 'bg-green-500 text-white'
}

export default function AddCoachCustomer() {
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const addCoachCustomerMutation = useCreateCoachCustomerMuatation()
  const { data: listCoach } = useGetUserRoleCoach()
  const { data: listCustomer } = useGetUserRoleCustomer()
  const { showAlert } = useAlert()
  const form = useForm<CreateCoachCustomerType>({
    resolver: zodResolver(CreateCoachCustomerSchema),
    defaultValues: {
      coach_id: 0,
      customer_id: 0
    }
  })

  const reset = () => {
    setSelectedCoach(null)
    setSelectedCustomer(null)
    form.reset()
  }

  const onSubmit = async (values: CreateCoachCustomerType) => {
    if (addCoachCustomerMutation.isPending) return
    try {
      const body = {
        coach_id: values.coach_id,
        customer_id: values.customer_id
      }
      const result = await addCoachCustomerMutation.mutateAsync(body)
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

  const handleSelectCoach = (coachId: number) => {
    setSelectedCoach(coachId)
    form.setValue('coach_id', coachId)
  }

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomer(customerId)
    form.setValue('customer_id', customerId)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-10 gap-1 text-[13px] hover:cursor-pointer'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Coach Customer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[1600px] max-h-screen overflow-auto' onEscapeKeyDown={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Create Coach Customer</DialogTitle>
          <DialogDescription>Fields coach and customer are compulsory</DialogDescription>
        </DialogHeader>
        <div className='flex w-full h-[80vh] gap-4'>
          {/* Customers List */}
          <div className='w-1/3'>
            <h3 className='font-bold text-xl mb-4'>Coachs</h3>
            <div className='space-y-4 max-h-[70vh] overflow-y-auto'>
              {listCoach?.payload?.data.map((user: GetUserByRoleType) => (
                <div
                  key={user.user_id}
                  onClick={() => handleSelectCoach(user.user_id)}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-100 cursor-pointer ${
                    selectedCoach === user.user_id ? 'bg-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <div className='flex items-center'>
                    <Avatar className='aspect-square w-[50px] h-[50px] rounded-md object-cover'>
                      <AvatarImage
                        src={
                          user.avatar
                            ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
                            : undefined
                        }
                      />
                      <AvatarFallback className='rounded-none'>
                        {user?.full_name
                          ?.split(' ')
                          .map((word: any) => word[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col ml-4'>
                      <div className='space-x-6 flex items-center'>
                        <span className='font-semibold text-lg'>{user.full_name}</span>
                        <Badge className={`px-2 py-1 rounded-md ${roleColors[user.role] || 'bg-gray-300'}`}>
                          {user.role}
                        </Badge>
                      </div>
                      <div>
                        <span className='font-semibold text-sm text-gray-500'>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Customer Form */}
          <div className='w-1/3'>
            <Form {...form}>
              <form
                noValidate
                className='grid auto-rows-max items-start gap-4 md:gap-8'
                id='add-coach-customer-form'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Coach Selection */}
                <h1 className='font-bold text-xl'>Add Coach Customer</h1>
                <FormField
                  control={form.control}
                  name='coach_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coach</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select Coach' />
                          </SelectTrigger>
                          <SelectContent>
                            {listCoach?.payload?.data.map((user: GetUserByRoleType) => (
                              <SelectItem key={user.user_id} value={String(user.user_id)}>
                                {user.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Customer Selection */}
                <FormField
                  control={form.control}
                  name='customer_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select Customer' />
                          </SelectTrigger>
                          <SelectContent>
                            {listCustomer?.payload?.data.map((user: GetUserByRoleType) => (
                              <SelectItem key={user.user_id} value={String(user.user_id)}>
                                {user.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Customer List */}
          <div className='w-1/3'>
            <h3 className='font-bold text-xl mb-4'>Customer</h3>
            <div className='space-y-4 max-h-[70vh] overflow-y-auto'>
              {listCustomer?.payload?.data.map((user: GetUserByRoleType) => (
                <div
                  key={user.user_id}
                  onClick={() => handleSelectCustomer(user.user_id)}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-100 cursor-pointer ${
                    selectedCustomer === user.user_id ? 'bg-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <div className='flex items-center'>
                    <Avatar className='aspect-square w-[50px] h-[50px] rounded-md object-cover'>
                      <AvatarImage
                        src={
                          user.avatar
                            ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
                            : undefined
                        }
                      />
                      <AvatarFallback className='rounded-none'>
                        {user?.full_name
                          ?.split(' ')
                          .map((word: any) => word[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col ml-4'>
                      <div className='space-x-6 flex items-center'>
                        <span className='font-semibold text-lg'>{user.full_name}</span>
                        <Badge className={`px-2 py-1 rounded-md ${roleColors[user.role] || 'bg-gray-300'}`}>
                          {user.role}
                        </Badge>
                      </div>
                      <div>
                        <span className='font-semibold text-sm text-gray-500'>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' form='add-coach-customer-form' className='hover:cursor-pointer'>
            Add Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
