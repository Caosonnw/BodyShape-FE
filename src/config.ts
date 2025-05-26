import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_URL: z.string().url(),
  NEXT_PUBLIC_PORT_SOCKET: z.string().url()
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_PORT_SOCKET: process.env.NEXT_PUBLIC_PORT_SOCKET
})
if (!configProject.success) {
  console.error('Current environment variables:', {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_PORT_SOCKET: process.env.NEXT_PUBLIC_PORT_SOCKET
  })
  console.error('Validation issues:', configProject.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envConfig = configProject.data
export default envConfig
