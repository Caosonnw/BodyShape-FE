import workoutLogServ from '@/services/workoutLogServ'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useGetWorkoutLogsByCustomer = () => {
  return useQuery({
    queryKey: ['workoutLogs'],
    queryFn: workoutLogServ.getWorkoutLogsByCustomer
  })
}

export const useGetWorkoutLogsByExercise = ({ exerciseId, enabled }: { exerciseId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['workoutLogs', exerciseId],
    queryFn: () => workoutLogServ.getWorkoutLogsByExercise(exerciseId),
    enabled,

    // Ngăn gọi lại nhiều lần không cần thiết:
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,

    // Cache 5 phút, các row khác (cùng exercise) hưởng ké cache:
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export const useGetWorkoutLogsByExercises = (exerciseIds: number[], enabled: boolean = true) => {
  const queries = useQueries({
    queries: (exerciseIds || []).map((eid) => ({
      queryKey: ['workoutLogs', eid],
      queryFn: () => workoutLogServ.getWorkoutLogsByExercise(eid),
      enabled: enabled && !!eid,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000
    }))
  })

  return queries
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
