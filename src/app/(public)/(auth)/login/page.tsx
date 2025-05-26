import LoginForm from '@/app/(public)/(auth)/login/login-form'
import PageTitle from '@/components/layouts/page-title'
import React, { Suspense } from 'react'

export default function Login() {
  return (
    <div>
      <PageTitle parentTitle='Home' activePage='Login' />
      <Suspense fallback={<div className='flex h-screen items-center justify-center'>Loading...</div>}>
        <div style={{ backgroundImage: 'url(images/background-section.png)', backgroundSize: 'cover' }}>
          <LoginForm />
        </div>
      </Suspense>
    </div>
  )
}
