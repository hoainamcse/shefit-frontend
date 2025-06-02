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
import { deleteSubscription, getSubscriptions } from '@/network/server/subscriptions-admin'
import { Subscription } from '@/models/subscription-admin'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'
import { DeleteButton } from '@/components/buttons/delete-button'
import { useClipboard } from '@/hooks/use-clipboard'
import { useAuth } from '@/components/providers/auth-context'
import { getSubAdminSubscriptions } from '@/network/server/sub-admin'

// Helper to map course_format to label
const getCourseFormatLabel = (format: string): string => {
  if (format === 'live') return 'Zoom'
  if (format === 'video') return 'Video'
  if (format === 'both') return 'Zoom & Video'
  return format
}

interface MembershipRow {
  id: number
  name: string
  course_format: string
  cover_image: string
}

export default function MembershipPage() {
  const { role, accessToken } = useAuth()
  const { copy } = useClipboard()
  const router = useRouter()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [membershipTable, setMembershipTable] = useState<MembershipRow[]>([])
  const [openCouponModal, setOpenCouponModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon>()

  const fetchCoupons = async () => {
    const response = await getListCoupons()
    const subscriptionCoupons = (response.data || []).filter((coupon) => coupon.coupon_type === 'subscription')
    setCoupons(subscriptionCoupons)
  }

  const fetchMemberships = async () => {
    let response
    if (role === 'sub_admin' && accessToken) {
      response = await getSubAdminSubscriptions(accessToken)
    } else {
      response = await getSubscriptions()
    }
    const mapped = (response.data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      course_format: getCourseFormatLabel(item.course_format),
      cover_image: item.cover_image,
    }))
    setMembershipTable(mapped)
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

  const handleDeleteMembership = async (membershipId: number) => {
    try {
      if (!accessToken) return
      const res = await deleteSubscription(membershipId, accessToken)
      if (res.status === 'success') {
        toast.success('Xoá gói thành viên thành công')
        fetchMemberships()
      }
    } catch (e) {
      toast.error('Có lỗi khi xoá gói thành viên')
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

  const membershipHeaderExtraContent = (
    <AddButton text="Thêm gói thành viên" onClick={() => router.push('/admin/membership/create')} />
  )

  const columns: ColumnDef<MembershipRow>[] = [
    {
      accessorKey: 'name',
      header: 'Tên gói',
    },
    {
      accessorKey: 'course_format',
      header: 'Loại hình',
    },
    {
      accessorKey: 'cover_image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return (
          <img src={row.cover_image} alt={`${row.name} cover image`} className="h-16 w-16 rounded-lg object-cover " />
        )
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
            <DropdownMenuItem onClick={() => copy(row.id)}>
              <Copy /> Sao chép gói tập ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push(`/admin/membership/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DeleteMenuItem onConfirm={() => handleDeleteMembership(row.id)} />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  useEffect(() => {
    fetchCoupons()
    fetchMemberships()
  }, [])

  return (
    <ContentLayout title="Quản lý gói thành viên">
      {/* Memberships section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách gói thành viên</h2>
        <DataTable
          headerExtraContent={role === 'admin' ? membershipHeaderExtraContent : null}
          searchPlaceholder="Tìm kiếm theo tên, ..."
          data={membershipTable}
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
