import { HttpError } from '@/lib/http'
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
