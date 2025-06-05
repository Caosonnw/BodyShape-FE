export const Role = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  COACH: 'COACH',
  CUSTOMER: 'CUSTOMER'
} as const

export const RoleValues = [Role.OWNER, Role.ADMIN, Role.COACH, Role.CUSTOMER] as const

export const TokenType = {
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken'
} as const

export const StatusMemberships = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED'
}

export const StatusMembershipsValues = [
  StatusMemberships.ACTIVE,
  StatusMemberships.INACTIVE,
  StatusMemberships.EXPIRED
] as const
