import Footer from '@/components/layouts/footer'
import Header from '@/components/layouts/header'
import React from 'react'

export default function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='bg-white'>
      <Header />
      {children}
      <Footer />
    </main>
  )
}
