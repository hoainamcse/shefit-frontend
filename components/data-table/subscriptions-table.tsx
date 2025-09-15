'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Subscription } from '@/models/subscription'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Check, Edit, X } from 'lucide-react'
import { useMemo, useState, useCallback } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  deleteBulkSubscription,
  deleteSubscription,
  duplicateSubscription,
  getSubAdminSubscriptions,
  getSubscriptions,
  queryKeySubscriptions,
  updateSubscriptionDisplayOrder,
} from '@/network/client/subscriptions'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { useSession } from '@/hooks/use-session'
import { Spinner } from '@/components/spinner'

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AddButton } from '../buttons/add-button'
import { MainButton } from '../buttons/main-button'

interface SubscriptionsTableProps {
  onConfirmRowSelection?: (selectedRows: Subscription[]) => void
}

interface EditingState {
  [key: string]: {
    isEditing: boolean
    value: number
    originalValue: number
  }
}

export function SubscriptionsTable({ onConfirmRowSelection }: SubscriptionsTableProps) {
  const { session, isLoading: isPending } = useSession()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<Subscription[]>([])
  const [editingState, setEditingState] = useState<EditingState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeySubscriptions, pagination],
    queryFn: () =>
      session?.role === 'sub_admin'
        ? getSubAdminSubscriptions({
            page: pagination.pageIndex,
            per_page: pagination.pageSize,
            sort_by: 'display_order',
            sort_order: 'asc',
          })
        : getSubscriptions({
            page: pagination.pageIndex,
            per_page: pagination.pageSize,
            sort_by: 'display_order',
            sort_order: 'asc',
          }),
    placeholderData: keepPreviousData,
    enabled: !!session,
  })

  const handleEditDisplayOrder = useCallback((subscriptionId: string, currentValue: number) => {
    setEditingState((prev) => ({
      ...prev,
      [subscriptionId]: {
        isEditing: true,
        value: currentValue || 0,
        originalValue: currentValue,
      },
    }))
  }, [])

  const handleCancelEdit = useCallback((subscriptionId: string) => {
    setEditingState((prev) => {
      const newState = { ...prev }
      delete newState[subscriptionId]
      return newState
    })
  }, [])

  const handleSaveDisplayOrder = useCallback(
    async (subscriptionId: Subscription['id']) => {
      const editState = editingState[subscriptionId]
      if (!editState) return

      const newValue = editState.value
      if (isNaN(newValue) || newValue < 0) {
        toast.error('Vui lòng nhập số hợp lệ (≥ 0)')
        return
      }

      try {
        await updateSubscriptionDisplayOrder(subscriptionId, newValue)

        setEditingState((prev) => {
          const newState = { ...prev }
          delete newState[subscriptionId]
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

  const handleInputChange = useCallback((subscriptionId: string, value: number) => {
    setEditingState((prev) => ({
      ...prev,
      [subscriptionId]: {
        ...prev[subscriptionId],
        value,
      },
    }))
  }, [])

  const columns = useMemo<ColumnDef<Subscription>[]>(
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
          const subscription = row.original
          const editState = editingState[subscription.id]
          const displayOrder = row.getValue('display_order') as number

          if (editState?.isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={editState.value}
                  onChange={(e) => handleInputChange(subscription.id.toString(), Number(e.target.value))}
                  className="w-20 h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  onClick={() => handleSaveDisplayOrder(subscription.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  onClick={() => handleCancelEdit(subscription.id.toString())}
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
                onClick={() => handleEditDisplayOrder(subscription.id.toString(), displayOrder)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )
        },
        size: 140,
      },
      {
        header: 'Tên gói tập',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
      },
      {
        header: 'Loại khoá tập',
        accessorKey: 'course_format',
        cell: ({ row }) => getCourseFormatLabel(row.getValue('course_format')),
        size: 180,
      },
      {
        header: 'Hình ảnh',
        accessorFn: (originalRow) => originalRow.assets.thumbnail,
        cell: ({ row }) => (
          <div>
            <img
              src={row.original.assets.thumbnail}
              alt={`${row.getValue('name')} thumbnail`}
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
    router.push('/admin/subscriptions/create')
  }

  const onEditRow = (row: Subscription) => {
    router.push(`/admin/subscriptions/${row.id}`)
  }

  const onDuplicateRow = (row: Subscription) => {
    const duplicatePromise = () => duplicateSubscription(row.id)

    toast.promise(duplicatePromise, {
      loading: 'Đang nhân bản...',
      success: (_) => {
        refetch()
        return 'Nhân bản gói tập thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRow = async (row: Subscription) => {
    const deletePromise = () => deleteSubscription(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá gói tập thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Subscription[]) => {
    const deletePromise = () => deleteBulkSubscription(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá gói tập thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">{error?.message}</p>
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
              text={`Chọn ${rowSelection.length} gói tập`}
              onClick={() => {
                if (rowSelection.length === 0) {
                  toast.error('Vui lòng chọn ít nhất một gói tập`}')
                  return
                }
                onConfirmRowSelection(rowSelection)
              }}
            />
          )}
          <AddButton text="Thêm gói tập" onClick={onAddRow} />
        </>
      }
    />
  )
}

function getCourseFormatLabel(format: string) {
  switch (format) {
    case 'video':
      return 'Video'
    case 'live':
      return 'Zoom'
    case 'both':
      return 'Video & Zoom'
    default:
      return format
  }
}
