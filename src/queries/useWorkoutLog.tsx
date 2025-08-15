import workoutLogServ from '@/services/workoutLogServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllWorkoutLogs = () => {
  return useQuery({
    queryKey: ['workoutLogs'],
    queryFn: workoutLogServ.getAllWorkoutLogs
  })
}

export const useGetWorkoutLogById = ({ workoutLogId, enabled }: { workoutLogId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['workoutLogs', workoutLogId],
    queryFn: () => workoutLogServ.getWorkoutLogById(workoutLogId),
    enabled
  })
}

export const useCreateWorkoutLogMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: workoutLogServ.createWorkoutLog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workoutLogs']
      })
    }
  })
}

export const useUpdateWorkoutLogMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ workoutLogId, ...data }: { workoutLogId: number; [key: string]: any }) =>
      workoutLogServ.updateWorkoutLog(data, workoutLogId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workoutLogs']
      })
    }
  })
}

export const useDeleteWorkoutLogMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: workoutLogServ.deleteWorkoutLog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workoutLogs']
      })
    }
  })
}
