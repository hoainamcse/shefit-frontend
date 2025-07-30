'use client'

import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table'
import type { Subscription } from '@/models/subscription'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Spinner } from '@/components/spinner'

import { AddButton } from '../buttons/add-button'
import { useSession } from '@/hooks/use-session'
import { MainButton } from '../buttons/main-button'
import { Button } from '../ui/button'
import { Check, Edit, X } from 'lucide-react'
import { Input } from '../ui/input'

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
  const { session } = useSession()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [editingState, setEditingState] = useState<EditingState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeySubscriptions, pagination],
    queryFn: () =>
      session
        ? session.role === 'sub_admin'
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
            })
        : Promise.resolve(null),
    placeholderData: keepPreviousData,
    enabled: !!session,
  })

  const handleEditDisplayOrder = (subscriptionId: string, currentValue: number) => {
    console.log('subscriptionId', subscriptionId)

    setEditingState((prev) => ({
      ...prev,
      [subscriptionId]: {
        isEditing: true,
        value: currentValue || 0,
        originalValue: currentValue,
      },
    }))
  }

  const handleCancelEdit = (subscriptionId: string) => {
    setEditingState((prev) => {
      const newState = { ...prev }
      delete newState[subscriptionId]
      return newState
    })
  }

  const handleSaveDisplayOrder = async (subscriptionId: string) => {
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
  }

  const handleInputChange = (subscriptionId: string, value: number) => {
    setEditingState((prev) => ({
      ...prev,
      [subscriptionId]: {
        ...prev[subscriptionId],
        value,
      },
    }))
  }

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
        enableSorting: false,
        enableHiding: false,
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
                  onClick={() => handleSaveDisplayOrder(subscription.id.toString())}
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
        enableHiding: false,
      },
      {
        header: 'Loại khoá tập',
        accessorKey: 'course_format',
        cell: ({ row }) => getCourseFormatLabel(row.getValue('course_format')),
        size: 180,
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'cover_image',
        cell: ({ row }) => (
          <div>
            <img
              src={row.getValue('cover_image')}
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
        cell: ({ row }) => (
          <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} onDuplicate={onDuplicateRow} />
        ),
        size: 60,
        enableHiding: false,
      },
    ],
    [editingState]
  )

  const router = useRouter()

  const onAddRow = () => {
    router.push('/admin/membership/create')
  }

  const onEditRow = (row: Subscription) => {
    router.push(`/admin/membership/${row.id}`)
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
                text={`Chọn ${Object.keys(rowSelection).length} gói tập`}
                onClick={() => {
                  const selectedRows = Object.keys(rowSelection).map((key) => data?.data?.[Number(key)])
                  if (selectedRows.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một gói tập`}')
                    return
                  }
                  onConfirmRowSelection(selectedRows.filter((row): row is Subscription => !!row))
                }}
              />
            )}
            <AddButton text="Thêm gói tập" onClick={onAddRow} />
          </>
        }
      />
    </>
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
