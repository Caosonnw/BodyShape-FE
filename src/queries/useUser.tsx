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

export const useGetUserRoleCoach = () => {
  return useQuery({
    queryKey: ['user-role-coach'],
    queryFn: userServ.getUserRoleCoach
  })
}

export const useGetUserRoleCustomer = () => {
  return useQuery({
    queryKey: ['user-role-customer'],
    queryFn: userServ.getUserRoleCustomer
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
    mutationFn: ({ user_id, ...body }: { user_id: number } & UpdateUserBodyType) => {
      const { full_name, email, password, date_of_birth, phone_number, role, ...optionalFields } = body
      if (
        typeof full_name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof date_of_birth !== 'string' ||
        typeof phone_number !== 'string' ||
        typeof role !== 'string'
      ) {
        return Promise.reject(new Error('Missing required user fields'))
      }
      return userServ.updateUser(user_id, {
        full_name,
        email,
        password,
        date_of_birth,
        phone_number,
        role,
        ...optionalFields
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: true
      })
    }
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userServ.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users']
      })
    }
  })
}
