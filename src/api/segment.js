import { request } from './client'
import { endpoints, paginationParams, withQuery } from './endpoints'

export const getSegmentRanking = (params = {}, options) => request(withQuery(endpoints.segment.ranking, paginationParams(params)), options)
