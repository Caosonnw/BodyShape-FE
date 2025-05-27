import { ROUTES } from '@/common/path'
import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const privatePaths = ['/admin']
const unAuthPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // 1. Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // 2. Đăng nhập rồi thì không cho vào trang login, register
  if (refreshToken) {
    // 2.1. Nếu cố tình vào trang login, register thì chuyển hướng về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL(ROUTES.home, request.url))
    }

    // 2.2. Đăng nhập rồi nhưng Access Token hết hạn
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)

      return NextResponse.redirect(url)
    }

    // 2.3. Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role
    // User nhưng cố vào route private
    const isUserGoToManagePath = role === Role.CUSTOMER && privatePaths.some((path) => pathname.startsWith(path))

    if (isUserGoToManagePath) {
      return NextResponse.redirect(new URL(ROUTES.home, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register']
}
