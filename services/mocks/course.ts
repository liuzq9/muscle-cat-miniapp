import type { Course } from '@/types/domain'

export const mockCourses: Course[] = [
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
