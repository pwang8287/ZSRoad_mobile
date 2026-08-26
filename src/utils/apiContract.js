export const EMPTY_VALUE = '-'

export function numberOrDash(value) {
  return value === null || value === undefined || value === '' ? EMPTY_VALUE : Number(value)
}

export function percentOrDash(value) {
  return value === null || value === undefined || value === '' ? EMPTY_VALUE : Number(value)
}

export function isoTimeOrDash(value) {
  if (!value) return EMPTY_VALUE
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? EMPTY_VALUE : date.toISOString()
}

export function normalizeRankingPage(payload) {
  const rows = Array.isArray(payload?.items) ? payload.items : []
  return {
    items: rows.map(item => ({
      id: item.id ?? item.name,
      name: item.name ?? EMPTY_VALUE,
      profit: numberOrDash(item.profit),
      yoy: percentOrDash(item.yoy),
      mom: percentOrDash(item.mom),
      status: item.status ?? EMPTY_VALUE
    })),
    page: Number(payload?.page) || 1,
    pageSize: Math.min(Number(payload?.pageSize) || 20, 20),
    total: Number(payload?.total) || 0,
    hasMore: Boolean(payload?.hasMore),
    updatedAt: isoTimeOrDash(payload?.updatedAt)
  }
}
