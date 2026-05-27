import { z } from 'zod'

export const AttendanceSchema = z.object({
  userId: z.number(),
  action: z.enum(['checkin', 'checkout'])
})

export type AttendanceType = z.infer<typeof AttendanceSchema>
