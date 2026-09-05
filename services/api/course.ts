import type { Course } from '@/types/domain'
import { http, USE_MOCK } from '@/services/http'
import { mockCourses } from '@/services/mocks/course'

export interface CourseListParams {
  coachId?: string
}

export const courseApi = {
  list(params: CourseListParams = {}): Promise<Course[]> {
    return USE_MOCK
      ? Promise.resolve(
          mockCourses.filter((item) => !params.coachId || item.coachIds.includes(params.coachId)),
        )
      : http.get<Course[]>('/courses', params as Record<string, unknown>)
  },
}
