import http from '@/lib/http'
import { AttendanceType } from '@/schema/attendance.schema'
import { ApiResponseType } from '@/schema/res.schema'

const prefix = '/checkins'

export const checkinServ = {
  getAllCheckins: () => http.get<ApiResponseType>(`${prefix}/get-all-checkins`),
  getCheckinByToDay: () => http.get<ApiResponseType>(`${prefix}/get-checkin-by-today`),
  getCheckinByTodayUser: (userId: number) => http.get<ApiResponseType>(`${prefix}/get-checkin-by-today-user/${userId}`),
  getCheckinByUser: (userId: number) => http.get<ApiResponseType>(`${prefix}/get-checkin-by-user/${userId}`),
  createAttendance: (body: AttendanceType) => http.post<ApiResponseType>(`${prefix}/attendance`, body)
}
