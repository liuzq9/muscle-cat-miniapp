import type { Member } from '@/types/domain'

export const mockMember: Member = {
  id: 'demo-member',
  nickname: '肌肉猫会员',
  phone: '138****8888',
  phoneBound: true,
}

export function mockLogin(): { accessToken: string; member: Member } {
  return { accessToken: 'mock-access-token', member: mockMember }
}
