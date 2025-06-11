import RingChart from '@/components/animata/graphs/ring-chart'
import React from 'react'

export default function TrainingPlans() {
  return (
    <div className='max-w-2'>
      <RingChart
        rings={[
          {
            progress: 10,
            progressClassName: 'text-rose-600',
            trackClassName: 'text-rose-600/10'
          },
          {
            progress: 60,
            progressClassName: 'text-lime-500',
            trackClassName: 'text-lime-500/20'
          },
          {
            progress: 40,
            progressClassName: 'text-teal-400',
            trackClassName: 'text-teal-400/30'
          }
        ]}
      />
    </div>
  )
}
