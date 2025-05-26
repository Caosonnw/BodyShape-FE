import { HttpError } from '@/lib/http'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { LoginBodyType } from '@/schema/auth.schema'
import authServ from '@/services/authServ'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = await cookies()

  try {
    const { payload } = await authServ.sLogin(body)
    const { accessToken, refreshToken } = payload.data

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })
    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json({ status: error.status })
    } else {
      return Response.json({ message: 'Đã có lỗi xảy ra' }, { status: 500 })
    }
  }
}
