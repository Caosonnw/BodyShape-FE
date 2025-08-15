import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/workout-logs'

const workoutLogServ = {
  getAllWorkoutLogs: () => {
    return http.get<ApiResponseType>(`${prefix}/get-all-workout-logs`)
  },
  getWorkoutLogById: (workoutLogId: number) => {
    return http.get<ApiResponseType>(`${prefix}/get-workout-log-by-id/${workoutLogId}`)
  },
  createWorkoutLog: (data: any) => {
    return http.post<ApiResponseType>(`${prefix}/create-workout-log`, data)
  },
  updateWorkoutLog: (data: any, workoutLogId: number) => {
    return http.put<ApiResponseType>(`${prefix}/update-workout-log/${workoutLogId}`, data)
  },
  deleteWorkoutLog: (workoutLogId: number) => {
    return http.delete<ApiResponseType>(`${prefix}/delete-workout-log/${workoutLogId}`, null)
  }
}

export default workoutLogServ
