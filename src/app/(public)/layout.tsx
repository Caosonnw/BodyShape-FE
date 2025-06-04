import Footer from '@/components/layouts/footer'
import React from 'react'

export default function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='bg-white'>
      {children}
      <Footer />
    </main>
  )
}
