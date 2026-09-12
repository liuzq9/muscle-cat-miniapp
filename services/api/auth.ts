import type { Member } from '@/types/domain'
import { http, USE_MOCK } from '@/services/http'
import { mockLogin } from '@/services/mocks/auth'

export interface LoginResult {
  accessToken: string
  member: Member
}

export interface WechatLoginPayload {
  code: string
}

export interface BindPhonePayload {
  code: string
}

export const authApi = {
  wechatLogin(payload: WechatLoginPayload): Promise<LoginResult> {
    return USE_MOCK
      ? Promise.resolve(mockLogin())
      : http.post<LoginResult>('/auth/wechat-login', payload)
  },

  bindPhone(payload: BindPhonePayload): Promise<Member> {
    return USE_MOCK
      ? Promise.resolve({ ...mockLogin().member, phoneBound: true })
      : http.post<Member>('/auth/bind-phone', payload)
  },

  me(): Promise<Member> {
    return USE_MOCK ? Promise.resolve(mockLogin().member) : http.get<Member>('/auth/me')
  },
}
