import type { StudioInfo } from '@/types/domain'
import { http, USE_MOCK } from '@/services/http'
import { mockStudio } from '@/services/mocks/studio'

export const studioApi = {
  getInfo(): Promise<StudioInfo> {
    return USE_MOCK ? Promise.resolve(mockStudio) : http.get<StudioInfo>('/studio')
  },
}
