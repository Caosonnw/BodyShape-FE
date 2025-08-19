'use client'

import { ROUTES } from '@/common/path'
import RenderMenu from '@/components/renderMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { Role } from '@/constants/type'
import { useAlert } from '@/context/AlertContext'
import { useAppContext } from '@/context/AppProvider'
import { useSelfPresence } from '@/hooks/use-self-presence'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useAccountMe } from '@/queries/useUser'
import {
  Award,
  Calendar,
  ChevronsUpDown,
  CreditCard,
  Dumbbell,
  IdCard,
  LayoutDashboard,
  LogOut,
  MapPinCheck,
  MessageSquare,
  PieChart,
  Settings,
  UserCog,
  UsersRound
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const dataSideBar = {
  navMain: [
    {
      title: 'Dash Board',
      url: ROUTES.dashboard,
      icon: LayoutDashboard,
      role: [Role.OWNER, Role.ADMIN, Role.COACH, Role.CUSTOMER]
    },
    {
      title: 'Users',
      icon: UsersRound,
      role: [Role.OWNER],
      items: [
        {
          title: 'Users',
          url: ROUTES.dashboardRoutes.users
        },
        {
          title: 'Coach & Customer',
          url: ROUTES.dashboardRoutes.coachCustomer
        }
      ]
    },
    {
      title: 'Training schedule',
      url: ROUTES.dashboardRoutes.schedules,
      icon: Calendar,
      role: [Role.ADMIN, Role.COACH, Role.CUSTOMER]
    },
    {
      title: 'Packages',
      url: ROUTES.dashboardRoutes.packages,
      icon: CreditCard,
      role: [Role.OWNER]
    },
    {
      title: 'Memberships',
      url: ROUTES.dashboardRoutes.memberships,
      icon: IdCard,
      role: [Role.OWNER]
    },
    {
      title: 'Plans',
      url: ROUTES.dashboardRoutes.plans,
      icon: PieChart,
      role: [Role.CUSTOMER]
    },
    {
      title: 'Chats',
      icon: MessageSquare,
      role: [Role.OWNER, Role.ADMIN, Role.COACH, Role.CUSTOMER],
      items: [
        {
          title: 'Chats',
          url: ROUTES.dashboardRoutes.chat
        },
        {
          title: 'Chat With AI',
          url: ROUTES.dashboardRoutes.chatWithAI
        }
      ]
    },
    {
      title: 'Training',
      icon: Award,
      role: [Role.OWNER, Role.ADMIN, Role.COACH],
      items: [
        {
          title: 'Training Plans',
          url: ROUTES.dashboardRoutes.trainingPlans,
          role: [Role.OWNER, Role.ADMIN, Role.COACH]
        },
        {
          title: 'Exercises',
          url: ROUTES.dashboardRoutes.exercises,
          role: [Role.OWNER, Role.ADMIN, Role.COACH]
        },
        {
          title: 'Plan Exercises',
          url: ROUTES.dashboardRoutes.planExcercises,
          role: [Role.OWNER, Role.ADMIN, Role.COACH]
        },
        {
          title: 'Workout Logs',
          url: ROUTES.dashboardRoutes.workoutLogs,
          role: [Role.OWNER, Role.ADMIN, Role.COACH]
        }
      ]
    },

    {
      title: 'Equipments',
      url: ROUTES.dashboardRoutes.equipments,
      icon: Dumbbell,
      role: [Role.OWNER, Role.ADMIN, Role.COACH]
    },
    {
      title: 'Checkins',
      url: ROUTES.dashboardRoutes.checkins,
      icon: MapPinCheck,
      role: [Role.OWNER, Role.ADMIN, Role.COACH]
    }
  ]
}

const roleColors: Record<string, string> = {
  [Role.OWNER]: 'bg-red-500 text-white',
  [Role.ADMIN]: 'bg-blue-500 text-white',
  [Role.COACH]: 'bg-yellow-500 text-white',
  [Role.CUSTOMER]: 'bg-green-500 text-white'
}

const statusColors: Record<string, string> = {
  ONLINE: 'bg-emerald-500',
  OFFLINE: 'bg-zinc-400 dark:bg-zinc-600'
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const { theme } = useTheme()
  const { showAlert } = useAlert()
  const { role, setRole } = useAppContext()

  // Lấy token một lần, không set vào deps để tránh loop
  const [accessToken, setAccessToken] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('accessToken'))
    }
  }, [])

  const { data } = useAccountMe(accessToken)
  const user = data?.payload?.data

  // Realtime status (fallback từ getMe)
  const presenceStatus = useSelfPresence(accessToken, user?.user_id, user?.status)

  const handleLogout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      showAlert('Logged out successfully', 'success')
      setRole()
      router.push(ROUTES.login)
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: () => {}
      })
    }
  }

  function filterMenuByRole(menu: any[], role: string | null): any[] {
    if (!role) return []
    return menu
      .filter((item) => !item.role || item.role.includes(role))
      .map((item) => {
        if (item.items) {
          return {
            ...item,
            items: filterMenuByRole(item.items, role)
          }
        }
        return item
      })
  }

  // Lọc menu theo role trước khi render:
  const filteredNavMain = React.useMemo(() => filterMenuByRole(dataSideBar.navMain, role ?? null), [role])

  const initials = (user?.full_name ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const status = presenceStatus ?? 'OFFLINE'
  const statusDotClass = statusColors[status]
  return (
    <>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href={ROUTES.home} className='flex h-8 items-center justify-center rounded-lg pt-3'>
                <Image
                  src={theme === 'dark' ? '/images/logo.png' : '/images/logo-color.png'}
                  alt='logo'
                  width={150}
                  height={30}
                  className='rounded-lg'
                />
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dash Board</SidebarGroupLabel>
            <RenderMenu menuData={filteredNavMain} />
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  >
                    <div className='relative'>
                      <Avatar className='h-8 w-8 rounded-lg'>
                        <AvatarImage
                          src={
                            user?.avatar
                              ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
                              : undefined
                          }
                          alt={user?.full_name}
                        />
                        <AvatarFallback className='rounded-lg'>{initials}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-background ${statusDotClass}`}
                        title={status}
                      />
                    </div>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>{user?.full_name}</span>
                      <span className='truncate text-xs'>{user?.email}</span>
                    </div>
                    <ChevronsUpDown className='ml-auto size-4' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                  side='bottom'
                  align='end'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <div className='relative'>
                        <Avatar className='h-8 w-8 rounded-lg'>
                          <AvatarImage
                            src={
                              user?.avatar
                                ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
                                : undefined
                            }
                            alt={user?.full_name}
                          />
                          <AvatarFallback className='rounded-lg'>{initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-background ${statusDotClass}`}
                          title={status}
                        />
                      </div>

                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>{user?.full_name}</span>
                        <span className='truncate text-xs'>{user?.email}</span>
                      </div>
                      <div>
                        <Badge className={roleColors[role ?? ''] || ''}>{role}</Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserCog />
                      <Link href={ROUTES.dashboardRoutes.profile}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings />
                      Setting
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className='hover:cursor-pointer'>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </>
  )
}
