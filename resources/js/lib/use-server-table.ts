import { router, usePage } from '@inertiajs/react'
import { useCallback, useMemo } from 'react'

type TableQuery = {
  page?: number
  per_page?: number
  sort?: string // "column:asc" | "column:desc"
  search?: string
  [key: string]: any
}

type Options = {
  /** kunci yang kalau berubah → page di-reset ke 1 */
  resetPageOn?: (keyof TableQuery)[]
  /** pakai replace history? */
  replace?: boolean
  /** baseUrl manual kalau mau override */
  baseUrl?: string
}

function qsToObject(search: string) {
  return Object.fromEntries(new URLSearchParams(search)) as Record<string, any>
}

export function useServerTable(initial: TableQuery = {}, opts: Options = {}) {
  const { url } = usePage()
  const {
    resetPageOn = ['search', 'sort', 'per_page'],
    replace = true,
    baseUrl = url.split('?')[0],
  } = opts

  const currentFromUrl = useMemo(() => qsToObject(url.split('?')[1] ?? ''), [url])

  const current = useMemo<TableQuery>(() => {
    // priority: url -> initial
    return { ...initial, ...currentFromUrl }
  }, [initial, currentFromUrl])

  const go = useCallback(
    (
      patch: TableQuery = {},
      {
        preserveScroll = true,
        preserveState = true,
        useReplace = replace,
      }: {
        preserveScroll?: boolean
        preserveState?: boolean
        useReplace?: boolean
      } = {}
    ) => {
      const next: TableQuery = { ...current, ...patch }

      // Reset page jika ada key penting yang berubah
      const shouldReset = resetPageOn.some((k) => k in patch && patch[k] !== current[k])
      if (shouldReset) {
        next.page = 1
      }

      // bersihkan nilai kosong/null/undefined
      Object.keys(next).forEach((k) => {
        if (next[k] === undefined || next[k] === null || next[k] === '') {
          delete next[k]
        }
      })

      router.get(baseUrl, next, {
        preserveScroll,
        preserveState,
        replace: useReplace,
      })
    },
    [baseUrl, current, resetPageOn, replace]
  )

  const setPage = useCallback((page: number) => go({ page }, { useReplace: true }), [go])
  const setPerPage = useCallback((per_page: number) => go({ per_page }), [go])
  const setSearch = useCallback((search: string) => go({ search }), [go])
  const setSort = useCallback((sort: string | null) => go({ sort: sort ?? undefined }), [go])

  return { go, current, setPage, setPerPage, setSearch, setSort }
}
