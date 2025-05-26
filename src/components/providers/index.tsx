import { cookies } from 'next/headers'
import { AppSidebar } from '../app-sidebar'
import { SidebarProvider } from '../ui/sidebar'
import { AppSidebarInset } from './app-sidebar-inset'
import { ThemeProvider } from '@/components/ThemeProvider'

type ProviderProps = {
  children: React.ReactNode
}

export async function SideBarProviders({ children }: ProviderProps) {
  const cookieStore = await cookies()

  const sidebarState = cookieStore.get('sidebar:state')?.value
  //* get sidebar width from cookie
  const sidebarWidth = cookieStore.get('sidebar:width')?.value

  let defaultOpen = true

  if (sidebarState) {
    defaultOpen = sidebarState === 'true'
  }

  return (
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar>
          <AppSidebarInset>{children}</AppSidebarInset>
        </AppSidebar>
      </SidebarProvider>
    </ThemeProvider>
  )
}
