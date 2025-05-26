import { Role, TokenType } from '@/constants/type'

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]

export type RoleType = (typeof Role)[keyof typeof Role]

export interface TokenPayload {
  user_id: number
  role: RoleType
  key: string
  exp: number
  iat: number
}
