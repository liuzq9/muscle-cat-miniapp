import { ApiError } from './errors'
import { API_BASE_URL, DEFAULT_HEADERS, REQUEST_TIMEOUT } from './config'
import type { ApiResponse, HttpResponse, RequestConfig } from './types'

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = <T>(response: T) => T | Promise<T>

function buildUrl(url: string, params?: Record<string, unknown>) {
  if (!params) return `${API_BASE_URL}${url}`
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
  return query ? `${API_BASE_URL}${url}?${query}` : `${API_BASE_URL}${url}`
}

function normalizeResponse<T>(response: HttpResponse<unknown>): T {
  if (response.statusCode < 200 || response.statusCode >= 300) {
    const body = response.data as Partial<ApiResponse<unknown>> | undefined
    throw new ApiError(
      body?.message || '请求失败',
      'HTTP_ERROR',
      response.statusCode,
      body?.code,
      body?.traceId,
    )
  }

  const body = response.data as Partial<ApiResponse<T>> | undefined
  if (body && typeof body.code === 'number' && 'data' in body) {
    if (body.code !== 0) {
      throw new ApiError(
        body.message || '业务请求失败',
        'BUSINESS_ERROR',
        response.statusCode,
        body.code,
        body.traceId,
      )
    }
    return body.data as T
  }

  // 兼容尚未升级响应拦截器的后端实例，正式接口仍应返回统一响应结构。
  return response.data as T
}

class HttpClient {
  private readonly requestInterceptors: RequestInterceptor[] = []
  private readonly responseInterceptors: ResponseInterceptor[] = []

  constructor() {
    this.requestInterceptors.push(async (config) => {
      const token = config.skipAuth ? '' : uni.getStorageSync('accessToken')
      return {
        ...config,
        headers: {
          ...DEFAULT_HEADERS,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...config.headers,
        },
      }
    })
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  async request<T, D = unknown>(config: RequestConfig<D>): Promise<T> {
    let nextConfig: RequestConfig<unknown> = config
    for (const interceptor of this.requestInterceptors) nextConfig = await interceptor(nextConfig)

    const response = await new Promise<HttpResponse<unknown>>((resolve, reject) => {
      uni.request({
        url: buildUrl(nextConfig.url, nextConfig.params),
        method: (nextConfig.method || 'GET') as never,
        // uni.request 的类型声明只接受有限的数据类型，业务请求体统一为 JSON 对象。
        data: nextConfig.data as never,
        timeout: nextConfig.timeout || REQUEST_TIMEOUT,
        header: nextConfig.headers,
        success: (result) => resolve(result as HttpResponse<unknown>),
        fail: (error) => reject(new ApiError(error.errMsg || '网络请求失败', 'NETWORK_ERROR')),
      })
    })

    let result = normalizeResponse<T>(response)
    for (const interceptor of this.responseInterceptors) result = await interceptor(result)
    return result
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.request<T>({ url, method: 'GET', params })
  }

  post<T, D = unknown>(url: string, data?: D) {
    return this.request<T, D>({ url, method: 'POST', data })
  }

  patch<T, D = unknown>(url: string, data?: D) {
    return this.request<T, D>({ url, method: 'PATCH', data })
  }

  delete<T>(url: string, params?: Record<string, unknown>) {
    return this.request<T>({ url, method: 'DELETE', params })
  }
}

export const http = new HttpClient()
