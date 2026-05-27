'use client'

import ForAdmin from '@/app/dashboard/checkins/features_for_admin/checkins_for_admin'
import ForCoach from '@/app/dashboard/checkins/features_for_coach/checkins_for_coach'
import ForCustomer from '@/app/dashboard/checkins/features_for_customer/checkins_for_customer'
import { useAccountMe } from '@/queries/useUser'
import { useEffect, useState } from 'react'

export default function Checkins() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [roleUser, setRoleUser] = useState<string | null>(null)
  const [userId, setUserId] = useState<number>(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken'))
    }
  }, [])

  const { data: meData } = useAccountMe(accessToken || undefined)

  useEffect(() => {
    if (meData) {
      setRoleUser(meData.payload.data.role)
      setUserId(meData.payload.data.user_id)
    }
  }, [meData])
  if (roleUser === 'OWNER' || roleUser === 'ADMIN') {
    return <ForAdmin />
  } else if (roleUser === 'COACH') {
    return <ForCoach user_id={userId} />
  } else {
    return <ForCustomer />
  }
}
