import exerciseServ from '@/services/exerciseServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: exerciseServ.getAllExercises
  })
}

export const useGetExerciseById = ({ exerciseId, enabled }: { exerciseId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['exercises', exerciseId],
    queryFn: () => exerciseServ.getExerciseById(exerciseId),
    enabled
  })
}

export const useCreateExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: exerciseServ.createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exercises']
      })
    }
  })
}

export const useUpdateExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ exerciseId, ...data }: { exerciseId: number; [key: string]: any }) =>
      exerciseServ.updateExercise(data, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exercises']
      })
    }
  })
}

export const useDeleteExerciseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: exerciseServ.deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exercises']
      })
    }
  })
}
