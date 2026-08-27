export const endpoints = {
  overview: {
    summary: '/dashboard/overview',
    trend: '/dashboard/profit-trend',
    comparison: '/dashboard/company-comparison',
    ranking: '/dashboard/ranking'
  },
  revenue: {
    overview: '/revenue/overview',
    trend: '/revenue/trend',
    factors: '/revenue/factors',
    ranking: '/revenue/ranking',
    detail: '/revenue/detail'
  },
  cost: {
    overview: '/cost/overview',
    trend: '/cost/trend',
    composition: '/cost/composition',
    compositionDetail: '/cost/composition/detail',
    ranking: '/cost/ranking'
  },
  segment: {
    ranking: '/segment/ranking'
  }
}

export function buildQuery(params = {}) {
  return new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')).toString()
}

export function withQuery(path, params) {
  const query = buildQuery(params)
  return query ? `${path}?${query}` : path
}

export function paginationParams({ page = 1, pageSize = 20, ...params } = {}) {
  return { ...params, page: Math.max(1, Number(page) || 1), pageSize: Math.min(Math.max(Number(pageSize) || 20, 1), 20) }
}
