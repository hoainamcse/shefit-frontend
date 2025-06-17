'use client'

import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table'
import type { Product } from '@/models/product'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteProduct, getProducts, queryKeyProducts } from '@/network/client/products'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { AddButton } from '../buttons/add-button'
import { useRouter } from 'next/navigation'
import { MainButton } from '../buttons/main-button'

interface ProductsTableProps {
  onConfirmRowSelection?: (selectedRows: Product[]) => void
}

export function ProductsTable({ onConfirmRowSelection }: ProductsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyProducts, pagination],
    queryFn: () => getProducts({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Product>[]>(
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
        header: 'Tên sản phẩm',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Mô tả',
        accessorKey: 'description',
        size: 180,
      },
      {
        header: 'Giá',
        accessorKey: 'price',
        cell: ({ row }) => (
          <span>{row.original.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        ),
        size: 180,
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'image_urls',
        cell: ({ row }) => (
          <div>
            <img
              src={row.original.image_urls[0] || ''}
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
    router.push('/admin/products/create')
  }

  const onEditRow = (row: Product) => {
    router.push(`/admin/products/${row.id}`)
  }

  const onDeleteRow = async (row: Product) => {
    const deletePromise = () => deleteProduct(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá sản phẩm thành công'
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
              text={`Chọn ${Object.keys(rowSelection).length} sản phẩm`}
              onClick={() => {
                const selectedRows = Object.keys(rowSelection).map((key) => data?.data?.[Number(key)])
                if (selectedRows.length === 0) {
                  toast.error('Vui lòng chọn ít nhất một sản phẩm')
                  return
                }
                onConfirmRowSelection(selectedRows.filter((row): row is Product => !!row))
              }}
            />
          )}
          <AddButton text="Thêm sản phẩm" onClick={onAddRow} />
        </>
      }
    />
  )
}
