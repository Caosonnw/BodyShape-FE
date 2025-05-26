import RegisterForm from '@/app/(public)/(auth)/register/register-form'
import PageTitle from '@/components/layouts/page-title'
import React, { Suspense } from 'react'

export default function Register() {
  return (
    <div>
      <PageTitle parentTitle='Home' activePage='Register' />
      <Suspense fallback={<div className='flex h-screen items-center justify-center'>Loading...</div>}>
        <div style={{ backgroundImage: 'url(images/background-section.png)', backgroundSize: 'cover' }}>
          <RegisterForm />
        </div>
      </Suspense>
    </div>
  )
}
