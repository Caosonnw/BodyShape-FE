import planExerciseServ from '@/services/planExerciseServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllPlanExercises = () => {
  return useQuery({
    queryKey: ['planExercises'],
    queryFn: planExerciseServ.getAllPlanExercises
  })
}

export const useGetPlanExercisesByCustomer = () => {
  return useQuery({
    queryKey: ['planExercises'],
    queryFn: planExerciseServ.getPlanExercisesByCustomer
  })
}

export const useGetPlanExerciseById = ({ planExerciseId, enabled }: { planExerciseId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['planExercises', planExerciseId],
    queryFn: () => planExerciseServ.getPlanExerciseById(planExerciseId),
    enabled
  })
}

export const useCreatePlanExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planExerciseServ.createPlanExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['planExercises']
      })
    }
  })
}

export const useUpdatePlanExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ planExerciseId, ...data }: { planExerciseId: number; [key: string]: any }) =>
      planExerciseServ.updatePlanExercise(data, planExerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['planExercises']
      })
    }
  })
}

export const useDeletePlanExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planExerciseServ.deletePlanExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['planExercises']
      })
    }
  })
}
