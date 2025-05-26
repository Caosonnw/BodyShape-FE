'use client'

import { ROUTES } from '@/common/path'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAlert } from '@/context/AlertContext'
import { useAppContext } from '@/context/AppProvider'
import { decodeToken, handleErrorApi } from '@/lib/utils'
import { useLoginMutation } from '@/queries/useAuth'
import { LoginBodyType, LoginSchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const loginMutation = useLoginMutation()
  const { showAlert } = useAlert()
  const router = useRouter()
  const { setRole } = useAppContext()
  const clearTokens = searchParams.get('clearTokens')

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (clearTokens) {
      setRole(undefined)
    }
  }, [clearTokens, setRole])

  const onSubmit = async (data: LoginBodyType) => {
    // Khi nhấn submit thì React hook form sẽ tự động validate cái form bằng zod schema ở client trước
    // Nếu không pass qua vòng này thì sẽ không gọi api
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      showAlert(result.payload.message, 'success')
      const roleDecoded = decodeToken(result.payload.data.accessToken).role
      setRole(roleDecoded)
      router.push(ROUTES.home)
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className='login-form container w-full pb-[90px] pt-[120px]'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-1 gap-6'>
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
          <div className='text-right'>
            <a
              href='/'
              className='text-lg text-black underline hover:text-[#f7244f] transition-all duration-500 ease-in-out'
            >
              Forgot your password?
            </a>
          </div>
          <div className='text-center space-y-4'>
            <p className='text-md'>
              By continuing, you agree to the{' '}
              <a href='/' className='text-black underline hover:text-[#f7244f] transition-all duration-500 ease-in-out'>
                Terms of use
              </a>{' '}
              and{' '}
              <a
                href='/pages/privacy-policy'
                className='text-black underline hover:text-[#f7244f] transition-all duration-500 ease-in-out'
              >
                Privacy Policy
              </a>
            </p>
            <button type='submit' className='btn login-btn min-w-[150px] !bg-[#f7244f] hover:!bg-[#f50637] !text-white'>
              Log in
            </button>
            <p className='text-sm'>
              Don't have an account?{' '}
              <a
                href={ROUTES.register}
                className='text-[#f7244f] underline font-bold hover:text-blue-500 transition-all duration-500 ease-in-out'
              >
                Signup
              </a>
            </p>
          </div>
        </div>
      </form>
    </Form>
  )
}
