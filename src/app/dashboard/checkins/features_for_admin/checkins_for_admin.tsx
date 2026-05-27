'use client'

import { useMemo, useState } from 'react'
import { useGetAllCheckins, useGetCheckinByToDay } from '@/queries/useCheckin'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Activity, FileCheck, Inbox, LogIn, LogOut } from 'lucide-react'

export default function ForAdmin() {
  const [tab, setTab] = useState('today')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')

  const todayQuery = useGetCheckinByToDay()
  const allQuery = useGetAllCheckins()

  const loading = tab === 'today' ? todayQuery.isLoading : allQuery.isLoading

  const rawData = tab === 'today' ? todayQuery.data?.payload.data || [] : allQuery.data?.payload.data || []

  const checkins = useMemo(() => {
    return rawData.filter((item: any) => {
      const matchSearch =
        item.users.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.users.email?.toLowerCase().includes(search.toLowerCase())

      const matchRole = role === 'all' || item.users.role === role

      return matchSearch && matchRole
    })
  }, [rawData, search, role])

  const activeCount = checkins.filter((item: any) => !item.checkout_time).length

  const checkedOutCount = checkins.length - activeCount

  return (
    <div className='mx-6 space-y-6 pb-10'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Check-in Management</h1>

        <p className='text-muted-foreground'>Manage check-in of coaches and customers</p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardContent className='flex items-center justify-between p-6'>
            <div>
              <p className='text-sm text-muted-foreground'>Total Checkins</p>

              <h2 className='text-3xl font-bold'>{checkins.length}</h2>
            </div>

            <div className='rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30'>
              <FileCheck className='h-5 w-5' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='flex items-center justify-between p-6'>
            <div>
              <p className='text-sm text-muted-foreground'>Active Users</p>

              <h2 className='text-3xl font-bold'>{activeCount}</h2>
            </div>

            <div className='rounded-xl bg-green-100 p-3 dark:bg-green-900/30'>
              <Activity className='h-5 w-5 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='flex items-center justify-between p-6'>
            <div>
              <p className='text-sm text-muted-foreground'>Checked Out</p>

              <h2 className='text-3xl font-bold'>{checkedOutCount}</h2>
            </div>

            <div className='rounded-xl p-3 bg-red-100 text-red-600 dark:bg-red-900/30'>
              <LogOut className='h-5 w-5' />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value='today'>Today</TabsTrigger>

            <TabsTrigger value='all'>All</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='flex flex-col gap-3 md:flex-row'>
          <Input
            placeholder='Search user...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full md:w-[250px]'
          />

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className='w-full md:w-[180px]'>
              <SelectValue placeholder='Role' />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>

              <SelectItem value='COACH'>Coach</SelectItem>

              <SelectItem value='CUSTOMER'>Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className='overflow-hidden'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-32 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : checkins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-40'>
                    <div className='flex flex-col items-center justify-center gap-3 text-center'>
                      <div className='rounded-full bg-muted p-4'>
                        <Inbox className='h-8 w-8 text-muted-foreground' />
                      </div>

                      <div>
                        <p className='font-medium'>No one checked in today</p>

                        <p className='text-sm text-muted-foreground'>
                          Check-in data will be displayed here when users check in.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                checkins.map((item: any) => (
                  <TableRow key={item.checkin_id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10 rounded-md'>
                          <AvatarImage
                            src={
                              item.users.avatar
                                ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${item.users.avatar}`
                                : ''
                            }
                            alt={item.users.full_name || 'Avatar'}
                            className='object-cover'
                          />

                          <AvatarFallback className='rounded-md text-xs font-semibold'>
                            {item.users.full_name
                              ?.trim()
                              ?.split(' ')
                              ?.map((word: string) => word[0])
                              ?.join('')
                              ?.slice(0, 2)
                              ?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className='font-medium'>{item.users.full_name}</div>

                          <div className='text-sm text-muted-foreground'>{item.users.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant='outline'>{item.users.role}</Badge>
                    </TableCell>

                    <TableCell>{format(new Date(item.checkin_time), 'HH:mm dd/MM/yyyy')}</TableCell>

                    <TableCell>
                      {item.checkout_time ? format(new Date(item.checkout_time), 'HH:mm dd/MM/yyyy') : '--'}
                    </TableCell>

                    <TableCell>
                      {!item.checkout_time ? (
                        <Badge className='bg-green-600 hover:bg-green-700'>Active</Badge>
                      ) : (
                        <Badge className='text-white' variant='secondary'>
                          Checked Out
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
