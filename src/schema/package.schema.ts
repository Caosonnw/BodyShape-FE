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
