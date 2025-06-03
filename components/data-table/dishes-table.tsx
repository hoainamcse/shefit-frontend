'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteDish, getDishes, queryKeyDishes } from '@/network/client/dishes'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { Dish } from '@/models/dish'

import { EditDishForm } from '../forms/edit-dish-form'
import { AddButton } from '../buttons/add-button'
import { EditSheet } from './edit-sheet'

export function DishesTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyDishes, pagination],
    queryFn: () => getDishes({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Dish>[]>(
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
        header: 'Tên món ăn',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Chế độ ăn',
        accessorKey: 'diet.name',
        size: 180,
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
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
        enableHiding: false,
      },
    ],
    []
  )

  const [selectedRow, setSelectedRow] = useState<Dish | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Dish) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Dish) => {
    const deletePromise = () => deleteDish(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá món ăn thành công'
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
        onPaginationChange={setPagination}
        rightSection={<AddButton text="Thêm món ăn" onClick={onAddRow} />}
      />
      <EditSheet
        title={isEdit ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditDishForm data={selectedRow} onSuccess={onEditSuccess} />
      </EditSheet>
    </>
  )
}
