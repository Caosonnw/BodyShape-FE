'use client'

import { ROUTES } from '@/common/path'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHORIZED_PATHS = ['/login', '/logout', '/register', '/refresh-token']

export default function RefreshTokenComponent() {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (UNAUTHORIZED_PATHS.includes(pathname)) return
    let interval: any = null

    checkAndRefreshToken({
      onError() {
        clearInterval(interval)
        router.push(ROUTES.login)
      }
    })
    const TIMEOUT = 1000
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError() {
          clearInterval(interval)
          router.push(ROUTES.login)
        }
      }),
        TIMEOUT
    })
    return () => clearInterval(interval)
  }, [pathname, router])
  return null
}
