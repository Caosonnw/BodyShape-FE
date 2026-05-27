'use client'

import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Dumbbell } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950'>
      <div className='relative flex flex-col items-center gap-6'>
        {/* Glow */}
        <div className='absolute h-40 w-40 rounded-full bg-primary/20 blur-3xl' />

        {/* Animated Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.5
          }}
        >
          <Card className='flex flex-col items-center gap-5 rounded-[32px] border-0 bg-white p-10 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/70'>
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5
              }}
              className='flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-white shadow-lg'
            >
              <Dumbbell className='h-10 w-10' />
            </motion.div>

            {/* Text */}
            <div className='space-y-2 text-center'>
              <h2 className='text-2xl font-bold tracking-tight text-white'>Loading Dashboard</h2>

              <p className='text-sm text-muted-foreground'>Preparing your fitness workspace...</p>
            </div>

            {/* Progress */}
            <div className='flex gap-2'>
              {[0, 1, 2].map((item) => (
                <motion.div
                  key={item}
                  animate={{
                    y: [0, -8, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: item * 0.15
                  }}
                  className='h-3 w-3 rounded-full bg-primary'
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
