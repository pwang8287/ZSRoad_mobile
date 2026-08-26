import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getRanking } from '../api/dashboard'
import { normalizeRankingPage } from '../utils/apiContract'

export function useRankingPagination(params) {
  const paramsKey = JSON.stringify(params || {})
  const stableParams = useMemo(() => params || {}, [paramsKey])
  const [state, setState] = useState({ items: [], page: 0, total: 0, hasMore: true, loading: false, error: null, updatedAt: '-' })
  const requestId = useRef(0)

  const loadPage = useCallback(async (page = 1, append = false) => {
    const id = ++requestId.current
    setState(current => ({ ...current, loading: true, error: null }))
    try {
      const result = normalizeRankingPage(await getRanking({ ...stableParams, page, pageSize: 20 }, {}))
      if (id !== requestId.current) return
      setState(current => ({ ...result, items: append ? [...current.items, ...result.items] : result.items, loading: false, error: null }))
    } catch (error) {
      if (id === requestId.current) setState(current => ({ ...current, loading: false, error }))
    }
  }, [stableParams])

  useEffect(() => { loadPage(1, false) }, [loadPage])
  const loadMore = useCallback(() => { if (!state.loading && state.hasMore) loadPage(state.page + 1, true) }, [loadPage, state])
  return { ...state, reload: () => loadPage(1, false), loadMore }
}
