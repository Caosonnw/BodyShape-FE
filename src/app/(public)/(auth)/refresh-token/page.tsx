'use client'

import { ROUTES } from '@/common/path'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathname = searchParams.get('redirect')
  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess() {
          router.push(redirectPathname || ROUTES.home)
        }
      })
    }
  }, [router, refreshTokenFromUrl, redirectPathname])
  return null
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Refresh Token...</div>}>
      <RefreshToken />
    </Suspense>
  )
}
