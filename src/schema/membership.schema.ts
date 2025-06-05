import { z } from 'zod'

export const MembershipSchema = z.object({
  card_id: z.number(),
  customer_id: z.number(),
  package_id: z.number(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']),
  customers: z.object({
    users: z.object({
      user_id: z.number(),
      full_name: z.string(),
      email: z.string(),
      date_of_birth: z.string(),
      phone_number: z.string(),
      avatar: z.string(),
      role: z.enum(['CUSTOMER'])
    })
  }),
  packages: z.object({
    package_id: z.number(),
    package_name: z.string(),
    description: z.string(),
    price: z.number(),
    duration_days: z.number()
  })
})

export type MembershipType = z.infer<typeof MembershipSchema>

export const MembershipListRes = z.object({
  data: z.array(MembershipSchema),
  message: z.string()
})

export const MembershipByIdRes = z.object({
  data: MembershipSchema,
  message: z.string()
})

export type MembershipByIdResType = z.infer<typeof MembershipByIdRes>

export type MembershipListResType = z.infer<typeof MembershipListRes>

export const CreateMembershipBody = z.object({
  customer_id: z.number({ required_error: 'Customer ID is required' }),
  package_id: z.number({ required_error: 'Package ID is required' }),
  start_date: z.string().datetime(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED'])
})

export type CreateMembershipBodyType = z.infer<typeof CreateMembershipBody>

export const UpdateMembershipBody = CreateMembershipBody
export type UpdateMembershipBodyType = CreateMembershipBodyType
