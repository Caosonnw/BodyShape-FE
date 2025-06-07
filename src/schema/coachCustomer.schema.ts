import { z } from 'zod'

export const userSchema = z.object({
  user_id: z.number(),
  full_name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  gender: z.boolean(),
  date_of_birth: z.string(),
  avatar: z.string()
})

export const CoachCustomerSchema = z.object({
  coach_id: z.number(),
  customer_id: z.number(),
  coach: userSchema,
  customer: userSchema
})

export const CoachCustomerResSchema = z.object({
  data: z.array(CoachCustomerSchema),
  message: z.string()
})

export type CoachCustomerType = z.TypeOf<typeof CoachCustomerSchema>

export type CoachCustomerResType = z.TypeOf<typeof CoachCustomerResSchema>

export const CreateCoachCustomerSchema = z.object({
  coach_id: z.number(),
  customer_id: z.number()
})

export type CreateCoachCustomerType = z.TypeOf<typeof CreateCoachCustomerSchema>

export const UpdateCoachCustomerSchema = z.object({
  oldCoachId: z.number(),
  oldCustomerId: z.number(),
  newCoachId: z.number(),
  newCustomerId: z.number()
})

export type UpdateCoachCustomerType = z.TypeOf<typeof UpdateCoachCustomerSchema>

export const DeleteCoachCustomerSchema = CreateCoachCustomerSchema

export type DeleteCoachCustomerType = z.TypeOf<typeof DeleteCoachCustomerSchema>
