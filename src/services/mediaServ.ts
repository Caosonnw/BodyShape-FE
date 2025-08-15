import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'

export const mediaServ = {
  uploadAvatar: (user_id: number, formData: FormData) =>
    http.post<ApiResponseType>(`/user/upload-avatar/${user_id}`, formData),
  uploadMedia: (formData: FormData) => http.post<ApiResponseType>(`/user/upload-media`, formData),
  uploadVideoExercise: (formData: FormData) => http.post<ApiResponseType>(`/exercises/upload-exercise-video`, formData)
}
