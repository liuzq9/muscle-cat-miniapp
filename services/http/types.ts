export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  traceId?: string
}

export interface RequestConfig<T = unknown> {
  url: string
  method?: HttpMethod
  params?: Record<string, unknown>
  data?: T
  headers?: Record<string, string>
  timeout?: number
  skipAuth?: boolean
}

export interface HttpResponse<T = unknown> {
  statusCode: number
  data: T
  header?: Record<string, string>
}
