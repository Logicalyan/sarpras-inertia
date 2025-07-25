'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { debounce } from '@/lib/debounce'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearch: (value: string) => void
  search: string
  placeholder?: string,
  extraFilters?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  search,
  placeholder = 'Search...',
  extraFilters,
}: DataTableToolbarProps<TData>) {
  const [value, setValue] = React.useState(search ?? '')

  const trigger = React.useMemo(() => debounce(onSearch, 400), [onSearch])

  React.useEffect(() => {
    trigger(value)
  }, [value, trigger])

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-sm"
      />
      {extraFilters && <div className="flex items-center gap-2">{extraFilters}</div>}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
