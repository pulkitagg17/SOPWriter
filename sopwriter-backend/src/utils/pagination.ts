import { PAGINATION } from '../constants/index.js';

export function parsePagination(query: any) {
    const page = Math.max(
        PAGINATION.MIN_LIMIT,
        Number(query.page) || PAGINATION.DEFAULT_PAGE
    );

    const limit = Math.min(
        PAGINATION.MAX_LIMIT,
        Math.max(
            PAGINATION.MIN_LIMIT,
            Number(query.limit) || PAGINATION.DEFAULT_LIMIT
        )
    );

    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

export function buildPaginationMeta(
    { page, limit }: { page: number; limit: number },
    total: number
) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
