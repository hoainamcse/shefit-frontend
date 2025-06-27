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
  getSubAdminSubscriptions,
  getSubscriptions,
  queryKeySubscriptions,
} from '@/network/client/subscriptions'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { AddButton } from '../buttons/add-button'
import { useSession } from '../providers/session-provider'
import { MainButton } from '../buttons/main-button'

interface SubscriptionsTableProps {
  onConfirmRowSelection?: (selectedRows: Subscription[]) => void
}

export function SubscriptionsTable({ onConfirmRowSelection }: SubscriptionsTableProps) {
  const { session } = useSession()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeySubscriptions, pagination],
    queryFn: () =>
      session
        ? session.role === 'sub_admin'
          ? getSubAdminSubscriptions({ page: pagination.pageIndex, per_page: pagination.pageSize })
          : getSubscriptions({ page: pagination.pageIndex, per_page: pagination.pageSize })
        : Promise.resolve(null),
    placeholderData: keepPreviousData,
    enabled: !!session,
  })

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
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
        enableHiding: false,
      },
    ],
    []
  )

  const router = useRouter()

  const onAddRow = () => {
    router.push('/admin/membership/create')
  }

  const onEditRow = (row: Subscription) => {
    router.push(`/admin/membership/${row.id}`)
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
