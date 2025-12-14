import { PaginationMeta } from './pagination.js';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
  details?: any;
  stack?: string;
  pagination?: PaginationMeta;
  requestId?: string;
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, pagination?: PaginationMeta): ApiResponse<T> {
  const response: ApiResponse<T> = { success: true, data };
  if (pagination) {
    response.pagination = pagination;
  }
  return response;
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: any
): Omit<ApiResponse, 'data'> {
  const response: Omit<ApiResponse, 'data'> = { success: false, code, message };
  if (details) {
    response.details = details;
  }
  return response;
}
