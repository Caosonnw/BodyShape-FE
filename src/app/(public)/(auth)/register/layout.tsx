import HeaderTitle from '@/components/layouts/header-title'
import React from 'react'

export default function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='bg-white'>
      <HeaderTitle />
      {children}
    </main>
  )
}
