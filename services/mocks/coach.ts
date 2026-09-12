import type { Coach, Schedule } from '@/types/domain'

export const mockCoaches: Coach[] = [
  {
    id: 'coach-m1',
    name: '林骁-mock',
    gender: 'male',
    title: '力量与增肌教练',
    bio: '专注力量训练与动作基础，帮助建立可持续的训练习惯。',
    specialties: ['增肌', '力量训练'],
    avatarUrl: '/static/coach-m1.png',
    courseIds: ['course-strength', 'course-posture'],
  },
  {
    id: 'coach-m2',
    name: '周野-mock',
    gender: 'male',
    title: '体能与减脂教练',
    bio: '用科学训练提升体能，让减脂变得清晰、可执行。',
    specialties: ['减脂', '功能训练'],
    avatarUrl: '/static/coach-m2.png',
    courseIds: ['course-fatloss', 'course-strength'],
  },
  {
    id: 'coach-f1',
    name: '苏妍-mock',
    gender: 'female',
    title: '塑形与体态教练',
    bio: '关注体态、核心与身体控制，适合希望循序渐进塑形的会员。',
    specialties: ['塑形', '体态调整'],
    avatarUrl: '/static/coach-f1.png',
    courseIds: ['course-shape', 'course-posture'],
  },
]

export function mockSchedules(coachId: string, date: string): Schedule[] {
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
