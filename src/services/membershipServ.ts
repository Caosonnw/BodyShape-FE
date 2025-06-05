import http from '@/lib/http'
import { CreateMembershipBodyType, MembershipByIdResType, MembershipListResType } from '@/schema/membership.schema'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/memberships'

const membershipServ = {
  getAllMemberships: async () => {
    return http.get<MembershipListResType>(`${prefix}/get-all-membership-cards`)
  },

  getMembershipById: (membership_card_id: number) => {
    return http.get<MembershipByIdResType>(`${prefix}/get-membership-card-by-id/${membership_card_id}`)
  },

  createMembership: (data: CreateMembershipBodyType) => {
    return http.post<ApiResponseType>(`${prefix}/create-membership-card`, data)
  },

  updateMembership: (id: string, membershipData: any) => {
    return http.put<ApiResponseType>(`${prefix}/update-membership-card/${id}`, membershipData)
  },

  deleteMembership: (id: string) => {
    return http.delete<ApiResponseType>(`${prefix}/${id}`, null)
  }
}

export default membershipServ
