'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { useCreateUserMutation } from '@/queries/useUser'
import { CreateUserBody, CreateUserBodyType } from '@/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, PlusCircle, Upload } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddUser() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const today = new Date()
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<Date | undefined>(today)
  const [inputValue, setInputValue] = useState('')
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [fileImage, setFileImage] = useState<File | null>(null)
  const addUserMutation = useCreateUserMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const { showAlert } = useAlert()
  const form = useForm<CreateUserBodyType>({
    resolver: zodResolver(CreateUserBody),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      gender: true,
      date_of_birth: '',
      phone_number: '',
      avatar: undefined,
      role: 'CUSTOMER'
    }
  })
  const avatar = form.watch('avatar')
  const name = form.watch('full_name')
  const previewAvatar = useMemo(() => {
    if (fileImage) {
      return URL.createObjectURL(fileImage)
    }
    return avatar
  }, [fileImage, avatar])

  const reset = () => {
    form.reset()
    setFileImage(null)
  }

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue('')
      setDate(undefined)
      form.setValue('date_of_birth', '')
    } else {
      const formatted = format(date, 'yyyy-MM-dd')
      setDate(date)
      setMonth(date)
      setInputValue(formatted)
      form.setValue('date_of_birth', formatted)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value) {
      const parsedDate = new Date(value)
      setDate(parsedDate)
      setMonth(parsedDate)
      form.setValue('date_of_birth', value)
    } else {
      setDate(undefined)
      form.setValue('date_of_birth', '')
    }
  }

  useEffect(() => {
    setInputValue(format(today, 'yyyy-MM-dd'))
  }, [])

  const onSubmit = async (values: CreateUserBodyType) => {
    if (addUserMutation.isPending) return
    try {
      let body = values
      if (fileImage) {
        const formData = new FormData()
        formData.append('avatar', fileImage)

        const uploadImageResult = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageResult.payload.data
        body = { ...values, avatar: imageUrl }
      }
      const result = await addUserMutation.mutateAsync(body)

      // queryClient.invalidateQueries({ queryKey: ['getAllUsers'] })

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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto' onEscapeKeyDown={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>Fields name, email, password are compulsory</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-user-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 py-4'>
              {/* Form Avatar  */}
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        accept='image/*'
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFileImage(file)
                            field.onChange(file.name)
                          }
                        }}
                        className='hidden'
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              {/* Form Full Name  */}
              <FormField
                control={form.control}
                name='full_name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Full name</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' placeholder='John Doe' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Form Email  */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='email'
                          placeholder='example@gmail.com'
                          autoComplete='email'
                          className='w-full'
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Form Password  */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='password'>Password</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='password'
                          placeholder='********'
                          autoComplete='current-password'
                          className='w-full'
                          type='password'
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className='flex gap-4'>
                {/* LEFT: Gender, Phone, Role */}
                <div className='flex flex-col gap-4 w-1/2'>
                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name='gender'
                    render={({ field }) => (
                      <FormItem>
                        <div className='grid gap-2'>
                          <Label htmlFor='gender'>Gender</Label>
                          <Select onValueChange={(val) => field.onChange(val === 'true')} value={String(field.value)}>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select gender' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='true'>Male</SelectItem>
                              <SelectItem value='false'>Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name='phone_number'
                    render={({ field }) => (
                      <FormItem>
                        <div className='grid gap-2'>
                          <Label htmlFor='phone_number'>Phone number</Label>
                          <Input id='phone_number' type='text' placeholder='0123456789' className='w-full' {...field} />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Role */}
                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem>
                        <div className='grid gap-2'>
                          <Label htmlFor='role'>Role</Label>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select role' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='ADMIN'>ADMIN</SelectItem>
                              <SelectItem value='COACH'>COACH</SelectItem>
                              <SelectItem value='CUSTOMER'>CUSTOMER</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* RIGHT: Calendar */}
                <div className='w-1/2'>
                  <FormField
                    control={form.control}
                    name='date_of_birth'
                    render={({ field }) => (
                      <FormItem>
                        <div className='grid gap-2'>
                          <Label htmlFor='date_of_birth'>Date of birth</Label>
                          <Calendar
                            mode='single'
                            className='p-2 bg-background'
                            selected={date}
                            onSelect={handleDayPickerSelect}
                            month={month}
                            onMonthChange={setMonth}
                          />
                          <div className='border-t border-border p-3'>
                            <div className='flex items-center gap-3'>
                              <Label className='text-xs'>Enter date</Label>
                              <div className='relative grow'>
                                <Input
                                  type='date'
                                  value={inputValue}
                                  onChange={handleInputChange}
                                  className='peer ps-9 [&::-webkit-calendar-picker-indicator]:hidden'
                                  aria-label='Select date'
                                />
                                <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
                                  <CalendarIcon size={16} strokeWidth={2} aria-hidden='true' />
                                </div>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-user-form' className='hover:cursor-pointer'>
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
