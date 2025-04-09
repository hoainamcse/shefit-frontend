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
import { CreatePromotionForm } from '@/components/forms/create-promotion-form'

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

type Promotion = {
  id: string
  name: string
  type: 'percentage' | 'money'
  value: number
}

// Separate promotions data
const promotions: Promotion[] = [
  {
    id: '1',
    name: 'Khuyến mãi Giáng sinh',
    type: 'percentage',
    value: 20
  },
  {
    id: '2',
    name: 'Khuyến mãi Ngày Quốc tế Phụ nữ',
    type: 'money',
    value: 50000
  },
  {
    id: '3',
    name: 'Khuyến mãi Hè',
    type: 'percentage',
    value: 15
  },
  {
    id: '4',
    name: 'Khuyến mãi Black Friday',
    type: 'money',
    value: 100000
  },
  {
    id: '5',
    name: 'Khuyến mãi Tết',
    type: 'percentage',
    value: 25
  }
]





export default function MembershipPage() {
  const router = useRouter()

  // Promotion columns
const promotionColumns: ColumnDef<Promotion>[] = [
  {
    accessorKey: 'name',
    header: 'Tên khuyến mãi',
  },
  {
    accessorKey: 'value',
    header: 'Giá trị',
    render: ({ row }) => {
      return row.type === 'percentage' 
        ? `${row.value}%` 
        : `${row.value.toLocaleString()}đ`
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
        onClick={() => {
          // TODO: Implement delete promotion
          console.log('Delete promotion:', row.id)
        }}
      >
        <Trash2 />
      </Button>
    ),
  },
]

const membershipHeaderExtraContent = (
  <>
   
      <AddButton text="Thêm gói thành viên" onClick={() => router.push('/admin/membership/create')} />

  </>
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
              <Eye /> Xem
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/admin/membership/${row.id}/edit`)}>
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
  

  const promotionHeaderExtraContent = (
    <>
     <CreatePromotionDialog>
      <AddButton text="Thêm khuyến mãi" />
    </CreatePromotionDialog>
    </>
  )

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
          data={promotions}
          columns={promotionColumns}
          onSelectChange={() => {}}
          headerExtraContent={promotionHeaderExtraContent}
          searchPlaceholder="Tìm kiếm theo tên, ..."
        />
      </div>
    </ContentLayout>
  )
}


function CreatePromotionDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm khuyến mãi</DialogTitle>
        </DialogHeader>
        <CreatePromotionForm />
      </DialogContent>
    </Dialog>
  )
}