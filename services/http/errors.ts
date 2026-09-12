export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code = 'REQUEST_ERROR',
    public readonly statusCode?: number,
    public readonly businessCode?: number,
    public readonly traceId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
