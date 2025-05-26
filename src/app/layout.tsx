import { AlertProvider } from '@/context/AlertContext'
import AppProvider from '@/context/AppProvider'
import 'animate.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['100', '300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'BodyShape - Fitness, Workout & Gym Template',
  description: 'BodyShape - Fitness, Workout & Gym Template'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <AppProvider>
          <AlertProvider>{children}</AlertProvider>
        </AppProvider>
      </body>
    </html>
  )
}
