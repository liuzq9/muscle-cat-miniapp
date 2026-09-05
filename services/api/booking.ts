import type { Booking } from '@/types/domain'
import { http, USE_MOCK } from '@/services/http'
import {
  mockBookings,
  mockCancelBooking,
  mockCreateBooking,
  mockRescheduleBooking,
} from '@/services/mocks/booking'

export interface CreateBookingPayload {
  memberId: string
  coachId: string
  courseId: string
  date: string
  startTime: string
  endTime: string
}

export interface RescheduleBookingPayload {
  date: string
  startTime: string
  endTime: string
  reason?: string
}

interface ChangeBookingPayload {
  memberId: string
  reason?: string
}

export const bookingApi = {
  list(memberId = 'demo-member'): Promise<Booking[]> {
    return USE_MOCK ? Promise.resolve(mockBookings) : http.get<Booking[]>('/bookings', { memberId })
  },

  create(payload: CreateBookingPayload): Promise<Booking> {
    return USE_MOCK
      ? Promise.resolve(mockCreateBooking(payload))
      : http.post<Booking>('/bookings', payload)
  },

  cancel(id: string, memberId = 'demo-member', reason?: string): Promise<Booking> {
    const payload: ChangeBookingPayload = { memberId, ...(reason ? { reason } : {}) }
    return USE_MOCK
      ? Promise.resolve(mockCancelBooking(id))
      : http.patch<Booking>(`/bookings/${id}/cancel`, payload)
  },

  reschedule(
    id: string,
    payload: RescheduleBookingPayload,
    memberId = 'demo-member',
  ): Promise<Booking> {
    const requestPayload = { memberId, ...payload }
    return USE_MOCK
      ? Promise.resolve(mockRescheduleBooking(id, payload))
      : http.patch<Booking>(`/bookings/${id}/reschedule`, requestPayload)
  },

  async getQrCode(id: string): Promise<string> {
    if (USE_MOCK) return ''
    const response = await http.get<{ dataUrl: string }>(`/bookings/${id}/qr`)
    return response.dataUrl
  },
}
