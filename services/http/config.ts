export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
export const REQUEST_TIMEOUT = 10000

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}
