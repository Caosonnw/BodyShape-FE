import { Role } from '@/constants/type'
import { HttpError } from '@/lib/http'
import authServ from '@/services/authServ'
import { TokenPayload } from '@/types/jwt.types'
import { clsx, type ClassValue } from 'clsx'
import jwt from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Xóa đi ký tự `/` đầu tiên của path
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

type HandleErrorApiParams = {
  error: unknown
  setError: UseFormSetError<any>
}
export const handleErrorApi = ({ error, setError }: HandleErrorApiParams) => {
  if (error instanceof HttpError) {
    const { payload } = error
    if (payload.errors) {
      payload.errors.forEach(({ field, message }) => {
        setError(field, { type: 'manual', message })
      })
    } else {
      toast.error(payload.message)
    }
  } else {
    toast.error('An unexpected error occurred')
  }
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null)

export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null)

export const setAccessTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('accessToken', value)

export const setRefreshTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('refreshToken', value)

export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem('accessToken')
  isBrowser && localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()

  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)

  const now = new Date().getTime() / 1000 - 1

  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    return param?.onError && param.onError()
  }

  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      // const role = decodedRefreshToken.role
      const res = await authServ.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}
