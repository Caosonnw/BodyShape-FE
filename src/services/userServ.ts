import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/user'

const userServ = {
  me: (accessToken: string) =>
    http.get<ApiResponseType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
  getAllUsers: () => {
    return http.get<ApiResponseType>(`${prefix}/get-all-users`)
  }
}

export default userServ
