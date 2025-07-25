'use client'

import { PaginationMeta } from './types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export function DataTablePagination({ meta, onPageChange, onPerPageChange }: Props) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-sm text-muted-foreground">
        Page {meta.current_page} of {meta.last_page} • Total {meta.total}
      </div>

      <div className="flex items-center gap-2">
        <Select
          defaultValue={String(meta.per_page)}
          onValueChange={(v) => onPerPageChange(Number(v))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={meta.per_page} />
          </SelectTrigger>
          <SelectContent>
          {[10, 25, 50, 100].map((n) => (
            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
          ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(meta.current_page - 1)}
            disabled={meta.current_page <= 1}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(meta.current_page + 1)}
            disabled={meta.current_page >= meta.last_page}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
