'use client'

import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table'
import type { MealPlan } from '@/models/meal-plan'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteMealPlan, getMealPlans, queryKeyMealPlans } from '@/network/client/meal-plans'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { AddButton } from '../buttons/add-button'
import { MainButton } from '../buttons/main-button'
import { getYoutubeThumbnail } from '@/lib/youtube'

interface MealPlansTableProps {
  onConfirmRowSelection?: (selectedRows: MealPlan[]) => void
}

export function MealPlansTable({ onConfirmRowSelection }: MealPlansTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyMealPlans, pagination],
    queryFn: () => getMealPlans({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<MealPlan>[]>(
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
        header: 'Tên thực đơn',
        accessorKey: 'title',
        cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Tóm tắt',
        accessorKey: 'subtitle',
        size: 180,
      },
      {
        header: 'Chế độ ăn',
        accessorFn: (originalRow) => originalRow.diet?.name,
        size: 180,
      },
      {
        header: 'Calorie',
        accessorFn: (originalRow) => originalRow.calorie?.name,
        size: 180,
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'image',
        cell: ({ row }) => {
          const image = row.getValue('image')
          if (typeof image !== 'string') return null
          const isYoutube = image.includes('youtube.com') || image.includes('youtu.be')
          const imgSrc = isYoutube ? getYoutubeThumbnail(image) : image
          return (
            <div>
              <img
                src={imgSrc}
                alt={`${row.getValue('title')} thumbnail`}
                className="h-16 w-28 rounded-md object-cover"
              />
            </div>
          )
        },
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

  const router = useRouter()

  const onAddRow = () => {
    router.push('/admin/meal-plans/create')
  }

  const onEditRow = (row: MealPlan) => {
    router.push(`/admin/meal-plans/${row.id}`)
  }

  const onDeleteRow = async (row: MealPlan) => {
    const deletePromise = () => deleteMealPlan(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá thực đơn thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
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

  return (
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
              text={`Chọn ${Object.keys(rowSelection).length} thực đơn`}
              onClick={() => {
                const selectedRows = Object.keys(rowSelection).map((key) => data?.data?.[Number(key)])
                if (selectedRows.length === 0) {
                  toast.error('Vui lòng chọn ít nhất một thực đơn')
                  return
                }
                onConfirmRowSelection(selectedRows.filter((row): row is MealPlan => !!row))
              }}
            />
          )}
          <AddButton text="Thêm thực đơn" onClick={onAddRow} />
        </>
      }
    />
  )
}
