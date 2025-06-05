import { UpdatePackageType } from '@/schema/package.schema'
import packageServ from '@/services/packageServ'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAllPackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: packageServ.getAllPackages
  })
}

export const useGetPackageById = ({ packageId, enabled }: { packageId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['packages', packageId],
    queryFn: () => packageServ.getPackageById(packageId),
    enabled
  })
}

export const useCreatePackageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: packageServ.createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['packages']
      })
    }
  })
}

export const useUpdatePackageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ packageId, ...data }: UpdatePackageType & { packageId: number }) =>
      packageServ.updatePackage(data, packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['packages']
      })
    }
  })
}

export const useDeletePackageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: packageServ.deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['packages']
      })
    }
  })
}
