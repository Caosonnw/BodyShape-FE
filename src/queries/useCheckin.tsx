import { checkinServ } from '@/services/checkinServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllCheckins = () => {
  return useQuery({
    queryKey: ['checkins'],
    queryFn: checkinServ.getAllCheckins
  })
}

export const useGetCheckinByToDay = () => {
  return useQuery({
    queryKey: ['checkins', 'today'],
    queryFn: checkinServ.getCheckinByToDay
  })
}

export const useGetCheckinByTodayUser = (userId: number) => {
  return useQuery({
    queryKey: ['checkins', 'today', userId],
    queryFn: () => checkinServ.getCheckinByTodayUser(userId),
    enabled: !!userId
  })
}

export const useGetCheckinByUser = (userId: number) => {
  return useQuery({
    queryKey: ['checkins', 'user', userId],
    queryFn: () => checkinServ.getCheckinByUser(userId),
    enabled: !!userId
  })
}

export const useCreateAttendanceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: checkinServ.createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] })
    }
  })
}
