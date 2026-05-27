'use client'

import AdminDashboard from '@/app/dashboard/components/admin-dasboard'
import CoachDashboard from '@/app/dashboard/components/coach-dashboard'
import CustomerDashboard from './components/customer-dashboard'
import DashboardLoading from './components/dashboard-loading'
import { useAccountMe } from '@/queries/useUser'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken'))
    }
  }, [])

  const { data: meData, isLoading } = useAccountMe(accessToken || undefined)

  const user = meData?.payload?.data

  if (isLoading) {
    return <DashboardLoading />
  }

  if (!user) {
    return <DashboardLoading />
  }

  if (user.role === 'OWNER' || user.role === 'ADMIN') {
    return <AdminDashboard />
  }

  if (user.role === 'COACH') {
    return <CoachDashboard />
  }

  return <CustomerDashboard />
}
