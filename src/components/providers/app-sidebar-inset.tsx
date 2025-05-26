'use client'

import { usePathname } from 'next/navigation'
import { SidebarInset } from '../ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '../ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { ModeToggle } from '@/components/ModeToogle'

export function AppSidebarInset({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Tách đường dẫn thành các phần, ví dụ: "/admin/user/profile" -> ['admin', 'user', 'profile']
  const pathParts = pathname.split('/').filter(Boolean)

  // Hàm lấy tên breadcrumb từ phần route, hoặc tự format (ví dụ hoa chữ cái đầu)
  const getBreadcrumbName = (segment: string) => {
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  // Build breadcrumb items gồm link và tên
  const breadcrumbs = pathParts.map((part, idx) => {
    const href = '/' + pathParts.slice(0, idx + 1).join('/')
    const name = getBreadcrumbName(part)
    return { href, name }
  })

  return (
    <SidebarInset className='overflow-x-hidden'>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between'>
        <div className='flex items-center px-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className='-ml-1' />
            </TooltipTrigger>
            <TooltipContent side='bottom' align='start'>
              Toggle Sidebar <kbd className='ml-2'>⌘+b</kbd>
            </TooltipContent>
          </Tooltip>
          <Separator orientation='vertical' className='h-4 mr-2' />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <BreadcrumbItem key={crumb.href}>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
                    )}
                    {!isLast && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='mr-2 sm:mr-4'>
          <ModeToggle />
        </div>
      </header>
      {children}
    </SidebarInset>
  )
}
