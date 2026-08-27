import { request } from './client'
import { endpoints, paginationParams, withQuery } from './endpoints'

export const getRevenueOverview = (params, options) => request(withQuery(endpoints.revenue.overview, params), options)
export const getRevenueTrend = (params, options) => request(withQuery(endpoints.revenue.trend, params), options)
export const getRevenueFactors = (params, options) => request(withQuery(endpoints.revenue.factors, params), options)
export const getRevenueDetail = (params, options) => request(withQuery(endpoints.revenue.detail, params), options)
export const getRevenueRanking = (params = {}, options) => request(withQuery(endpoints.revenue.ranking, paginationParams(params)), options)
