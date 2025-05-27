'use client'

import { ROUTES } from '@/common/path'
import { useAppContext } from '@/context/AppProvider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const ref = useRef<any>(null)
  const searchParams = useSearchParams()
  const { setRole } = useAppContext()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')
  useEffect(() => {
    if (
      ref.current ||
      !refreshTokenFromUrl ||
      !accessTokenFromUrl ||
      (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLocalStorage())
    ) {
      ref.current = mutateAsync
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        setRole()
        router.push(ROUTES.login)
      })
    } else {
      router.push(ROUTES.home)
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole])
  return null
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Logout...</div>}>
      <Logout />
    </Suspense>
  )
}
