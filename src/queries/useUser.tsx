import { UpdateUserBodyType } from '@/schema/user.schema'
import userServ from '@/services/userServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountMe = (accessToken: any) => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: () => (accessToken ? userServ.me(accessToken) : Promise.reject('Không nhận được Access Token')),
    enabled: !!accessToken
  })
}

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userServ.getAllUsers
  })
}

export const useGetUserById = ({ user_id, enabled }: { user_id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['users', user_id],
    queryFn: () => userServ.getUserById(user_id),
    enabled: !!user_id
  })
}

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userServ.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users']
      })
    }
  })
}

export const useUpdateUserMutation = (user_id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ user_id, ...body }: UpdateUserBodyType & { user_id: number }) => userServ.updateUser(user_id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: true
      })
    }
  })
}
