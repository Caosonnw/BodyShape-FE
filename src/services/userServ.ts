import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'
import { AccountResType, CreateUserBodyType } from '@/schema/user.schema'

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
  },
  getUserById: (userId: number) => {
    return http.get<ApiResponseType>(`${prefix}/get-user-by-id/${userId}`)
  },
  createUser: (data: CreateUserBodyType) => {
    return http.post<ApiResponseType>(`${prefix}/create-user`, data)
  },
  updateUser: (userId: number, data: CreateUserBodyType) => {
    return http.put<AccountResType>(`${prefix}/update-user/${userId}`, data)
  }
}

export default userServ
