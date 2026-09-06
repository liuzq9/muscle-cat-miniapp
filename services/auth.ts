import type { Member } from '@/types/domain'
import { authApi } from '@/services/api/auth'
import { USE_MOCK } from '@/services/http'
import { mockLogin } from '@/services/mocks/auth'

const TOKEN_KEY = 'accessToken'
const MEMBER_KEY = 'member'

export function getMember(): Member | null {
  return uni.getStorageSync(MEMBER_KEY) || null
}

export function getMemberId(): string {
  return getMember()?.id || 'demo-member'
}

export function isLoggedIn(): boolean {
  return Boolean(uni.getStorageSync(TOKEN_KEY))
}

export async function login(): Promise<Member> {
  if (USE_MOCK) {
    const response = mockLogin()
    uni.setStorageSync(TOKEN_KEY, response.accessToken)
    uni.setStorageSync(MEMBER_KEY, response.member)
    return response.member
  }
  const result = await new Promise<{ code: string }>((resolve, reject) => {
    uni.login({ provider: 'weixin', success: resolve, fail: reject })
  })
  const response = await authApi.wechatLogin({ code: result.code })
  uni.setStorageSync(TOKEN_KEY, response.accessToken)
  uni.setStorageSync(MEMBER_KEY, response.member)
  return response.member
}

export async function bindPhone(code: string): Promise<Member> {
  const member = await authApi.bindPhone({ code })
  uni.setStorageSync(MEMBER_KEY, member)
  return member
}

export function logout() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(MEMBER_KEY)
}
