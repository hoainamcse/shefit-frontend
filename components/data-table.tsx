'use client'

import { JSX, useMemo, useState } from 'react'
import { SearchIcon } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'

export interface ColumnDef<T = any> {
  accessorKey: Extract<keyof T, string> | string
  header?: string | JSX.Element
  render?: ({ row }: { row: T }) => string | JSX.Element
}

interface DataTableProps {
  data: any[]
  columns: ColumnDef[]
  headerExtraContent?: React.ReactNode
  onSearchChange?: (value: string) => void
  onSelectChange?: (value: string[]) => void
  searchPlaceholder?: string
}

export function DataTable({ data, columns, headerExtraContent, searchPlaceholder, onSelectChange }: DataTableProps) {
  const [selected, setSelected] = useState<Record<string, CheckedState>>({})

  const handleSelectChange = (checked: CheckedState, id?: string) => {
    if (id) {
      setSelected((prev) => ({ ...prev, [id]: checked }))
    } else {
      setSelected(data.reduce((acc, item) => ({ ...acc, [item.id]: checked }), {}))
    }
  }

  const checkedLen = useMemo(() => Object.values(selected).filter((v) => v === true).length, [selected])

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center gap-2">
        <div className="relative">
          <Input className="peer ps-9" placeholder={searchPlaceholder} type="text" />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon size={16} aria-hidden="true" />
          </div>
        </div>
        {headerExtraContent && <div className="flex items-center justify-end gap-2">{headerExtraContent}</div>}
      </div>
      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead className="text-right">Amount</TableHead> */}
                {onSelectChange && (
                  <TableHead className="w-10 px-3">
                    <Checkbox
                      checked={checkedLen > 0 && checkedLen < data.length ? 'indeterminate' : !!checkedLen}
                      onCheckedChange={(checked) => handleSelectChange(checked)}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead key={column.accessorKey as string} className="px-3">
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((pData) => (
                <TableRow key={pData.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  {onSelectChange && (
                    <TableCell className="w-10 p-3">
                      <Checkbox
                        checked={selected[pData.id]}
                        onCheckedChange={(checked) => handleSelectChange(checked, pData.id)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={`${column.accessorKey as string}-${pData.id}`} className="p-3">
                      {column.render ? column.render({ row: pData }) : pData[column.accessorKey] ?? '_'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">{data.length}</TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </div>
      </div>
    </div>
  )
}
