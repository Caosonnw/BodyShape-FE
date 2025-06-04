import { ClientCalendarProvider } from '@/components/calendar/contexts/client-calendar-provider'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientCalendarProvider>
      <div className='mx-auto flex xmax-w-screen-2xl flex-col gap-4 px-8 py-2 !w-full'>{children}</div>
    </ClientCalendarProvider>
  )
}
