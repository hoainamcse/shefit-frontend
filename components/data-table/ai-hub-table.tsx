'use client'

import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { EditSheet } from './edit-sheet'
import { EditAIHubForm } from '../forms/edit-ai-hub-form'
import { Greeting } from '@/models/chatbot'
import { deleteBulkGreeting, deleteGreeting, getListGreeting, importGreetingExcel, queryKeyGreetings } from '@/network/client/chatbot'
import { ExcelImportDialog } from '../excel-import-dialog'

interface AIHubTableProps {
  onConfirmRowSelection?: (selectedRows: Greeting[]) => void
}

export function AIHubTable({ onConfirmRowSelection }: AIHubTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyGreetings, pagination],
    queryFn: () => getListGreeting({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Greeting>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: 'Message',
        accessorKey: 'message',
        cell: ({ row }) => <div className="font-medium">{row.getValue('message')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Prompt',
        accessorKey: 'prompt',
        cell: ({ row }) => <div className="font-medium">{row.getValue('prompt')}</div>,
        size: 180,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <div className="font-medium">{row.getValue('status')}</div>,
        size: 180,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
        enableHiding: false,
      },
    ],
    []
  )

  const [selectedRow, setSelectedRow] = useState<Greeting | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Greeting) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Greeting) => {
    const deletePromise = () => deleteGreeting(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá câu hỏi thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Greeting[]) => {
    const deletePromise = () => deleteBulkGreeting(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá câu hỏi thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onEditSuccess = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(false)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    )
  }

  const isEdit = !!selectedRow

  return (
    <>
      <DataTable
        data={data?.data}
        columns={columns}
        state={{ pagination, rowSelection }}
        rowCount={data?.paging.total}
        onDelete={onDeleteRows}
        onPaginationChange={setPagination}
        onRowSelectionChange={setRowSelection}
        rightSection={
          <>
            {onConfirmRowSelection && (
              <MainButton
                variant="outline"
                text={`Chọn ${Object.keys(rowSelection).length} HLV`}
                onClick={() => {
                  const selectedRows = Object.keys(rowSelection).map((key) => data?.data?.[Number(key)])
                  if (selectedRows.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một HLV')
                    return
                  }
                  onConfirmRowSelection(selectedRows.filter((row): row is Greeting => !!row))
                }}
              />
            )}
            <AddButton text="Thêm câu hỏi" onClick={onAddRow} />
            <ExcelImportDialog
              title="Messages"
              handleSubmit={async (file: File) => {
                await importGreetingExcel(file)
                refetch()
              }}
            />
          </>
        }
      />
      <EditSheet
        title={isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditAIHubForm data={selectedRow} onSuccess={onEditSuccess} />
      </EditSheet>
    </>
  )
}
