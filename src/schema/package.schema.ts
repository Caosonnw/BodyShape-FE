import { z } from 'zod'

export const PackageSchema = z.object({
  package_id: z.number().int().positive(),
  package_name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  duration_days: z.number().int().positive()
})

export type PackageType = z.infer<typeof PackageSchema>

export const PackageListRes = z.object({
  data: z.array(PackageSchema),
  message: z.string()
})

export type PackageListResType = z.infer<typeof PackageListRes>

export const PackageRes = z
  .object({
    data: PackageSchema,
    message: z.string()
  })
  .strict()
  
export type PackageResType = z.infer<typeof PackageRes>

export const CreatePackageSchema = z
  .object({
    package_name: z
      .string({ required_error: 'Package name is required' })
      .min(1, { message: 'Package name cannot be empty' }),
    description: z.string().optional(),
    price: z.number({ required_error: 'Price is required' }).nonnegative({ message: 'Price cannot be negative' }),
    duration_days: z
      .number({ required_error: 'Duration (days) is required' })
      .int({ message: 'Duration must be an integer' })
      .positive({ message: 'Duration must be greater than 0' })
  })
  .strict()

export type CreatePackageType = z.infer<typeof CreatePackageSchema>

export const UpdatePackageSchema = CreatePackageSchema

export type UpdatePackageType = z.infer<typeof UpdatePackageSchema>

export const DeletePackageSchema = z.object({
  package_id: z.number().int().positive()
})
export type DeletePackageType = z.infer<typeof DeletePackageSchema>
