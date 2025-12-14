import { PAGINATION } from '../constants/index.js';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Parse and validate pagination parameters from query string
 */
export function parsePagination(
  query: { page?: string; limit?: string },
  options: PaginationOptions = {}
): PaginationParams {
  const defaultLimit = options.defaultLimit || PAGINATION.DEFAULT_LIMIT;
  const maxLimit = options.maxLimit || PAGINATION.MAX_LIMIT;

  const limit = Math.min(
    Math.max(parseInt(query.limit || String(defaultLimit), 10), PAGINATION.MIN_LIMIT),
    maxLimit
  );
  const page = Math.max(
    parseInt(query.page || String(PAGINATION.DEFAULT_PAGE), 10),
    PAGINATION.DEFAULT_PAGE
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Build pagination metadata for API responses
 */
export function buildPaginationMeta(params: PaginationParams, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / params.limit);
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  };
}
