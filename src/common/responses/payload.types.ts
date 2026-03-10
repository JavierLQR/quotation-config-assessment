import type { PaginationMeta } from '../utils'

export interface GqlPayload<T = unknown, M = PaginationMeta | undefined> {
  data?: T
  metadataPagination?: M
  message: string
  status: 'success' | 'error'
  success: boolean
  path?: string
  service?: string
}

export interface AuthPayload<T = unknown> extends GqlPayload<T> {
  token: string
  expires_in: number
}
