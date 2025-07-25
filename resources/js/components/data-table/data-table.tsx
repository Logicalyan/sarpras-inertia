'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { DataTableToolbar } from './data-table-toolbar'
import { DataTablePagination } from './data-table-pagination'
import { PaginationMeta } from './types'

type DataTableProps<TData> = {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  meta: PaginationMeta
  totalSelectedLabel?: string
  searchPlaceholder?: string
  server: {
    onSearch: (value: string) => void
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
    onSortChange: (sort: string | null) => void
    search?: string | null
    sort?: string | null
  }
  toolbarExtra?: React.ReactNode
}

export function DataTable<TData>({
  columns,
  data,
  meta,
  server,
  totalSelectedLabel = 'selected',
  searchPlaceholder = 'Search...',
  toolbarExtra,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    meta: {
        page: meta.current_page,
        per_page: meta.per_page,
    },
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // client only; untuk server kita pakai meta
    manualPagination: true,
    pageCount: meta.last_page,
  })

  return (
    <div className="space-y-2">
      <DataTableToolbar
        table={table}
        onSearch={server.onSearch}
        search={server.search ?? ''}
        placeholder={searchPlaceholder}
        extraFilters={toolbarExtra}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const isSorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      className={canSort ? 'cursor-pointer select-none' : ''}
                      onClick={() => {
                        if (!canSort) return
                        const next = isSorted === 'asc' ? 'desc' : 'asc'
                        server.onSortChange(`${header.column.id}:${next}`)
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {isSorted ? (isSorted === 'asc' ? ' ↑' : ' ↓') : null}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        meta={meta}
        onPageChange={server.onPageChange}
        onPerPageChange={server.onPerPageChange}
      />
    </div>
  )
}
