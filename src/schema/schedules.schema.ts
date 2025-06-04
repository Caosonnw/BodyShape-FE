import z from 'zod'

export const SchedulesSchemaBody = z.object({
  customer_id: z.number().int().optional(),
  title: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  description: z.string().optional(),
  color: z.string().optional()
})

export type SchedulesSchemaBodyType = z.TypeOf<typeof SchedulesSchemaBody>
