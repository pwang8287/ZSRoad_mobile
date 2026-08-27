import { numberOrDash, isoTimeOrDash } from '../utils/apiContract'

export function normalizeChart(payload) {
  const source = payload?.data || payload || {}
  const categories = Array.isArray(source.categories) ? source.categories : Array.isArray(source.names) ? source.names : []
  const series = Array.isArray(source.series) ? source.series.map(item => ({
    key: item.key ?? item.name,
    name: item.name ?? '-',
    color: item.color,
    data: Array.isArray(item.data) ? item.data.map(numberOrDash) : []
  })) : []
  return { categories, series, unit: source.unit ?? '', updatedAt: isoTimeOrDash(source.updatedAt) }
}
