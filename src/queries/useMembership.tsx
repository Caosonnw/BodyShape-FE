import membershipServ from '@/services/membershipServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllMemberships = () => {
  return useQuery({
    queryKey: ['memberships'],
    queryFn: () => membershipServ.getAllMemberships()
  })
}

export const useGetMembershipById = ({ membershipId, enabled }: { membershipId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['memberships', membershipId],
    queryFn: () => membershipServ.getMembershipById(membershipId),
    enabled
  })
}

export const useCreateMembershipMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: membershipServ.createMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] })
    }
  })
}

export const useUpdateMembershipMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ membershipId, ...data }: any) => membershipServ.updateMembership(membershipId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] })
    }
  })
}
