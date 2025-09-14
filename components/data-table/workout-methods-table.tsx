'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { WorkoutMethod } from '@/models/workout-method'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  deleteBulkWorkoutMethod,
  deleteWorkoutMethod,
  getWorkoutMethods,
  queryKeyWorkoutMethods,
} from '@/network/client/workout-methods'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { EditWorkoutMethodForm } from '../forms/edit-workout-method-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { SheetEdit } from '../dialogs/sheet-edit'

interface WorkoutMethodsTableProps {
  onConfirmRowSelection?: (selectedRows: WorkoutMethod[]) => void
}

export function WorkoutMethodsTable({ onConfirmRowSelection }: WorkoutMethodsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<WorkoutMethod[]>([])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyWorkoutMethods, pagination],
    queryFn: () => getWorkoutMethods({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<WorkoutMethod>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
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
        header: 'Tên loại hình tập luyện',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
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

  const [selectedRow, setSelectedRow] = useState<WorkoutMethod | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: WorkoutMethod) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: WorkoutMethod) => {
    const deletePromise = () => deleteWorkoutMethod(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá loại hình tập luyện thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: WorkoutMethod[]) => {
    const deletePromise = () => deleteBulkWorkoutMethod(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá loại hình tập luyện thành công'
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
                text={`Chọn ${rowSelection.length} loại hình tập luyện`}
                onClick={() => {
                  if (rowSelection.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một loại hình tập luyện')
                    return
                  }
                  onConfirmRowSelection(rowSelection)
                }}
              />
            )}
            <AddButton text="Thêm loại hình tập luyện" onClick={onAddRow} />
          </>
        }
      />
      <SheetEdit
        title={isEdit ? 'Chỉnh sửa loại hình tập luyện' : 'Thêm loại hình tập luyện'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditWorkoutMethodForm data={selectedRow} onSuccess={onEditSuccess} />
      </SheetEdit>
    </>
  )
}
