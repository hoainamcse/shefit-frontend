'use client'

import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table'
import type { Calorie } from '@/models/calorie'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteCalorie, getCalories, queryKeyCalories } from '@/network/client/calories'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { EditCalorieForm } from '../forms/edit-calorie-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { EditSheet } from './edit-sheet'

interface CaloriesTableProps {
  onConfirmRowSelection?: (data: Calorie[]) => void
}

export function CaloriesTable({ onConfirmRowSelection }: CaloriesTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyCalories, pagination],
    queryFn: () => getCalories({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Calorie>[]>(
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
        header: 'Tên calorie',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Mô tả',
        accessorKey: 'description',
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

  const [selectedRow, setSelectedRow] = useState<Calorie | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Calorie) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Calorie) => {
    const deletePromise = () => deleteCalorie(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá calorie thành công'
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
        onPaginationChange={setPagination}
        onRowSelectionChange={setRowSelection}
        rightSection={
          <>
            {onConfirmRowSelection && (
              <MainButton
                variant="outline"
                text={`Chọn ${Object.keys(rowSelection).length} calorie`}
                onClick={() => {
                  const selectedRows = Object.keys(rowSelection).map((key) => data?.data?.[Number(key)])
                  if (selectedRows.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một calorie để xoá')
                    return
                  }
                  onConfirmRowSelection(selectedRows.filter((row): row is Calorie => !!row))
                }}
              />
            )}
            <AddButton text="Thêm calorie" onClick={onAddRow} />
          </>
        }
      />
      <EditSheet
        title={isEdit ? 'Chỉnh sửa calorie' : 'Thêm calorie'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditCalorieForm data={selectedRow} onSuccess={onEditSuccess} />
      </EditSheet>
    </>
  )
}
