import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/training-plans'

const trainingPlanServ = {
  getAllTrainingPlans: () => {
    return http.get<ApiResponseType>(`${prefix}/get-all-training-plans`)
  },
  getTrainingPlanById: (trainingPlanId: number) => {
    return http.get<ApiResponseType>(`${prefix}/get-training-plan-by-id/${trainingPlanId}`)
  },
  createTrainingPlan: (data: any) => {
    return http.post<ApiResponseType>(`${prefix}/create-training-plan`, data)
  },
  updateTrainingPlan: (data: any, trainingPlanId: number) => {
    return http.put<ApiResponseType>(`${prefix}/update-training-plan/${trainingPlanId}`, data)
  },
  deleteTrainingPlan: (trainingPlanId: number) => {
    return http.delete<ApiResponseType>(`${prefix}/delete-training-plan/${trainingPlanId}`, null)
  }
}

export default trainingPlanServ
