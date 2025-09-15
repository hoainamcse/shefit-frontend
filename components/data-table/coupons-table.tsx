'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Coupon } from '@/models/coupon'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteBulkCoupon, deleteCoupon, getCoupons, queryKeyCoupons } from '@/network/client/coupons'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { Badge } from '@/components/ui/badge'

import { EditCouponForm } from '../forms/edit-coupon-form'
import { AddButton } from '../buttons/add-button'
import { SheetEdit } from '../dialogs/sheet-edit'

interface CouponsTableProps {
  couponType: 'subscription' | 'ecommerce'
}

export function CouponsTable({ couponType }: CouponsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyCoupons, { ...pagination, coupon_type: couponType }],
    queryFn: () => getCoupons({ page: pagination.pageIndex, per_page: pagination.pageSize, coupon_type: couponType }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Coupon>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
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
        header: 'Mã khuyến mãi',
        accessorKey: 'code',
        cell: ({ row }) => <div className="font-medium">{row.getValue('code')}</div>,
        size: 180,
      },
      {
        header: 'Loại khuyến mãi',
        accessorKey: 'discount_type',
        cell: ({ row }) => (
          <div>
            {row.getValue('discount_type') === 'percentage'
              ? 'Tỷ lệ phần trăm'
              : row.getValue('discount_type') === 'fixed_amount'
              ? 'Số tiền cố định'
              : 'Số ngày miễn phí'}
          </div>
        ),
        size: 150,
      },
      {
        header: 'Giá trị',
        accessorKey: 'discount_value',
        cell: ({ row }) => (
          <div>
            {row.getValue('discount_type') === 'percentage'
              ? `${row.getValue('discount_value')} (%)`
              : row.getValue('discount_type') === 'fixed_amount'
              ? `${(row.getValue('discount_value') as number).toLocaleString()} (đ)`
              : `${row.getValue('discount_value')} (ngày)`}
          </div>
        ),
        size: 120,
      },
      {
        header: 'Lượt đã dùng',
        accessorKey: 'usage_count',
        cell: ({ row }) => <div>{row.getValue('usage_count')}</div>,
        size: 120,
      },
      {
        header: 'Lượt dùng tối đa',
        accessorKey: 'max_usage',
        cell: ({ row }) => <div>{row.getValue('max_usage') ?? 'Unlimited'}</div>,
        size: 150,
      },
      {
        header: 'Lượt dùng tối đa mỗi người',
        accessorKey: 'max_usage_per_user',
        cell: ({ row }) => <div>{row.getValue('max_usage_per_user') ?? 'Unlimited'}</div>,
        size: 150,
      },
      ...(couponType === 'subscription'
        ? [
            {
              header: 'Gói tập áp dụng',
              accessorKey: 'subscriptions',
              cell: ({ row }: { row: any }) => (
                <div className="flex flex-wrap gap-2">
                  {row.original.subscriptions.map((c: { id: string; name: string }) => (
                    <Badge key={c.id} variant="outline">
                      {c.name}
                    </Badge>
                  ))}
                  {row.original.subscriptions.length === 0 && <span>Tất cả</span>}
                </div>
              ),
              size: 150,
            },
          ]
        : []),
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
      },
    ],
    [couponType]
  )

  const [selectedRow, setSelectedRow] = useState<Coupon | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Coupon) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Coupon) => {
    const deletePromise = () => deleteCoupon(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá khuyến mãi thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Coupon[]) => {
    const deletePromise = () => deleteBulkCoupon(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá khuyến mãi thành công'
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
        rightSection={<AddButton text="Thêm khuyến mãi" onClick={onAddRow} />}
      />
      <SheetEdit
        title={isEdit ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditCouponForm data={selectedRow} onSuccess={onEditSuccess} couponType={couponType} />
      </SheetEdit>
    </>
  )
}
