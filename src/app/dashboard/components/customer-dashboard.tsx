'use client'

import { ROUTES } from '@/common/path'
import DonutChart from '@/components/animata/graphs/ring-chart'
import StarRating_Basic from '@/components/commerce-ui/star-rating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useAccountMe } from '@/queries/useUser'
import { motion } from 'framer-motion'
import { Activity, Brain, Crown, Flame, Heart, MessageCircle, Pencil, Star, Trophy, Users, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CustomerDashboard() {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken'))
    }
  }, [])

  const { data: meData } = useAccountMe(accessToken || undefined)

  const user = meData?.payload?.data

  const rings = [
    { progress: 10, trackClassName: 'text-rose-600/10', progressClassName: 'text-rose-600' },
    { progress: 60, trackClassName: 'text-lime-500/20', progressClassName: 'text-lime-500' },
    { progress: 40, trackClassName: 'text-teal-400/30', progressClassName: 'text-teal-400' }
  ]

  const achievements = [
    '🔥 7 Day Streak',
    '🏋️ First Workout',
    '⚡ Burned 10K Calories',
    '🎯 Goal Crusher',
    '💪 Elite Member'
  ]

  return (
    <div className='flex flex-1 flex-col gap-6 p-6 min-h-screen'>
      {/* HERO PROFILE */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className='relative overflow-hidden border-0 rounded-4xl!'>
          <div className='absolute inset-0' />

          <CardContent className='relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8'>
            <div className='flex items-center gap-5'>
              <Avatar className='h-24 w-24 rounded-full border-4 border-primary shadow-xl'>
                <AvatarImage
                  src={user?.avatar ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}` : ''}
                  className='object-cover'
                />

                <AvatarFallback className='text-xl font-bold border-primary'>
                  {user?.full_name
                    ?.split(' ')
                    ?.map((word: string) => word[0])
                    ?.join('')
                    ?.slice(0, 2)
                    ?.toUpperCase() || 'CU'}
                </AvatarFallback>
              </Avatar>

              <div className='space-y-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h1 className='text-3xl font-bold tracking-tight'>{user?.full_name}</h1>

                  <Badge className='rounded-full bg-primary text-white'>Customer</Badge>
                </div>
                <p className='text-zinc-400 text-sm'>{user?.email}</p>
              </div>
            </div>

            <Button className='rounded-full bg-primary text-white hover:bg-primary/90'>
              <Pencil className='mr-2 h-6 w-6' />
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* RINGS + AI */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* APPLE RINGS */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className='border-0 bg-white rounded-4xl! overflow-hidden'>
            <CardHeader>
              <CardTitle className='text-black flex items-center gap-2'>
                <Activity className='h-5 w-5 text-red-400' />
                Today Activity
              </CardTitle>

              <CardDescription className='text-zinc-400'>Your Apple Watch style fitness rings</CardDescription>
            </CardHeader>

            <CardContent className='flex flex-col items-center gap-8'>
              <DonutChart size={180} gap={6} width={22} rings={rings} />

              <div className='grid w-full grid-cols-3 gap-4'>
                <div className='rounded-3xl bg-red-500/10 p-4'>
                  <p className='text-xs text-zinc-400'>Calories</p>
                  <h3 className='text-2xl font-bold text-red-400'>720</h3>
                  <p className='text-xs text-zinc-500'>/ 1000 kcal</p>
                </div>

                <div className='rounded-3xl bg-lime-500/10 p-4'>
                  <p className='text-xs text-zinc-400'>Workout</p>
                  <h3 className='text-2xl font-bold text-lime-400'>54</h3>
                  <p className='text-xs text-zinc-500'>/ 90 mins</p>
                </div>

                <div className='rounded-3xl bg-cyan-500/10 p-4'>
                  <p className='text-xs text-zinc-400'>Steps</p>
                  <h3 className='text-2xl font-bold text-cyan-400'>8.2k</h3>
                  <p className='text-xs text-zinc-500'>/ 10k</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI INSIGHT */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className='border-0 rounded-4xl! bg-white to-black overflow-hidden'>
            <CardContent className='p-8 h-full flex flex-col justify-between'>
              <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                  <div className='rounded-3xl bg-primary p-4 backdrop-blur'>
                    <Brain className='h-8 w-8 text-white' />
                  </div>

                  <div>
                    <h2 className='text-2xl font-bold text-black'>AI Coach Insight</h2>

                    <p className='text-white/70'>Personalized recommendation</p>
                  </div>
                </div>

                <div className='rounded-3xl bg-primary p-6 backdrop-blur'>
                  <p className='text-lg text-white leading-relaxed'>
                    Your recovery score is excellent today. Perfect day for strength training and progressive overload.
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='rounded-2xl bg-primary p-4'>
                    <p className='text-sm text-white'>Recovery</p>

                    <h3 className='text-3xl font-bold text-white'>92%</h3>
                  </div>

                  <div className='rounded-2xl bg-primary p-4'>
                    <p className='text-sm text-white'>Sleep Quality</p>

                    <h3 className='text-3xl font-bold text-white'>8.5h</h3>
                  </div>
                </div>
              </div>

              <Button className='mt-6 rounded-full bg-primary text-white hover:bg-primary/90'>
                <Zap className='mr-2 h-4 w-4' />
                Generate Workout Plan
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* COACHES */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className='border-0 bg-white rounded-4xl!'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-black'>
              <Users className='h-5 w-5 text-primary' />
              Your Coaches
            </CardTitle>

            <CardDescription className='text-zinc-400'>Coaches supporting your fitness journey</CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            {user?.coach_customers?.map((coach: any) => (
              <div
                key={coach.coach_id}
                className='rounded-[28px]! border border-gray-300/30 bg-white p-5 transition-all hover:bg-white/10'
              >
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>
                  <div className='flex items-center gap-4'>
                    <div className='relative'>
                      <Avatar className='h-20 w-20 rounded-full border-2 border-primary'>
                        <AvatarImage
                          src={
                            coach.coach_avatar
                              ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${coach.coach_avatar}`
                              : ''
                          }
                          className='object-cover'
                        />

                        <AvatarFallback className='bg-primary text-zinc-700 font-semibold'>
                          {coach.coach_full_name
                            ?.split(' ')
                            ?.map((word: string) => word[0])
                            ?.join('')
                            ?.slice(0, 2)
                            ?.toUpperCase() || 'CO'}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-xl font-semibold text-black'>{coach.coach_full_name}</h3>

                        <Badge className='bg-primary text-white'>Coach</Badge>
                      </div>

                      <p className='text-black text-sm'>{coach.coach_email}</p>

                      <div className='flex flex-wrap gap-3'>
                        <div className='rounded-xl bg-primary px-3 py-2'>
                          <p className='text-xs text-white'>Rating</p>

                          <h4 className='font-bold text-white'>4.9 ⭐</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-3'>
                    <Button
                      className='rounded-full bg-primary text-white hover:bg-primary/90'
                      onClick={() => router.push(`${ROUTES.dashboardRoutes.chat}`)}
                    >
                      <MessageCircle className='mr-2 h-4 w-4' />
                      Message
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='rounded-full border-white/10 bg-primary text-black hover:bg-primary/90'
                        >
                          <Star className='mr-2 h-4 w-4' />
                          Rate Coach
                        </Button>
                      </DialogTrigger>

                      <DialogContent className='border-zinc-800 bg-white text-black'>
                        <DialogHeader>
                          <DialogTitle>Rate Your Coach</DialogTitle>

                          <DialogDescription className='text-zinc-400'>
                            Share your experience and feedback
                          </DialogDescription>
                        </DialogHeader>

                        <div className='space-y-6 pt-4'>
                          <div className='flex justify-center gap-3'>
                            <StarRating_Basic />
                          </div>

                          <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Write your feedback here...'
                            className='min-h-[140px] border-zinc-800 bg-white text-white'
                          />

                          <Button className='w-full rounded-full bg-white text-black hover:bg-primary hover:text-white hover:cursor-pointer'>
                            Submit Review
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* PROGRESS + STREAK */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card className='border-0 bg-white rounded-4xl!'>
          <CardHeader>
            <CardTitle className='text-black flex items-center gap-2'>
              <Flame className='h-5 w-5 text-orange-400' />
              Attendance Streak
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-6xl font-black text-black'>12</h2>

                <p className='text-zinc-400'>consecutive days</p>
              </div>

              <div className='rounded-full bg-orange-500/10 p-6 text-5xl'>🔥</div>
            </div>

            <Progress value={80} className='h-3' />

            <p className='text-sm text-zinc-400'>3 more days to unlock Elite Badge</p>
          </CardContent>
        </Card>

        <Card className='border-0 bg-white rounded-4xl!'>
          <CardHeader>
            <CardTitle className='text-black flex items-center gap-2'>
              <Heart className='h-5 w-5 text-pink-400' />
              Nutrition Summary
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-5'>
            <div>
              <div className='mb-2 flex justify-between text-sm'>
                <span>Protein</span>
                <span>120g / 150g</span>
              </div>

              <Progress value={80} className='h-2' />
            </div>

            <div>
              <div className='mb-2 flex justify-between text-sm'>
                <span>Carbs</span>
                <span>210g / 300g</span>
              </div>

              <Progress value={70} className='h-2' />
            </div>

            <div>
              <div className='mb-2 flex justify-between text-sm'>
                <span>Water</span>
                <span>2.4L / 3L</span>
              </div>

              <Progress value={85} className='h-2' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ACHIEVEMENTS */}
      <Card className='border-0 bg-white rounded-4xl!'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-black'>
            <Trophy className='h-5 w-5 text-yellow-400' />
            Achievements
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ScrollArea className='w-full whitespace-nowrap'>
            <div className='flex gap-4 pb-4'>
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className='min-w-[220px] rounded-3xl bg-gradient-to-br from-zinc-800 to-white border border-white/10 p-6'
                >
                  <div className='space-y-3'>
                    <div className='rounded-2xl bg-yellow-500/10 p-4 w-fit'>
                      <Crown className='h-8 w-8 text-primary' />
                    </div>

                    <h3 className='font-semibold text-white'>{achievement}</h3>

                    <p className='text-sm text-white'>Achievement unlocked successfully</p>
                  </div>
                </div>
              ))}
            </div>

            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* MOTIVATION */}
      <Card className='border-0 rounded-4xl! bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 overflow-hidden'>
        <CardContent className='p-8'>
          <div className='flex items-center justify-between gap-6'>
            <div className='space-y-3'>
              <Badge className='bg-white/20 text-black hover:bg-white/30'>Daily Motivation</Badge>

              <h2 className='text-3xl font-bold text-black leading-tight'>
                Discipline is choosing between what you want now and what you want most.
              </h2>

              <p className='text-white/80'>Keep showing up. Your future self will thank you.</p>
            </div>

            <div className='hidden lg:block text-8xl'>💪</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
