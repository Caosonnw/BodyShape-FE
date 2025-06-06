import EquipmentTable from '@/app/dashboard/equipments/feature/equipments-table'
import React, { Suspense } from 'react'

export default function Equipments() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EquipmentTable />
    </Suspense>
  )
}
