'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { useGetAllEquipments } from '@/queries/useEquipment'
import { useGetAllUsers } from '@/queries/useUser'
import { Activity, Brain, Calendar, DollarSign, Dumbbell, Heart, Target, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 45000, members: 32000 },
  { month: 'Feb', revenue: 52000, members: 3400 },
  { month: 'Mar', revenue: 48000, members: 3350 },
  { month: 'Apr', revenue: 61000, members: 3800 },
  { month: 'May', revenue: 55000, members: 36500 },
  { month: 'Jun', revenue: 67000, members: 42000 }
]

const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))'
  },
  members: {
    label: 'Members',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

const aiInsights = [
  {
    id: 1,
    member: 'John Doe',
    insight: 'Recommended to increase cardio intensity by 15%',
    priority: 'medium',
    avatar: '/avatars/shadcn.jpg'
  },
  {
    id: 2,
    member: 'Sarah Wilson',
    insight: 'Potential overtraining detected - suggest rest day',
    priority: 'high',
    avatar: '/avatars/shadcn.jpg'
  },
  {
    id: 3,
    member: 'Mike Johnson',
    insight: 'Goal achievement rate: 85% - on track',
    priority: 'low',
    avatar: '/avatars/shadcn.jpg'
  }
]

const equipmentStatus = [
  { name: 'Treadmill #1', status: 'active', usage: 85 },
  { name: 'Bench Press #2', status: 'maintenance', usage: 0 },
  { name: 'Rowing Machine #3', status: 'active', usage: 62 },
  { name: 'Elliptical #4', status: 'active', usage: 78 }
]

export default function AdminDashboard() {
  const [totalMembers, setTotalMembers] = useState(0)
  const [equipment, setEquipment] = useState<any[]>([])

  const { data: users } = useGetAllUsers()
  const { data: equipmentData } = useGetAllEquipments()

  useEffect(() => {
    const members = users?.payload?.data
    setTotalMembers(Array.isArray(members) ? members.length : 0)

    const equipmentList = equipmentData?.payload?.data
    setEquipment(Array.isArray(equipmentList) ? equipmentList : [])
  }, [users, equipmentData])

  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>AI-powered gym management and health monitoring system</p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='gap-1'>
            <Zap className='h-3 w-3' />
            AI Active
          </Badge>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Members</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalMembers.toLocaleString()}</div>
            <p className='text-xs text-muted-foreground'>
              <span className='text-green-600'>+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Monthly Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$67,000</div>
            <p className='text-xs text-muted-foreground'>
              <span className='text-green-600'>+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Equipment Active</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{equipment.filter((eq) => eq.status === 'ACTIVE').length}</div>
            <p className='text-xs text-muted-foreground'>Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>AI Recommendations</CardTitle>
            <Brain className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-xs text-muted-foreground'>Generated this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {/* <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'> */}
      <Card className='col-span-4'>
        <CardHeader>
          <CardTitle>Revenue & Member Growth</CardTitle>
          <CardDescription>Monthly revenue and member acquisition trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig}>
            <BarChart data={revenueData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='month' tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dashed' />} />
              <Bar dataKey='revenue' fill='var(--color-revenue)' radius={4} />
              <Bar dataKey='members' fill='var(--color-members)' radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* AI Insights and Equipment Status */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              AI Health Insights
            </CardTitle>
            <CardDescription>Recent AI-generated health recommendations for members</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {aiInsights.map((insight) => (
              <div key={insight.id} className='flex items-start space-x-4'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={insight.avatar || '/placeholder.svg'} />
                  <AvatarFallback>
                    {insight.member
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium'>{insight.member}</p>
                    <Badge
                      variant={
                        insight.priority === 'high'
                          ? 'destructive'
                          : insight.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                      className='text-xs'
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>{insight.insight}</p>
                </div>
              </div>
            ))}
            <Button variant='outline' className='w-full'>
              View All Insights
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Dumbbell className='h-5 w-5' />
              Equipment Status
            </CardTitle>
            <CardDescription>Real-time equipment monitoring and usage</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {equipmentStatus.map((equipment, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>{equipment.name}</span>
                  <Badge variant={equipment.status === 'active' ? 'default' : 'destructive'} className='text-xs'>
                    {equipment.status}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <div className='flex justify-between text-xs text-muted-foreground'>
                    <span>Usage</span>
                    <span>{equipment.usage}%</span>
                  </div>
                  <Progress value={equipment.usage} className='h-2' />
                </div>
              </div>
            ))}
            <Button variant='outline' className='w-full'>
              Equipment Management
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
          <CardContent className='flex items-center justify-center p-6'>
            <div className='text-center space-y-2'>
              <Users className='h-8 w-8 mx-auto text-blue-600' />
              <h3 className='font-semibold'>Member Management</h3>
              <p className='text-sm text-muted-foreground'>Add, edit, or view member profiles</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
          <CardContent className='flex items-center justify-center p-6'>
            <div className='text-center space-y-2'>
              <Calendar className='h-8 w-8 mx-auto text-green-600' />
              <h3 className='font-semibold'>Class Scheduling</h3>
              <p className='text-sm text-muted-foreground'>Manage classes and trainers</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
          <CardContent className='flex items-center justify-center p-6'>
            <div className='text-center space-y-2'>
              <Heart className='h-8 w-8 mx-auto text-red-600' />
              <h3 className='font-semibold'>Health Analytics</h3>
              <p className='text-sm text-muted-foreground'>View AI health insights</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
          <CardContent className='flex items-center justify-center p-6'>
            <div className='text-center space-y-2'>
              <Target className='h-8 w-8 mx-auto text-purple-600' />
              <h3 className='font-semibold'>Goal Tracking</h3>
              <p className='text-sm text-muted-foreground'>Monitor member progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
