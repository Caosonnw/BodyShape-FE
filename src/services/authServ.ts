import http from '@/lib/http'
import {
  LoginBodyType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  RegisterBodyType
} from '@/schema/auth.schema'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/auth'
const apiPrefix = '/api/auth'

const authServ = {
  sRegister: (body: RegisterBodyType) => http.post<ApiResponseType>(`${prefix}/register`, body),
  register: (body: RegisterBodyType) =>
    http.post<ApiResponseType>(`${apiPrefix}/register`, body, {
      baseUrl: ''
    }),
  sLogin: (body: LoginBodyType) => http.post<ApiResponseType>(`${prefix}/login`, body),
  login: (body: LoginBodyType) =>
    http.post<ApiResponseType>(`${apiPrefix}/login`, body, {
      baseUrl: ''
    }),
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post(
      `${prefix}/logout`,
      {
        refreshToken: body.refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`
        }
      }
    ),
  logout: () => http.post(`${apiPrefix}/logout`, null, { baseUrl: '' }),

  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,

  sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>(`${prefix}/refresh-token`, body),

  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(`${apiPrefix}/refresh-token`, null, {
      baseUrl: ''
    })
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  }
}

export default authServ
