'use client'

import { ROUTES } from '@/common/path'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAlert } from '@/context/AlertContext'
import { RegisterBody, RegisterBodyType } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function RegisterForm() {
  const { showAlert } = useAlert()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      gender: '1' as '1' | '0',
      date_of_birth: undefined as string | undefined,
      phone_number: undefined as string | undefined
    }
  })

  const onSubmit = async (data: RegisterBodyType) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className='register-form container w-full pb-[90px] pt-[120px]'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-1 gap-6'>
          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <div className='grid gap-2'>
                  <Label htmlFor='full_name' className='text-[16px] font-medium'>
                    Full name<sup aria-hidden='true'>*</sup>
                  </Label>
                  <Input
                    id='full_name'
                    type='full_name'
                    placeholder='John Doe'
                    required
                    {...field}
                    className='px-[15px] py-[23px] border-black'
                  />
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <div className='grid gap-2'>
                  <Label htmlFor='email' className='text-[16px] font-medium'>
                    Email<sup aria-hidden='true'>*</sup>
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='example@gmail.com'
                    required
                    {...field}
                    className='px-[15px] py-[23px] border-black'
                  />
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='grid gap-2'>
                  <Label htmlFor='password' className='text-[16px] font-medium'>
                    Password<sup aria-hidden='true'>*</sup>
                  </Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='********'
                    required
                    {...field}
                    className='px-[15px] py-[23px] border-black'
                  />
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className='flex justify-between'>
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <Label htmlFor='gender' className='text-[16px] font-medium'>
                      Gender<sup aria-hidden='true'>*</sup>
                    </Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1'>Male</SelectItem>
                        <SelectItem value='0'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='date_of_birth'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <Label htmlFor='date_of_birth' className='text-[16px] font-medium'>
                      Date of birth<sup aria-hidden='true'>*</sup>
                    </Label>
                    {/* <DatePicker
                      endYear={new Date().getFullYear()}
                      value={field.value ? new Date(field.value) : undefined}
                      onDateChange={(date) => {
                        const formattedDate = format(date, 'yyyy-MM-dd')
                        field.onChange(formattedDate)
                      }}
                    /> */}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='phone_number'
            render={({ field }) => (
              <FormItem>
                <div className='grid gap-2'>
                  <Label htmlFor='phone_number' className='text-[16px] font-medium'>
                    Phone number<sup aria-hidden='true'>*</sup>
                  </Label>
                  <Input
                    id='phone_number'
                    type='phone_number'
                    placeholder='0123456789'
                    required
                    {...field}
                    className='px-[15px] py-[23px] border-black'
                  />
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className='text-center space-y-4'>
            <button type='submit' className='btn login-btn min-w-[150px] !bg-[#f7244f] hover:!bg-[#f50637] !text-white'>
              Register
            </button>
            <p className='text-sm'>
              Already Have An Account?{' '}
              <a
                href={ROUTES.login}
                className='text-[#f7244f] underline font-bold hover:text-blue-500 transition-all duration-500 ease-in-out'
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </form>
    </Form>
  )
}
