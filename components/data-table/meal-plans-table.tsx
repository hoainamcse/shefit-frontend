'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { MealPlan } from '@/models/meal-plan'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Check, Edit, X } from 'lucide-react'
import { useMemo, useState, useCallback } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  deleteBulkMealPlan,
  deleteMealPlan,
  duplicateMealPlan,
  getMealPlans,
  queryKeyMealPlans,
  updateMealPlanDisplayOrder,
} from '@/network/client/meal-plans'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { AddButton } from '../buttons/add-button'
import { MainButton } from '../buttons/main-button'

interface MealPlansTableProps {
  onConfirmRowSelection?: (selectedRows: MealPlan[]) => void
}

interface EditingState {
  [key: string]: {
    isEditing: boolean
    value: number
    originalValue: number
  }
}

export function MealPlansTable({ onConfirmRowSelection }: MealPlansTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<MealPlan[]>([])
  const [editingState, setEditingState] = useState<EditingState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyMealPlans, pagination],
    queryFn: () =>
      getMealPlans({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        sort_by: 'display_order',
        sort_order: 'asc',
      }),
    placeholderData: keepPreviousData,
  })

  const handleEditDisplayOrder = useCallback((mealPlanId: string, currentValue: number) => {
    setEditingState((prev) => ({
      ...prev,
      [mealPlanId]: {
        isEditing: true,
        value: currentValue || 0,
        originalValue: currentValue,
      },
    }))
  }, [])

  const handleCancelEdit = useCallback((mealPlanId: string) => {
    setEditingState((prev) => {
      const newState = { ...prev }
      delete newState[mealPlanId]
      return newState
    })
  }, [])

  const handleSaveDisplayOrder = useCallback(
    async (mealPlanId: string) => {
      const editState = editingState[mealPlanId]
      if (!editState) return

      const newValue = editState.value
      if (isNaN(newValue) || newValue < 0) {
        toast.error('Vui lòng nhập số hợp lệ (≥ 0)')
        return
      }

      try {
        await updateMealPlanDisplayOrder(Number(mealPlanId), newValue)

        setEditingState((prev) => {
          const newState = { ...prev }
          delete newState[mealPlanId]
          return newState
        })

        refetch()
        toast.success('Cập nhật STT thành công')
      } catch (error) {
        toast.error('Đã có lỗi xảy ra khi cập nhật')
      }
    },
    [editingState, refetch]
  )

  const handleInputChange = useCallback((mealPlanId: string, value: number) => {
    setEditingState((prev) => ({
      ...prev,
      [mealPlanId]: {
        ...prev[mealPlanId],
        value,
      },
    }))
  }, [])

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
      },
      {
        header: 'STT',
        accessorKey: 'display_order',
        cell: ({ row }) => {
          const mealPlan = row.original
          const editState = editingState[mealPlan.id]
          const displayOrder = row.getValue('display_order') as number

          if (editState?.isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={editState.value}
                  onChange={(e) => handleInputChange(mealPlan.id.toString(), Number(e.target.value))}
                  className="w-20 h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  onClick={() => handleSaveDisplayOrder(mealPlan.id.toString())}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  onClick={() => handleCancelEdit(mealPlan.id.toString())}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          }

          return (
            <div className="flex items-center px-3 gap-3 group">
              <span className="font-medium">{displayOrder || 0}</span>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditDisplayOrder(mealPlan.id.toString(), displayOrder)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )
        },
        size: 140,
      },
      {
        header: 'Tên thực đơn',
        accessorKey: 'title',
        cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
        size: 180,
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
        accessorFn: (originalRow) => originalRow.assets.thumbnail,
        cell: ({ row }) => (
          <div>
            <img
              src={row.original.assets.thumbnail}
              alt={`${row.getValue('title')} thumbnail`}
              className="h-16 w-28 rounded-md object-cover"
            />
          </div>
        ),
        size: 180,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} onDuplicate={onDuplicateRow} />
        ),
        size: 60,
      },
    ],
    [handleEditDisplayOrder, handleCancelEdit, handleSaveDisplayOrder, handleInputChange, editingState]
  )

  const router = useRouter()

  const onAddRow = () => {
    router.push('/admin/meal-plans/new')
  }

  const onEditRow = (row: MealPlan) => {
    router.push(`/admin/meal-plans/${row.id}`)
  }

  const onDuplicateRow = (row: MealPlan) => {
    const duplicatePromise = () => duplicateMealPlan(row.id)

    toast.promise(duplicatePromise, {
      loading: 'Đang nhân bản...',
      success: (_) => {
        refetch()
        return 'Nhân bản thực đơn thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
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

  const onDeleteRows = async (selectedRows: MealPlan[]) => {
    const deletePromise = () => deleteBulkMealPlan(selectedRows.map((row) => row.id))

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
              text={`Chọn ${rowSelection.length} thực đơn`}
              onClick={() => {
                if (rowSelection.length === 0) {
                  toast.error('Vui lòng chọn ít nhất một thực đơn')
                  return
                }
                onConfirmRowSelection(rowSelection)
              }}
            />
          )}
          <AddButton text="Thêm thực đơn" onClick={onAddRow} />
        </>
      }
    />
  )
}
