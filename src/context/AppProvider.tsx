'use client'
import RefreshTokenComponent from '@/components/refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, useContext, useEffect, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {}
})
export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>()

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const roleDecoded = decodeToken(accessToken).role
      setRoleState(roleDecoded)
    }
  }, [])

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }
  const isAuth = Boolean(role)

  return (
    <AppContext.Provider value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshTokenComponent />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
