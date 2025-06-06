import { z } from 'zod'

export const EquipmentSchema = z.object({
  equipment_id: z.number().int().positive(),
  equipment_name: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'BROKEN'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be one of ACTIVE, MAINTENANCE, or BROKEN'
  }),
  last_maintenance_date: z.string().optional(),
  created_at: z.string().optional()
})
export type EquipmentType = z.infer<typeof EquipmentSchema>

export const EquipmentListRes = z.object({
  data: z.array(EquipmentSchema),
  message: z.string()
})
export type EquipmentListResType = z.infer<typeof EquipmentListRes>

export const EquipmentRes = z
  .object({
    data: EquipmentSchema,
    message: z.string()
  })
  .strict()
export type EquipmentResType = z.infer<typeof EquipmentRes>

export const CreateEquipmentSchema = z
  .object({
    equipment_name: z
      .string({ required_error: 'Equipment name is required' })
      .min(1, { message: 'Equipment name cannot be empty' }),
    description: z.string().optional(),
    location: z.string().optional(),
    status: z.enum(['ACTIVE', 'MAINTENANCE', 'BROKEN'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be one of ACTIVE, MAINTENANCE, or BROKEN'
    })
  })
  .strict()
export type CreateEquipmentType = z.infer<typeof CreateEquipmentSchema>

export const UpdateEquipmentSchema = CreateEquipmentSchema
export type UpdateEquipmentType = z.infer<typeof UpdateEquipmentSchema>

export const DeleteEquipmentSchema = z.object({
  equipment_id: z.number().int().positive()
})
export type DeleteEquipmentType = z.infer<typeof DeleteEquipmentSchema>
