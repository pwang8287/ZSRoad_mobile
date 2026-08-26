import { request } from './client'

const query = params => new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')).toString()

export function getOverview(params, options) {
  return request(`/dashboard/overview?${query(params)}`, options)
}

export function getProfitTrend(params, options) {
  return request(`/dashboard/profit-trend?${query(params)}`, options)
}

export function getCompanyComparison(params, options) {
  return request(`/dashboard/company-comparison?${query(params)}`, options)
}

export function getRanking({ page = 1, pageSize = 20, sortField = 'profit', sortDirection = 'desc', ...params }, options) {
  const safePageSize = Math.min(Math.max(Number(pageSize) || 20, 1), 20)
  return request(`/dashboard/ranking?${query({ ...params, page, pageSize: safePageSize, sortField, sortDirection })}`, options)
}
