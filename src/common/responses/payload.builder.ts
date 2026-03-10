import type { PaginationMeta } from '../utils'
import { GqlPayload, AuthPayload } from './payload.types'

export class PayloadBuilder {
  static success<T = unknown>(
    message: string,
    data?: T,
    metadataPagination?: PaginationMeta,
  ): GqlPayload<T> {
    return {
      data,
      metadataPagination,
      message,
      status: 'success',
      success: true,
    }
  }

  static error(
    message: string = 'Error',
    service: string = 'GlobalExceptionFilter',
    path?: string,
  ): GqlPayload {
    return {
      message,
      status: 'error',
      success: false,
      path,
      service,
    }
  }

  static auth<T = unknown>(
    token: string,
    expires_in: number,
    message: string = 'Authentication successful',
    data?: T,
  ): AuthPayload<T> {
    return {
      data,
      token,
      expires_in,
      message,
      status: 'success',
      success: true,
    }
  }
}
