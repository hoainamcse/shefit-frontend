'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Goal } from '@/models/goal'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteBulkGoal, deleteGoal, getGoals, queryKeyGoals } from '@/network/client/goals'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { EditGoalForm } from '../forms/edit-goal-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { SheetEdit } from '../dialogs/sheet-edit'

interface GoalsTableProps {
  onConfirmRowSelection?: (selectedRows: Goal[]) => void
}

export function GoalsTable({ onConfirmRowSelection }: GoalsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<Goal[]>([])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyGoals, pagination],
    queryFn: () => getGoals({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Goal>[]>(
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
        cell: ({ row }: { row: any }) => (
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
        header: 'Tên mục tiêu',
        accessorKey: 'name',
        cell: ({ row }: { row: any }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }: { row: any }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
        enableHiding: false,
      },
    ],
    []
  )

  const [selectedRow, setSelectedRow] = useState<Goal | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Goal) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Goal) => {
    const deletePromise = () => deleteGoal(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá mục tiêu thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Goal[]) => {
    const deletePromise = () => deleteBulkGoal(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá mục tiêu thành công'
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
                text={`Chọn ${rowSelection.length} mục tiêu`}
                onClick={() => {
                  if (rowSelection.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một mục tiêu')
                    return
                  }
                  onConfirmRowSelection(rowSelection)
                }}
              />
            )}
            <AddButton text="Thêm mục tiêu" onClick={onAddRow} />
          </>
        }
      />
      <SheetEdit
        title={isEdit ? 'Chỉnh sửa mục tiêu' : 'Thêm mục tiêu'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditGoalForm data={selectedRow} onSuccess={onEditSuccess} />
      </SheetEdit>
    </>
  )
}
