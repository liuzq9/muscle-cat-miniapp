import { attendanceApi } from './api/attendance'
import { bookingApi } from './api/booking'
import { coachApi } from './api/coach'
import { courseApi } from './api/course'
import { studioApi } from './api/studio'
import { getMemberId } from './auth'

/** 兼容现有页面的接口出口，新业务代码请直接引入对应模块 API。 */
export const api = {
  studio: () => studioApi.getInfo(),
  coaches: () => coachApi.list(),
  coach: (id: string) => coachApi.detail(id),
  courses: (coachId?: string) => courseApi.list({ coachId }),
  schedules: (coachId: string, date: string) => coachApi.schedules(coachId, date),
  bookings: (memberId?: string) => bookingApi.list(memberId || getMemberId()),
  history: (memberId?: string) => attendanceApi.history(memberId || getMemberId()),
  createBooking: (payload: Parameters<typeof bookingApi.create>[0]) => bookingApi.create(payload),
  cancelBooking: (id: string, memberId?: string) =>
    bookingApi.cancel(id, memberId || getMemberId()),
  rescheduleBooking: (
    id: string,
    payload: Parameters<typeof bookingApi.reschedule>[1],
    memberId?: string,
  ) => bookingApi.reschedule(id, payload, memberId || getMemberId()),
  bookingQr: (id: string) => bookingApi.getQrCode(id),
  verifyAttendance: (qrToken: string, action: 'check_in' | 'complete' = 'check_in') =>
    attendanceApi.verify({ qrToken, action, verifiedBy: 'coach-demo' }),
}
