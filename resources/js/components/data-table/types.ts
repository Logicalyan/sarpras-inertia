import { ColumnDef } from '@tanstack/react-table'

export type PaginationMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export type ServerTableProps<TData> = {
  data: TData[]
  meta: PaginationMeta
  // informasi sort & search dari backend (opsional)
  sort?: string | null
  search?: string | null
  columns: ColumnDef<TData, any>[]
}
