import http from '@/lib/http'
import { ApiResponseType } from '@/schema/res.schema'
import { SchedulesSchemaBodyType } from '@/schema/schedules.schema'

const prefix = '/schedules'

const schedulesServ = {
  createSchedules: (body: SchedulesSchemaBodyType) => {
    return http.post<ApiResponseType>(`${prefix}/create-schedules`, body)
  },
  updateSchedules: (schedule_id: number, body: SchedulesSchemaBodyType) => {
    return http.put<ApiResponseType>(`${prefix}/update-schedules/${schedule_id}`, body)
  }
}

export default schedulesServ
