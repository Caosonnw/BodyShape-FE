import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import equipmentServ from '@/services/equipmentServ'
import { UpdateEquipmentType } from '@/schema/equipment.schema'

export const useGetAllEquipments = () => {
  return useQuery({
    queryKey: ['equipments'],
    queryFn: equipmentServ.getAllEquipments
  })
}

export const useGetEquipmentById = ({ equipmentId, enabled }: { equipmentId: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['equipments', equipmentId],
    queryFn: () => equipmentServ.getEquipmentById(equipmentId),
    enabled
  })
}

export const useCreateEquipmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: equipmentServ.createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments']
      })
    }
  })
}

export const useUpdateEquipmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ equipmentId, ...data }: UpdateEquipmentType & { equipmentId: number }) =>
      equipmentServ.updateEquipment(data, equipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments']
      })
    }
  })
}

export const useDeleteEquipmentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: equipmentServ.deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['equipments']
      })
    }
  })
}
