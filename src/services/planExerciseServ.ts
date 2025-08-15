import http from '@/lib/http'
import { PlanExerciseListResType } from '@/schema/planExercise.schema'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/plan-exercises'

const planExerciseService = {
  getAllPlanExercises: () => {
    return http.get<ApiResponseType>(`${prefix}/get-all-plan-exercises`)
  },
  getPlanExerciseById: (planExerciseId: number) => {
    return http.get<ApiResponseType>(`${prefix}/get-plan-exercises-by-id/${planExerciseId}`)
  },
  getPlanExercisesByCustomer: () => {
    return http.get<PlanExerciseListResType>(`${prefix}/get-plan-exercises-by-customer`)
  },
  createPlanExercise: (data: any) => {
    return http.post<ApiResponseType>(`${prefix}/create-plan-exercise`, data)
  },
  updatePlanExercise: (data: any, planExerciseId: number) => {
    return http.put<ApiResponseType>(`${prefix}/update-plan-exercise/${planExerciseId}`, data)
  },
  deletePlanExercise: (planExerciseId: number) => {
    return http.delete<ApiResponseType>(`${prefix}/delete-plan-exercise/${planExerciseId}`, null)
  }
}

export default planExerciseService
