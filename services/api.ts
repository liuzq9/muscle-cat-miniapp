import type { AttendanceRecord, Booking, Coach, Course, Schedule, StudioInfo } from '@/types/domain'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const mockCoaches: Coach[] = [
  {
    id: 'coach-m1',
    name: '林骁',
    gender: 'male',
    title: '力量与增肌教练',
    bio: '专注力量训练与动作基础，帮助建立可持续的训练习惯。',
    specialties: ['增肌', '力量训练'],
    avatarUrl: '/static/coach-m1.png',
    courseIds: ['course-strength', 'course-posture'],
  },
  {
    id: 'coach-m2',
    name: '周野',
    gender: 'male',
    title: '体能与减脂教练',
    bio: '用科学训练提升体能，让减脂变得清晰、可执行。',
    specialties: ['减脂', '功能训练'],
    avatarUrl: '/static/coach-m2.png',
    courseIds: ['course-fatloss', 'course-strength'],
  },
  {
    id: 'coach-f1',
    name: '苏妍',
    gender: 'female',
    title: '塑形与体态教练',
    bio: '关注体态、核心与身体控制，适合希望循序渐进塑形的会员。',
    specialties: ['塑形', '体态调整'],
    avatarUrl: '/static/coach-f1.png',
    courseIds: ['course-shape', 'course-posture'],
  },
]
const mockCourses: Course[] = [
  {
    id: 'course-strength',
    name: '增肌力量私教',
    durationMinutes: 60,
    description: '围绕大肌群和基础动作制定训练计划。',
    coachIds: ['coach-m1', 'coach-m2'],
  },
  {
    id: 'course-fatloss',
    name: '体能减脂私教',
    durationMinutes: 60,
    description: '力量与心肺结合，提升训练效率。',
    coachIds: ['coach-m2'],
  },
  {
    id: 'course-shape',
    name: '女性塑形私教',
    durationMinutes: 60,
    description: '注重核心、臀腿和身体线条。',
    coachIds: ['coach-f1'],
  },
  {
    id: 'course-posture',
    name: '体态调整私教',
    durationMinutes: 60,
    description: '从活动度和动作模式入手改善体态。',
    coachIds: ['coach-m1', 'coach-f1'],
  },
]

const mockStudio: StudioInfo = {
  name: '肌肉猫',
  story:
    '肌肉猫成立于南京，专注一对一私教训练。我们相信，稳定的训练节奏和真正适合你的方法，比短期冲刺更重要。',
  address: '南京市·肌肉猫健身工作室',
  hours: '每日 07:00-20:00',
  phone: '025-8888-6666',
  logoUrl: '/static/logo.png',
}

function mockSchedules(coachId: string, date: string): Schedule[] {
  const bookedIndex = date.endsWith('1') ? 2 : date.endsWith('2') ? 5 : -1
  return Array.from({ length: 13 }, (_, index) => ({
    id: `${coachId}-${date}-${index}`,
    coachId,
    date,
    startTime: `${String(index + 7).padStart(2, '0')}:00`,
    endTime: `${String(index + 8).padStart(2, '0')}:00`,
    status: index === bookedIndex ? 'booked' : 'available',
  }))
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  const data = options.body ? JSON.parse(String(options.body)) : undefined
  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${path}`,
      // uni.request 的类型声明未包含 PATCH，但运行时支持该方法。
      method: method as never,
      data,
      header: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) resolve(response.data as T)
        else reject(new Error((response.data as any)?.message || '请求失败'))
      },
      fail: reject,
    })
  })
}

export const api = {
  async studio(): Promise<StudioInfo> {
    return USE_MOCK ? mockStudio : request('/studio')
  },
  async coaches(): Promise<Coach[]> {
    return USE_MOCK ? mockCoaches : request('/coaches')
  },
  async coach(id: string): Promise<Coach> {
    return USE_MOCK ? mockCoaches.find((item) => item.id === id)! : request(`/coaches/${id}`)
  },
  async courses(coachId?: string): Promise<Course[]> {
    return USE_MOCK
      ? mockCourses.filter((item) => !coachId || item.coachIds.includes(coachId))
      : request(`/courses${coachId ? `?coachId=${coachId}` : ''}`)
  },
  async schedules(coachId: string, date: string): Promise<Schedule[]> {
    return USE_MOCK
      ? mockSchedules(coachId, date)
      : request(`/coaches/${coachId}/schedules?date=${date}`)
  },
  async bookings(memberId = 'demo-member'): Promise<Booking[]> {
    return USE_MOCK ? [] : request(`/bookings?memberId=${memberId}`)
  },
  async history(memberId = 'demo-member'): Promise<AttendanceRecord[]> {
    return USE_MOCK ? [] : request(`/attendance/history?memberId=${memberId}`)
  },
  async createBooking(payload: Record<string, string>): Promise<Booking> {
    return USE_MOCK
      ? ({
          id: `demo-${Date.now()}`,
          ...payload,
          status: 'booked',
          qrToken: `MC-DEMO-${Date.now()}`,
        } as Booking)
      : request('/bookings', { method: 'POST', body: JSON.stringify(payload) })
  },
  async cancelBooking(id: string): Promise<Booking> {
    return USE_MOCK
      ? ({ id, status: 'cancelled' } as Booking)
      : request(`/bookings/${id}/cancel`, {
          method: 'PATCH',
          body: JSON.stringify({ memberId: 'demo-member' }),
        })
  },
  async rescheduleBooking(id: string, payload: Record<string, string>): Promise<Booking> {
    return USE_MOCK
      ? ({ id, ...payload, status: 'booked' } as Booking)
      : request(`/bookings/${id}/reschedule`, {
          method: 'PATCH',
          body: JSON.stringify({ memberId: 'demo-member', ...payload }),
        })
  },
  async bookingQr(id: string): Promise<string> {
    return USE_MOCK ? '' : (await request<{ dataUrl: string }>(`/bookings/${id}/qr`)).dataUrl
  },
  async verifyAttendance(
    qrToken: string,
    action: 'check_in' | 'complete' = 'check_in',
  ): Promise<AttendanceRecord> {
    return USE_MOCK
      ? ({
          id: `demo-${Date.now()}`,
          qrToken,
          status: action === 'complete' ? 'completed' : 'checked_in',
        } as AttendanceRecord)
      : request('/attendance/verify', {
          method: 'POST',
          body: JSON.stringify({ qrToken, action, verifiedBy: 'coach-demo' }),
        })
  },
}
