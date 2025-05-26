import authServ from '@/services/authServ'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  if (!accessToken || !refreshToken) {
    return Response.json({ message: 'Không nhận được Access Token và Refresh Token' }, { status: 200 })
  }
  try {
    const result = await authServ.sLogout({ accessToken, refreshToken })
    return Response.json(result.payload)
  } catch (error) {
    return Response.json({ message: 'Lỗi khi gọi API đến Server Backend' }, { status: 200 })
  }
}
