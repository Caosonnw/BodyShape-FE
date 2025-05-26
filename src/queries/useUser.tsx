import userServ from '@/services/userServ'
import { useQuery } from '@tanstack/react-query'

export const useAccountMe = (accessToken: any) => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: () => (accessToken ? userServ.me(accessToken) : Promise.reject('Không nhận được Access Token')),
    enabled: !!accessToken
  })
}
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['getAllUsers'],
    queryFn: userServ.getAllUsers
  })
}
