'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Diet } from '@/models/diet'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteDiet, getDiets, queryKeyDiets } from '@/network/client/diets'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { EditDietForm } from '../forms/edit-diet-form'
import { AddButton } from '../buttons/add-button'
import { SheetEdit } from '../dialogs/sheet-edit'
import { MainButton } from '../buttons/main-button'

interface DietsTableProps {
  onConfirmRowSelection?: (selectedRows: Diet[]) => void
}

export function DietsTable({ onConfirmRowSelection }: DietsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<Diet[]>([])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyDiets, pagination],
    queryFn: () => getDiets({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Diet>[]>(
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
        header: 'Tên chế độ ăn',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'image',
        cell: ({ row }) => (
          <div>
            <img
              src={row.getValue('image')}
              alt={`${row.getValue('name')} thumbnail`}
              className="h-20 w-20 rounded-md object-cover"
            />
          </div>
        ),
        size: 100,
        enableSorting: false,
      },
      {
        header: 'Mô tả',
        accessorKey: 'description',
        cell: ({ row }) => <div className="line-clamp-2">{row.getValue('description')}</div>,
        size: 180,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={(row) => onDeleteRows([row])} />,
        size: 60,
        enableHiding: false,
      },
    ],
    []
  )

  const [selectedRow, setSelectedRow] = useState<Diet | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Diet) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRows = async (selectedRows: Diet[]) => {
    const deletePromise = () => deleteDiet(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá chế độ ăn thành công'
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
        state={{ pagination }}
        rowCount={data?.paging.total}
        onDelete={onDeleteRows}
        onPaginationChange={setPagination}
        onRowSelectionChange={setRowSelection}
        rightSection={
          <>
            {onConfirmRowSelection && (
              <MainButton
                variant="outline"
                text={`Chọn ${rowSelection.length} chế độ ăn`}
                onClick={() => {
                  if (rowSelection.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một chế độ ăn')
                    return
                  }
                  onConfirmRowSelection(rowSelection)
                }}
              />
            )}
            <AddButton text="Thêm chế độ ăn" onClick={onAddRow} />
          </>
        }
      />
      <SheetEdit
        title={isEdit ? 'Chỉnh sửa chế độ ăn' : 'Thêm chế độ ăn'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditDietForm data={selectedRow} onSuccess={onEditSuccess} />
      </SheetEdit>
    </>
  )
}
