'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Notification } from '@/models/notification'

import { toast } from 'sonner'
import { useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  // deleteBulkNotification,
  deleteNotification,
  getNotifications,
  queryKeyNotifications,
  updateNotification
} from '@/network/client/notifications'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { Switch } from '../ui/switch'
import { AddButton } from '../buttons/add-button'

export function NotificationsTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyNotifications, { ...pagination, notified: false }],
    queryFn: () => getNotifications({ notified: false, page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const handleTogglePinned = useCallback(
    async (pinned: boolean, notification: Notification) => {
      try {
        await updateNotification(notification.id, {
          title: notification.title,
          content: notification.content,
          notify_date: notification.notify_date,
          pinned
        })
        toast.success('Đã cập nhật trạng thái ghim')
        refetch()
      } catch (error: any) {
        console.error(error)
        toast.error('Lỗi khi cập nhật trạng thái ghim')
      }
    },
    [refetch]
  )

  const columns = useMemo<ColumnDef<Notification>[]>(
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
        header: 'Tiêu đề',
        accessorKey: 'title',
        cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
        size: 200,
        enableHiding: false,
      },
      {
        header: 'Nội dung',
        accessorKey: 'content',
        cell: ({ row }) => <div className="max-w-md truncate">{row.getValue('content')}</div>,
        size: 300,
        enableSorting: false,
      },
      {
        header: 'Ngày thông báo',
        accessorKey: 'notify_date',
        cell: ({ row }) => <div>{new Date(row.getValue('notify_date')).toLocaleDateString('vi-VN')}</div>,
        size: 150,
      },
      {
        header: 'Ghim',
        accessorKey: 'pinned',
        cell: ({ row }) => (
          <Switch
            className="transform scale-75"
            checked={row.getValue('pinned')}
            onCheckedChange={(checked) => handleTogglePinned(checked, row.original)}
          />
        ),
        size: 100,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
        enableHiding: false,
      },
    ],
    [handleTogglePinned]
  )

  const router = useRouter()

  const onAddRow = () => {
    router.push('/admin/notifications/new')
  }

  const onEditRow = (row: Notification) => {
    router.push(`/admin/notifications/${row.id}`)
  }

  const onDeleteRow = async (row: Notification) => {
    const deletePromise = () => deleteNotification(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá thông báo thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Notification[]) => {
    toast.warning('Tinh năng đang phát triển')
    return

    // const deletePromise = () => deleteBulkNotification(selectedRows.map((row) => row.id))

    // toast.promise(deletePromise, {
    //   loading: 'Đang xoá...',
    //   success: (_) => {
    //     refetch()
    //     return 'Xoá thông báo thành công'
    //   },
    //   error: 'Đã có lỗi xảy ra',
    // })
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
      rightSection={<AddButton text="Thêm thông báo" onClick={onAddRow} />}
    />
  )
}
