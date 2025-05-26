import { z } from 'zod'

export const ApiResponseSchema = z.object({
  data: z.union([z.null(), z.any()]), // data có thể là null hoặc bất kỳ kiểu dữ liệu nào
  message: z.string(), // message là string
  statusCode: z.number().int(), // statusCode là số nguyên
  date: z.string() // date là string (định dạng thời gian)
})

export type ApiResponseType = z.TypeOf<typeof ApiResponseSchema>
