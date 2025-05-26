import packageServ from '@/services/packageServ'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetAllPackages = () => {
  return useQuery({
    queryKey: ['getAllPackages'],
    queryFn: packageServ.getAllPackages
  })
}
