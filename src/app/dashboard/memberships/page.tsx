import MembershipTable from '@/app/dashboard/memberships/feature/membership-table'
import React, { Suspense } from 'react'

export default function Memberships() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MembershipTable />
    </Suspense>
  )
}
