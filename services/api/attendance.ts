import type { AttendanceRecord } from '@/types/domain'
import { http, USE_MOCK } from '@/services/http'
import { mockHistory, mockVerifyAttendance } from '@/services/mocks/attendance'

export interface VerifyAttendancePayload {
  qrToken: string
  action: 'check_in' | 'complete'
  verifiedBy: string
}

export const attendanceApi = {
  verify(payload: VerifyAttendancePayload): Promise<AttendanceRecord> {
    return USE_MOCK
      ? Promise.resolve(mockVerifyAttendance(payload))
      : http.post<AttendanceRecord>('/attendance/verify', payload)
  },

  history(memberId = 'demo-member'): Promise<AttendanceRecord[]> {
    return USE_MOCK
      ? Promise.resolve(mockHistory)
      : http.get<AttendanceRecord[]>('/attendance/history', { memberId })
  },
}
