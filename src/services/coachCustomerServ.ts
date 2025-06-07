import http from '@/lib/http'
import { CoachCustomerResType } from '@/schema/coachCustomer.schema'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/coach-customers'

const coachCustomerServ = {
  getAllCoachCustomers: () => {
    return http.get<CoachCustomerResType>(`${prefix}/get-all-coach-customers`)
  },
  getCoachCustomers: () => {
    return http.get<ApiResponseType>(`${prefix}/get-coach-customers`)
  },
  getCoachCustomerById: (coach_id: number, customer_id: number) => {
    return http.get<ApiResponseType>(`${prefix}/get-coach-customers-by-id/${coach_id}/${customer_id}`)
  },
  createCoachCustomer: (body: { coach_id: number; customer_id: number }) => {
    return http.post<ApiResponseType>(`${prefix}/create-coach-customer`, body)
  },
  updateCoachCustomer: (body: {
    oldCoachId: number
    oldCustomerId: number
    newCoachId: number
    newCustomerId: number
  }) => {
    return http.put<ApiResponseType>(`${prefix}/update-coach-customer`, body)
  },
  deleteCoachCustomer: (body: { coach_id: number; customer_id: number }) => {
    return http.delete<ApiResponseType>(`${prefix}/delete-coach-customer`, body)
  }
}

export default coachCustomerServ
