'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Blog } from '@/models/blog'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteBlog, deleteBulkBlog, getBlogs, queryKeyBlogs } from '@/network/client/blogs'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { AddButton } from '../buttons/add-button'

export function BlogsTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyBlogs, pagination],
    queryFn: () => getBlogs({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Blog>[]>(
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
        header: 'Tên bài viết',
        accessorKey: 'title',
        cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Hình ảnh đại diện',
        accessorKey: 'thumbnail_image',
        cell: ({ row }) => (
          <div>
            <img
              src={row.getValue('thumbnail_image')}
              alt={`${row.getValue('title')} thumbnail`}
              className="h-16 w-28 rounded-md object-cover"
            />
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
      {
        header: 'Hình ảnh bìa',
        accessorKey: 'cover_image',
        cell: ({ row }) => (
          <div>
            <img
              src={row.getValue('cover_image')}
              alt={`${row.getValue('title')} thumbnail`}
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
    router.push('/admin/blogs/create')
  }

  const onEditRow = (row: Blog) => {
    router.push(`/admin/blogs/${row.id}`)
  }

  const onDeleteRow = async (row: Blog) => {
    const deletePromise = () => deleteBlog(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá bài viết thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Blog[]) => {
    const deletePromise = () => deleteBulkBlog(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá bài viết thành công'
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
      rightSection={<AddButton text="Thêm bài viết" onClick={onAddRow} />}
    />
  )
}
