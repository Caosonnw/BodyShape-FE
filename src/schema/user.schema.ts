import { Role } from '@/constants/type'
import { LoginRes } from '@/schema/auth.schema'
import z from 'zod'

export const AccountSchema = z.object({
  user_id: z.number(),
  full_name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  gender: z.boolean().optional(),
  date_of_birth: z.string(),
  avatar: z.string(),
  role: z.enum([Role.OWNER, Role.ADMIN, Role.COACH, Role.CUSTOMER])
})

export type AccountType = z.TypeOf<typeof AccountSchema>

export const AccountListRes = z.object({
  data: z.array(AccountSchema),
  message: z.string()
})

export type AccountListResType = z.TypeOf<typeof AccountListRes>

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string()
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountRes>

export const CreateUserBody = z
  .object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Full name must be at least 6 characters')
      .max(256, 'Full name must not exceed 256 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Email format is invalid'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters'),
    gender: z.boolean().optional(),
    date_of_birth: z.string(),
    phone_number: z
      .string({ required_error: 'Phone number is required' })
      .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    avatar: z.string().optional(),
    role: z.enum([Role.OWNER, Role.ADMIN, Role.COACH, Role.CUSTOMER], { required_error: 'Role is required' })
  })
  .strict()

export type CreateUserBodyType = z.TypeOf<typeof CreateUserBody>

export const UpdateUserBody = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(256, 'Full name must not exceed 256 characters')
      .optional(),
    email: z.string().email('Email format is invalid').optional(),
    password: z.string().optional(),
    gender: z.boolean().optional(),
    date_of_birth: z.string().optional(),
    phone_number: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .optional(),
    avatar: z.string().optional(),
    role: z.enum([Role.OWNER, Role.ADMIN, Role.COACH, Role.CUSTOMER]).optional()
  })
  .partial()
  .strict()

export type UpdateUserBodyType = z.TypeOf<typeof UpdateUserBody>

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional()
  })
  .strict()

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>

export const ChangePasswordV2Body = ChangePasswordBody

export type ChangePasswordV2BodyType = z.TypeOf<typeof ChangePasswordV2Body>

export const ChangePasswordV2Res = LoginRes

export type ChangePasswordV2ResType = z.TypeOf<typeof ChangePasswordV2Res>

export const AccountIdParam = z.object({
  id: z.coerce.number()
})

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>
