'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreateCouponForm } from '@/components/forms/create-coupon-form'
import { Coupon } from '@/models/coupon'
import { useEffect, useState } from 'react'
import { deleteCoupon, getCoupons } from '@/network/client/coupons'
import { toast } from 'sonner'
import { DeleteButton } from '@/components/buttons/delete-button'
import { useClipboard } from '@/hooks/use-clipboard'
import { SubscriptionsTable } from '@/components/data-table/subscriptions-table'

export default function SubscriptionsPage() {
  const { copy, copied } = useClipboard()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [openCouponModal, setOpenCouponModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon>()

  const fetchCoupons = async () => {
    const response = await getCoupons()
    const subscriptionCoupons = (response.data || []).filter((coupon) => coupon.coupon_type === 'subscription')
    setCoupons(subscriptionCoupons)
  }

  const handleDeleteCoupon = async (couponId: number) => {
    try {
      const res = await deleteCoupon(couponId.toString())
      if (res.status === 'success') {
        toast.success('Xoá khuyến mãi thành công')
        fetchCoupons()
      }
    } catch (e) {
      toast.error('Có lỗi khi xoá khuyến mãi')
    }
  }

  // Coupon columns
  const handleOpenEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setOpenCouponModal(true)
  }

  const couponColumns: ColumnDef<Coupon>[] = [
    {
      accessorKey: 'code',
      header: 'Mã khuyến mãi',
    },
    {
      accessorKey: 'discount_value',
      header: 'Giá trị',
      render: ({ row }) => {
        return row.discount_type === 'percentage' ? `${row.discount_value}%` : `${row.discount_value.toLocaleString()}đ`
      },
    },
    {
      accessorKey: 'actions',
      header: 'Thao tác',
      render: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-green-600 hover:text-green-800"
            onClick={() => handleOpenEditCoupon(row)}
          >
            <Edit />
          </Button>
          <DeleteButton
            size="icon"
            variant="ghost"
            onConfirm={() => handleDeleteCoupon(row.id)}
            className="text-destructive hover:text-destructive"
            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
          />
        </div>
      ),
    },
  ]

  const couponHeaderExtraContent = (
    <CreateCouponDialog
      open={openCouponModal}
      setOpen={setOpenCouponModal}
      updateData={fetchCoupons}
      isEdit={!!editingCoupon}
      data={editingCoupon}
      onClose={() => {
        setEditingCoupon(undefined)
        setOpenCouponModal(false)
      }}
    >
      <AddButton
        text="Thêm khuyến mãi"
        onClick={() => {
          setEditingCoupon(undefined)
          setOpenCouponModal(true)
        }}
      />
    </CreateCouponDialog>
  )

  useEffect(() => {
    fetchCoupons()
  }, [])

  useEffect(() => {
    if (copied) {
      toast.success('Đã sao chép ID vào bộ nhớ tạm')
    }
  }, [copied])

  return (
    <ContentLayout title="Quản lý gói thành viên">
      <SubscriptionsTable />

      {/* Promotions section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách khuyến mãi</h2>
        <DataTable
          data={coupons}
          columns={couponColumns}
          onSelectChange={() => {}}
          headerExtraContent={couponHeaderExtraContent}
          searchPlaceholder="Tìm kiếm theo mã, ..."
        />
      </div>
    </ContentLayout>
  )
}

interface CreateCouponDialogProps {
  children: React.ReactNode
  updateData?: () => void
  open: boolean
  setOpen: (open: boolean) => void
  isEdit: boolean
  data?: Coupon
  onClose: () => void
}

function CreateCouponDialog({ children, updateData, open, setOpen, isEdit, data, onClose }: CreateCouponDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'}</DialogTitle>
        </DialogHeader>
        <CreateCouponForm
          isEdit={isEdit}
          data={data}
          onSuccess={() => {
            setOpen(false)
            updateData?.()
            onClose()
          }}
          type="subscription"
        />
      </DialogContent>
    </Dialog>
  )
}
