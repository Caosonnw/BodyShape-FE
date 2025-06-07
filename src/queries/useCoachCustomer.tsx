import coachCustomerServ from '@/services/coachCustomerServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllCoachCustomers = () => {
  return useQuery({
    queryKey: ['coach-customers'],
    queryFn: coachCustomerServ.getAllCoachCustomers
  })
}

export const useGetCoachCustomers = () => {
  return useQuery({
    queryKey: ['coach-customers'],
    queryFn: coachCustomerServ.getCoachCustomers
  })
}

export const useGetCoachCustomerById = (coach_id: number, customer_id: number) => {
  return useQuery({
    queryKey: ['coach-customers', coach_id, customer_id],
    queryFn: () => coachCustomerServ.getCoachCustomerById(coach_id, customer_id),
    enabled: !!coach_id && !!customer_id
  })
}

export const useCreateCoachCustomerMuatation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: coachCustomerServ.createCoachCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-customers'] })
    }
  })
}

export const useUpdateCoachCustomerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: coachCustomerServ.updateCoachCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-customers'] })
    }
  })
}

export const useDeleteCoachCustomerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: coachCustomerServ.deleteCoachCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-customers'] })
    }
  })
}
