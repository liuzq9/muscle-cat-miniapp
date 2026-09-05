import type { Booking } from '@/types/domain'
import type { CreateBookingPayload, RescheduleBookingPayload } from '@/services/api/booking'

export const mockBookings: Booking[] = []

export function mockCreateBooking(payload: CreateBookingPayload): Booking {
  const now = Date.now()
  return {
    id: `demo-${now}`,
    ...payload,
    status: 'booked',
    qrToken: `MC-DEMO-${now}`,
  }
}

export function mockCancelBooking(id: string): Booking {
  return { id, status: 'cancelled' } as Booking
}

export function mockRescheduleBooking(id: string, payload: RescheduleBookingPayload): Booking {
  return { id, ...payload, status: 'booked' } as Booking
}
