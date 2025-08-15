'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { MuscleGroup } from '@/models/muscle-group'

import { toast } from 'sonner'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  deleteBulkMuscleGroup,
  deleteMuscleGroup,
  getMuscleGroups,
  queryKeyMuscleGroups,
} from '@/network/client/muscle-groups'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { EditMuscleGroupForm } from '../forms/edit-muscle-group-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { EditSheet } from './edit-sheet'

interface MuscleGroupsTableProps {
  onConfirmRowSelection?: (selectedRows: MuscleGroup[]) => void
}

export function MuscleGroupsTable({ onConfirmRowSelection }: MuscleGroupsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<MuscleGroup[]>([])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyMuscleGroups, pagination],
    queryFn: () => getMuscleGroups({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<MuscleGroup>[]>(
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
        header: 'Tên nhóm cơ',
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
              className="h-16 w-28 rounded-md object-cover"
            />
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
      {
        header: 'Ngày tạo',
        accessorKey: 'created_at',
        cell: ({ row }) => format(row.getValue('created_at'), 'Pp'),
        size: 180,
      },
      {
        header: 'Ngày cập nhật',
        accessorKey: 'updated_at',
        cell: ({ row }) => format(row.getValue('updated_at'), 'Pp'),
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

  const [selectedRow, setSelectedRow] = useState<MuscleGroup | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: MuscleGroup) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: MuscleGroup) => {
    const deletePromise = () => deleteMuscleGroup(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá nhóm cơ thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: MuscleGroup[]) => {
    const deletePromise = () => deleteBulkMuscleGroup(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá nhóm cơ thành công'
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
                text={`Chọn ${Object.keys(rowSelection).length} nhóm cơ`}
                onClick={() => {
                  if (rowSelection.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một nhóm cơ')
                    return
                  }
                  onConfirmRowSelection(rowSelection)
                }}
              />
            )}
            <AddButton text="Thêm nhóm cơ" onClick={onAddRow} />
          </>
        }
      />
      <EditSheet
        title={isEdit ? 'Chỉnh sửa nhóm cơ' : 'Thêm nhóm cơ'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditMuscleGroupForm data={selectedRow} onSuccess={onEditSuccess} />
      </EditSheet>
    </>
  )
}
