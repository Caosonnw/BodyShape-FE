'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAccountMe } from '@/queries/useUser'
import { motion } from 'framer-motion'
import { Activity, CalendarDays, Clock3, Dumbbell, Flame, Pencil, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CoachDashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken'))
    }
  }, [])

  const { data: meData } = useAccountMe(accessToken || undefined)

  const user = meData?.payload?.data

  const stats = [
    {
      title: 'Today Sessions',
      value: '6',
      icon: CalendarDays,
      description: '2 upcoming'
    },
    {
      title: 'Active Clients',
      value: '18',
      icon: Users,
      description: '3 new this week'
    },
    {
      title: 'Workout Plans',
      value: '12',
      icon: Dumbbell,
      description: 'Currently active'
    },
    {
      title: 'Completion Rate',
      value: '89%',
      icon: Activity,
      description: 'This month'
    }
  ]

  const todaySchedule = [
    {
      time: '08:00 AM',
      client: 'John Doe',
      type: 'Strength Training'
    },
    {
      time: '10:30 AM',
      client: 'Sarah Wilson',
      type: 'Nutrition Check-in'
    },
    {
      time: '02:00 PM',
      client: 'Michael',
      type: 'Leg Day Session'
    }
  ]

  const activeClients = [
    {
      name: 'Emily Johnson',
      goal: 'Fat Loss Program',
      status: 'Active'
    },
    {
      name: 'David Lee',
      goal: 'Muscle Building',
      status: 'Progress'
    },
    {
      name: 'Sophia Brown',
      goal: 'Cardio Fitness',
      status: 'Active'
    }
  ]

  return (
    <div className='min-h-screen flex flex-1 flex-col gap-6 bg-white text-black p-6'>
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className='overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-white shadow-2xl'>
          <CardContent className='flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-center gap-5'>
              <Avatar className='h-24 w-24 border-4 border-white/20 shadow-xl'>
                <AvatarImage
                  src={
                    user?.avatar ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}` : undefined
                  }
                  className='object-cover'
                />

                <AvatarFallback className='text-xl font-bold'>
                  {user?.full_name
                    ?.split(' ')
                    ?.map((word: string) => word[0])
                    ?.join('')
                    ?.slice(0, 2)
                    ?.toUpperCase() || 'CU'}
                </AvatarFallback>
              </Avatar>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <h1 className='text-3xl font-bold tracking-tight'>{user?.full_name}</h1>

                  <Badge className='rounded-full bg-white text-black hover:bg-white'>Coach</Badge>
                </div>

                <p className='text-sm text-zinc-300'>{user?.email}</p>

                <div className='flex items-center gap-2 text-sm text-zinc-400'>
                  <Clock3 className='h-4 w-4' />
                  Ready to coach today
                </div>
              </div>
            </div>

            <Button className='rounded-full bg-white text-black hover:bg-zinc-200'>
              <Pencil className='mr-2 h-4 w-4' />
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* STATS */}
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className='rounded-3xl border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-2'>
                      <p className='text-sm text-muted-foreground'>{item.title}</p>

                      <h2 className='text-3xl font-bold'>{item.value}</h2>

                      <p className='text-xs text-green-500'>{item.description}</p>
                    </div>

                    <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10'>
                      <Icon className='h-7 w-7 text-primary' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* MAIN GRID */}
      <div className='grid gap-6 xl:grid-cols-3'>
        {/* SCHEDULE */}
        <Card className='rounded-3xl border-0 shadow-md xl:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CalendarDays className='h-5 w-5 text-primary' />
              Today Schedule
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            {todaySchedule.map((session, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-2xl border p-4 transition-all hover:bg-muted/50'
              >
                <div className='space-y-1'>
                  <p className='font-semibold'>{session.client}</p>

                  <p className='text-sm text-muted-foreground'>{session.type}</p>
                </div>

                <Badge variant='secondary' className='bg-primary text-white'>
                  {session.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CLIENT PROGRESS */}
        <Card className='rounded-3xl border-0 shadow-md'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-primary' />
              Client Progress
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div>
              <div className='mb-2 flex justify-between text-sm'>
                <span>Fat Loss Progress</span>
                <span>72%</span>
              </div>

              <Progress value={72} className='h-3 rounded-full' />
            </div>

            <div>
              <div className='mb-2 flex justify-between text-sm'>
                <span>Strength Improvement</span>
                <span>84%</span>
              </div>

              <Progress value={84} className='h-3 rounded-full' />
            </div>

            <div>
              <div className='mb-2 flex justify-between text-sm'>
                <span>Workout Completion</span>
                <span>91%</span>
              </div>

              <Progress value={91} className='h-3 rounded-full' />
            </div>

            <div className='rounded-2xl bg-primary/10 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white'>
                  <Flame className='h-6 w-6' />
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Calories Burned</p>

                  <h3 className='text-2xl font-bold'>12,840</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ACTIVE CLIENTS */}
      <Card className='rounded-3xl border-0 shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Active Clients
          </CardTitle>
        </CardHeader>

        <CardContent className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {activeClients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='rounded-3xl border p-5 transition-all hover:-translate-y-1 hover:shadow-lg'
            >
              <div className='flex items-center gap-4'>
                <Avatar className='h-14 w-14'>
                  <AvatarFallback>
                    {client.name
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className='space-y-1'>
                  <p className='font-semibold'>{client.name}</p>

                  <p className='text-sm text-muted-foreground'>{client.goal}</p>

                  <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>{client.status}</Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
