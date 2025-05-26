import { SideBarProviders } from '@/components/providers'
import React from 'react'

export default function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SideBarProviders>{children}</SideBarProviders>
}
