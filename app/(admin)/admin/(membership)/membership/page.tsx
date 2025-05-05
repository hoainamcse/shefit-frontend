'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreateCouponForm } from '@/components/forms/create-coupon-form'
import { Coupon } from '@/models/coupon'
import { useEffect, useState } from 'react'
import { deleteCoupon, getListCoupons } from '@/network/server/coupon'
import { toast } from 'sonner'

type Membership = {
  id: string
  name: string
  type: string
  image: string
}

const memberships: Membership[] = [
  {
    id: '1',
    name: 'Gói Cơ Bản',
    type: 'Video',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Gói Nâng Cao',
    type: 'Zoom',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2064&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Gói Premium',
    type: 'Video & Zoom',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Gói Tập',
    type: 'Zoom',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Gói Toàn Diện',
    type: 'Video & Zoom',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop',
  },
]

export default function MembershipPage() {
  const router = useRouter()
  const [coupons, setCoupons] = useState<Coupon[]>([])

  const fetchCoupons = async () => {
    const response = await getListCoupons()
    setCoupons(response.data || [])
  }

  const handleDeleteCoupon = async (couponId: number) => {
    if (window.confirm('Bạn có chắc muốn xoá khuyến mãi này?')) {
      try {
        const res = await deleteCoupon(couponId.toString())
        if (res.status === 'success') {
          toast.success('Xoá khuyến mãi thành công')
          setCoupons((coupons) => coupons.filter((c) => c.id !== couponId))
        }
      } catch (e) {
        toast.error('Có lỗi khi xoá khuyến mãi')
      }
    }
  }

  // Coupon columns
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
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => handleDeleteCoupon(row.id)}
        >
          <Trash2 />
        </Button>
      ),
    },
  ]

  const couponHeaderExtraContent = (
    <CreateCouponDialog updateData={fetchCoupons}>
      <AddButton text="Thêm khuyến mãi" />
    </CreateCouponDialog>
  )

  const membershipHeaderExtraContent = (
    <AddButton text="Thêm gói thành viên" onClick={() => router.push('/admin/membership/create')} />
  )

  const columns: ColumnDef<Membership>[] = [
    {
      accessorKey: 'name',
      header: 'Tên gói',
    },
    {
      accessorKey: 'type',
      header: 'Loại hình',
    },
    {
      accessorKey: 'image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image} alt={`${row.name} thumbnail`} className=" h-12 rounded" />
      },
    },
    {
      accessorKey: 'actions',
      render: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem>
              <Copy /> Sao chép ID gói
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push(`/admin/membership/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  useEffect(() => {
    fetchCoupons()
  }, [])

  return (
    <ContentLayout title="Quản lý gói thành viên">
      {/* Memberships section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách gói thành viên</h2>
        <DataTable
          headerExtraContent={membershipHeaderExtraContent}
          searchPlaceholder="Tìm kiếm theo tên, ..."
          data={memberships}
          columns={columns}
          onSelectChange={() => {}}
        />
      </div>

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

function CreateCouponDialog({ children, updateData }: { children: React.ReactNode; updateData?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm khuyến mãi</DialogTitle>
        </DialogHeader>
        <CreateCouponForm
          onSuccess={() => {
            setOpen(false)
            updateData?.() // Call onSuccess after closing
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
