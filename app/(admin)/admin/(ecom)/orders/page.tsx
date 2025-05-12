'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, Edit, Ellipsis, Eye, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  name: string
  phone: string
  username: string | null
  is_registered: boolean
  created_at: string
}

const orders: Order[] = [
  {
    id: '1',
    name: 'Nguyen Van A',
    phone: '0123456789',
    username: 'nguyenvanA',
    is_registered: true,
    created_at: '2025-01-01 12:00:00',
  },
  {
    id: '2',
    name: 'Nguyen Van B',
    phone: '0123456789',
    username: null,
    is_registered: false,
    created_at: '2025-01-01 12:00:00',
  },
  {
    id: '3',
    name: 'Nguyen Van C',
    phone: '0123456789',
    username: 'nguyenvanC',
    is_registered: true,
    created_at: '2025-01-01 12:00:00',
  },
  {
    id: '4',
    name: 'Nguyen Van D',
    phone: '0123456789',
    username: null,
    is_registered: false,
    created_at: '2025-01-01 12:00:00',
  },
  {
    id: '5',
    name: 'Nguyen Van E',
    phone: '0123456789',
    username: 'nguyenvanE',
    is_registered: true,
    created_at: '2025-01-01 12:00:00',
  },
]

export default function OrdersPage() {
  const router = useRouter()
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'phone',
      header: 'SĐT',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'is_registered',
      header: 'Tình trạng',
      render: ({ row }) => <Badge variant="outline">{row.is_registered ? 'Đăng ký' : 'Chưa đăng ký'}</Badge>,
    },
    {
      accessorKey: 'created_at',
      header: 'Thời gian đặt',
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
              <Copy /> Sao chép đơn hàng ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/admin/orders/${row.id}`)}>
              <Eye /> Xem
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <ContentLayout title="Đơn hàng">
      <DataTable searchPlaceholder="Tìm kiếm theo tên, ..." data={orders} columns={columns} onSelectChange={() => {}} />
    </ContentLayout>
  )
}
