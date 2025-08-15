import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/exercises'

const exerciseServ = {
  getAllExercises: () => {
    return http.get<ApiResponseType>(`${prefix}/get-all-exercises`)
  },
  getExerciseById: (exerciseId: number) => {
    return http.get<ApiResponseType>(`${prefix}/get-exercise-by-id/${exerciseId}`)
  },
  createExercise: (data: any) => {
    return http.post<ApiResponseType>(`${prefix}/create-exercise`, data)
  },
  updateExercise: (data: any, exerciseId: number) => {
    return http.put<ApiResponseType>(`${prefix}/update-exercise/${exerciseId}`, data)
  },
  deleteExercise: (exerciseId: number) => {
    return http.delete<ApiResponseType>(`${prefix}/delete-exercise/${exerciseId}`, null)
  }
}

export default exerciseServ
