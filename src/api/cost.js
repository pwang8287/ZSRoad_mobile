import { request } from './client'
import { endpoints, paginationParams, withQuery } from './endpoints'

export const getCostOverview = (params, options) => request(withQuery(endpoints.cost.overview, params), options)
export const getCostTrend = (params, options) => request(withQuery(endpoints.cost.trend, params), options)
export const getCostComposition = (params, options) => request(withQuery(endpoints.cost.composition, params), options)
export const getCostCompositionDetail = (params, options) => request(withQuery(endpoints.cost.compositionDetail, params), options)
export const getCostRanking = (params = {}, options) => request(withQuery(endpoints.cost.ranking, paginationParams(params)), options)
