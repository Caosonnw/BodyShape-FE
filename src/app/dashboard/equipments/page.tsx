import React, { Suspense } from 'react'

export default function Equipments() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Equipments</div>
    </Suspense>
  )
}
