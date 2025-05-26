import React, { Suspense } from 'react'

export default function Memberships() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Memberships</div>
    </Suspense>
  )
}
