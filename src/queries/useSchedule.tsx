import { getEvents } from '@/components/calendar/requests'
import { SchedulesSchemaBodyType } from '@/schema/schedules.schema'
import schedulesServ from '@/services/schedulesServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCreateScheduleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: SchedulesSchemaBodyType) => await schedulesServ.createSchedules(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['schedules']
      })
    }
  })
}

export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ schedule_id, body }: { schedule_id: number; body: SchedulesSchemaBodyType }) =>
      await schedulesServ.updateSchedules(schedule_id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['schedules']
      })
    }
  })
}

export const useSchedulesQuery = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: getEvents
  })
}
