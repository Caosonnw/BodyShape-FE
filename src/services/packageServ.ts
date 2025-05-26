import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/packages'

const packageServ = {
  getAllPackages: () => {
    return http.get<ApiResponseType>(`${prefix}/get-all-packages`)
  }
}

export default packageServ
