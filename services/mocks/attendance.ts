import type { AttendanceRecord } from '@/types/domain'
import type { VerifyAttendancePayload } from '@/services/api/attendance'

export const mockHistory: AttendanceRecord[] = []

export function mockVerifyAttendance(payload: VerifyAttendancePayload): AttendanceRecord {
  return {
    id: `demo-${Date.now()}`,
    qrToken: payload.qrToken,
    status: payload.action === 'complete' ? 'completed' : 'checked_in',
    verifiedBy: payload.verifiedBy,
  } as AttendanceRecord
}
