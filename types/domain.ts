export type SlotStatus = 'available' | 'booked' | 'blocked' | 'completed'
export type BookingStatus = 'booked' | 'checked_in' | 'completed' | 'cancelled'

export interface StudioInfo {
  name: string
  story: string
  address: string
  hours: string
  phone: string
  logoUrl: string
}
export interface Coach {
  id: string
  name: string
  gender: 'male' | 'female'
  title: string
  bio: string
  specialties: string[]
  avatarUrl: string
  courseIds: string[]
}
export interface Course {
  id: string
  name: string
  durationMinutes: number
  description: string
  coachIds: string[]
}
export interface Schedule {
  id: string
  coachId: string
  date: string
  startTime: string
  endTime: string
  status: SlotStatus
  bookingId?: string
}
export interface Booking {
  id: string
  memberId: string
  coachId: string
  courseId: string
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  qrToken: string
}
export interface AttendanceRecord extends Booking {
  checkedInAt?: string
  completedAt?: string
  verifiedBy?: string
}
