'use client'
import { DatetimePicker } from '@/components/date-time-picker'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Role } from '@/constants/type'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useGetMembershipById, useUpdateMembershipMutation } from '@/queries/useMembership'
import { useGetAllPackages } from '@/queries/usePackage'
import { useGetAllUsers } from '@/queries/useUser'
import { UpdateMembershipBody, UpdateMembershipBodyType } from '@/schema/membership.schema'
import { AccountType } from '@/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const roleColors: Record<string, string> = {
  [Role.OWNER]: 'bg-red-500 text-white',
  [Role.ADMIN]: 'bg-blue-500 text-white',
  [Role.COACH]: 'bg-yellow-500 text-white',
  [Role.CUSTOMER]: 'bg-green-500 text-white'
}

export default function EditMembership({
  membershipId,
  setId,
  onSubmitSuccess
}: {
  membershipId?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [isDataReady, setIsDataReady] = useState(false)
  const { showAlert } = useAlert()
  const { data } = useGetMembershipById({ membershipId: membershipId as number, enabled: Boolean(membershipId) })
  const { data: dataCustomers } = useGetAllUsers()
  const { data: dataPackages } = useGetAllPackages()
  const updateMembership = useUpdateMembershipMutation()

  const form = useForm<UpdateMembershipBodyType>({
    resolver: zodResolver(UpdateMembershipBody),
    defaultValues: {
      customer_id: 0,
      package_id: 0,
      start_date: new Date().toISOString(),
      status: 'ACTIVE'
    }
  })

  const reset = () => {
    setId(undefined)
  }

  useEffect(() => {
    if (data && data.payload && data.payload.data) {
      const membershipData = data.payload.data
      if (membershipData) {
        const { customer_id, package_id, start_date, status } = membershipData
        console.log(start_date, 'start_date')
        form.reset({
          customer_id,
          package_id,
          start_date: new Date(start_date).toISOString(),
          status
        })

        setSelectedCustomer(customer_id)
        setSelectedPackage(package_id)
        setIsDataReady(true)
      }
    } else {
      setIsDataReady(false)
    }
  }, [data])

  const onSubmit = async (values: UpdateMembershipBodyType) => {
    if (updateMembership.isPending) return
    try {
      let body: UpdateMembershipBodyType & { membershipId: number } = {
        membershipId: membershipId as number,
        ...values
      }
      const result = await updateMembership.mutateAsync(body)
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

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomer(customerId)
    form.setValue('customer_id', customerId)
  }

  const handleSelectPackage = (packageId: number) => {
    setSelectedPackage(packageId)
    form.setValue('package_id', packageId)
  }

  return (
    <Dialog
      open={Boolean(membershipId)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent key={membershipId} className='sm:max-w-[1600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>Fields name, email, password are compulsory</DialogDescription>
        </DialogHeader>
        <div className='flex w-full h-[80vh] gap-4'>
          {/* Customers List */}
          <div className='w-1/3'>
            <h3 className='font-bold text-xl mb-4'>Customers</h3>
            <div className='space-y-4 max-h-[70vh] overflow-y-auto'>
              {dataCustomers?.payload?.data
                .filter((user: AccountType) => user.role === Role.CUSTOMER)
                .map((user: AccountType) => (
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

          {/* Membership Form */}
          <div className='w-1/3'>
            <Form {...form}>
              <form
                noValidate
                className='grid auto-rows-max items-start gap-4 md:gap-8'
                id='edit-membership-form'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Customer Selection */}
                <h1 className='font-bold text-xl'>Add Membership Card</h1>
                <FormField
                  control={form.control}
                  name='customer_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(val) => {
                            field.onChange(Number(val))
                            setSelectedCustomer(Number(val))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select Customer' />
                          </SelectTrigger>
                          <SelectContent>
                            {dataCustomers?.payload?.data
                              .filter((user: AccountType) => user.role === Role.CUSTOMER)
                              .map((user: AccountType) => (
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

                {/* Package Selection */}
                <FormField
                  control={form.control}
                  name='package_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(val) => {
                            field.onChange(Number(val))
                            setSelectedPackage(Number(val))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select Package' />
                          </SelectTrigger>
                          <SelectContent>
                            {dataPackages?.payload?.data?.map((pkg: any) => (
                              <SelectItem key={pkg.package_id} value={String(pkg.package_id)}>
                                {pkg.package_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Date */}
                {isDataReady && (
                  <FormField
                    control={form.control}
                    name='start_date'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DatetimePicker
                            format={[
                              ['days', 'months', 'years'],
                              ['hours', 'minutes', 'am/pm']
                            ]}
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          </div>

          {/* Packages List */}
          <div className='w-1/3'>
            <h3 className='font-bold text-xl mb-4'>Packages</h3>
            <div className='space-y-4 max-h-[70vh] overflow-y-auto'>
              {dataPackages?.payload?.data?.map((pkg: any) => (
                <div
                  key={pkg.package_id}
                  onClick={() => handleSelectPackage(pkg.package_id)}
                  className={`p-4 border rounded-lg hover:bg-gray-100 cursor-pointer ${
                    selectedPackage === pkg.package_id ? 'bg-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <span className='font-semibold text-lg'>{pkg.package_name}</span>
                  <div>
                    <span className='text-sm text-gray-600'>
                      Price: {pkg.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    <span className='ml-4 text-sm text-gray-600'>Duration: {pkg.duration_days} days</span>
                  </div>
                  <p className='text-sm text-gray-500'>{pkg.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' form='edit-membership-form' className='hover:cursor-pointer'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
