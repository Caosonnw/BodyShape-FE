'use client'

import { ROUTES } from '@/common/path'
import RenderMenu from '@/components/renderMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { useAlert } from '@/context/AlertContext'
import { useAppContext } from '@/context/AppProvider'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useAccountMe } from '@/queries/useUser'
import {
  BadgeCheck,
  Bell,
  Bot,
  Calendar,
  ChevronsUpDown,
  CreditCard,
  Dumbbell,
  Folder,
  Forward,
  Frame,
  IdCard,
  LayoutDashboard,
  LogOut,
  Map,
  MapPinCheck,
  MessageSquare,
  MoreHorizontal,
  PieChart,
  Sparkles,
  Trash2,
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
      url: ROUTES.admin,
      icon: LayoutDashboard
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    },
    {
      title: 'Users',
      url: ROUTES.adminRoutes.users,
      icon: UsersRound
    },
    {
      title: 'Training schedule',
      url: ROUTES.adminRoutes.schedules,
      icon: Calendar
    },
    {
      title: 'Packages',
      url: ROUTES.adminRoutes.packages,
      icon: CreditCard
    },
    {
      title: 'Memberships',
      url: ROUTES.adminRoutes.memberships,
      icon: IdCard
    },
    {
      title: 'Chat',
      url: ROUTES.adminRoutes.chat,
      icon: MessageSquare
    },
    {
      title: 'Checkins',
      url: ROUTES.adminRoutes.checkins,
      icon: MapPinCheck
    },
    {
      title: 'Equipments',
      url: ROUTES.adminRoutes.equipments,
      icon: Dumbbell
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ]
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const { theme } = useTheme()
  const [accessToken, setAccessToken] = React.useState<string | null>(null)
  const { setRole } = useAppContext()
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      setAccessToken(token)
    }
  }, [accessToken])
  const { data } = useAccountMe(accessToken)
  const user = data?.payload.data
  const { showAlert } = useAlert()

  const handleLogout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      showAlert('Logged out successfully', 'success')
      setRole()
      router.push(ROUTES.home)
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: () => {}
      })
    }
  }
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
            <RenderMenu menuData={dataSideBar.navMain} />
          </SidebarGroup>
          <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {dataSideBar.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className='sr-only'>More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-48 rounded-lg' side='bottom' align='end'>
                      <DropdownMenuItem>
                        <Folder className='text-muted-foreground' />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className='text-muted-foreground' />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className='text-muted-foreground' />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className='text-sidebar-foreground/70'>
                  <MoreHorizontal className='text-sidebar-foreground/70' />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage
                        src={
                          user?.avatar
                            ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
                            : undefined
                        }
                        alt={user?.full_name}
                      />
                      <AvatarFallback className='rounded-lg'>
                        {user?.full_name
                          ?.split(' ')
                          .map((word: any) => word[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
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
                      <Avatar className='h-8 w-8 rounded-lg'>
                        <AvatarImage
                          src={
                            user?.avatar
                              ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${user.avatar}`
                              : undefined
                          }
                          alt={user?.full_name}
                        />
                        <AvatarFallback className='rounded-lg'>
                          {user?.full_name
                            ?.split(' ')
                            .map((word: any) => word[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>{user?.full_name}</span>
                        <span className='truncate text-xs'>{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
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
