import trainingPlanServ from '@/services/trainingPlanServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllTrainingPlans = () => {
  return useQuery({
    queryKey: ['trainingPlans'],
    queryFn: trainingPlanServ.getAllTrainingPlans
  })
}

export const useGetTrainingPlanById = ({ trainingPlanId, enabled }: { trainingPlanId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['trainingPlans', trainingPlanId],
    queryFn: () => trainingPlanServ.getTrainingPlanById(trainingPlanId),
    enabled
  })
}

export const useCreateTrainingPlanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: trainingPlanServ.createTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['trainingPlans']
      })
    }
  })
}

export const useUpdateTrainingPlanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trainingPlanId, ...data }: { trainingPlanId: number; [key: string]: any }) =>
      trainingPlanServ.updateTrainingPlan(data, trainingPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['trainingPlans']
      })
    }
  })
}

export const useDeleteTrainingPlanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: trainingPlanServ.deleteTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['trainingPlans']
      })
    }
  })
}
