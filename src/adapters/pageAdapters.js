import { normalizeRankingPage } from '../utils/apiContract'
import { normalizeChart } from './chartAdapter'

export function normalizeMetrics(payload) {
  const source = payload?.data || payload || {}
  return {
    netMargin: source.netMargin ?? source.rate ?? null,
    revenue: source.revenue ?? source.income ?? null,
    cost: source.cost ?? null,
    profit: source.profit ?? null,
    updatedAt: source.updatedAt ?? null
  }
}

export function normalizeTrend(payload) {
  return normalizeChart(payload)
}

export function normalizeRanking(payload) {
  return normalizeRankingPage(payload?.data || payload)
}

export function normalizeFactors(payload) {
  const source = payload?.data || payload || {}
  return {
    month: source.month ?? null,
    items: Array.isArray(source.items) ? source.items : []
  }
}
