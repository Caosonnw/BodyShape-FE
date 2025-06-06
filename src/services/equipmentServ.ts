import http from '@/lib/http'
import {
  CreateEquipmentType,
  EquipmentListResType,
  EquipmentResType,
  UpdateEquipmentType
} from '@/schema/equipment.schema'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/equipments'

const equipmentServ = {
  getAllEquipments: () => {
    return http.get<EquipmentListResType>(`${prefix}/get-all-equipments`)
  },
  getEquipmentById: (equipmentId: number) => {
    return http.get<EquipmentResType>(`${prefix}/get-equipment-by-id/${equipmentId}`)
  },
  createEquipment: (data: CreateEquipmentType) => {
    return http.post<ApiResponseType>(`${prefix}/create-equipment`, data)
  },
  updateEquipment: (data: UpdateEquipmentType, equipmentId: number) => {
    return http.put<EquipmentResType>(`${prefix}/update-equipment/${equipmentId}`, data)
  },
  deleteEquipment: (equipmentId: number) => {
    return http.delete<ApiResponseType>(`${prefix}/delete-equipment/${equipmentId}`, null)
  }
}

export default equipmentServ
