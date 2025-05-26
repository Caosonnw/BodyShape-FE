import { z } from 'zod'

export const RegisterBody = z
  .object({
    full_name: z.string().trim().min(2, 'Tên phải nhiều hơn 1 ký tự').max(256, 'Tên tối đa 256 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải nhiều hơn 5 ký tự').max(100, 'Mật khẩu tối đa 100 ký tự'),
    gender: z
      .string()
      .optional()
      .refine((val) => val === '0' || val === '1', {
        message: 'Giới tính phải là Nam hoặc Nữ'
      }),
    date_of_birth: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          const date = new Date(val)
          return !isNaN(date.getTime())
        },
        {
          message: 'Ngày sinh không hợp lệ'
        }
      ),
    phone_number: z
      .string()
      .optional()
      .refine((val) => /^\d{10}$/.test(val ?? ''), {
        message: 'Số điện thoại phải có đúng 10 chữ số'
      })
  })
  .strict()

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginSchema>

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string(),
  statusCode: z.number(),
  date: z.string()
})

export type LoginResType = z.TypeOf<typeof LoginRes>

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
})

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>

export const LoginGoogleQuery = z.object({
  code: z.string()
})

export type LoginGoogleQueryType = z.TypeOf<typeof LoginGoogleQuery>
