import UserTable from '@/app/dashboard/users/feature/user-table'
import React, { Suspense } from 'react'

export default function User() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserTable />
    </Suspense>
  )
}
