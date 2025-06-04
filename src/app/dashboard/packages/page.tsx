import PackageTable from '@/app/dashboard/packages/feature/package-table'
import React, { Suspense } from 'react'

export default function Packages() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PackageTable />
    </Suspense>
  )
}
