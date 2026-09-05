import type { Coach, Schedule } from '@/types/domain'
import { http, USE_MOCK } from '@/services/http'
import { mockCoaches, mockSchedules } from '@/services/mocks/coach'

export const coachApi = {
  list(): Promise<Coach[]> {
    return USE_MOCK ? Promise.resolve(mockCoaches) : http.get<Coach[]>('/coaches')
  },

  detail(id: string): Promise<Coach> {
    if (USE_MOCK)
      return Promise.resolve(mockCoaches.find((item) => item.id === id) ?? mockCoaches[0])
    return http.get<Coach>(`/coaches/${id}`)
  },

  schedules(coachId: string, date: string): Promise<Schedule[]> {
    return USE_MOCK
      ? Promise.resolve(mockSchedules(coachId, date))
      : http.get<Schedule[]>(`/coaches/${coachId}/schedules`, { date })
  },
}
