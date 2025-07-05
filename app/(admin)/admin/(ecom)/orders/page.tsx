'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Cart } from '@/models/cart'
import { deleteCart, editCart, getCarts } from '@/network/client/carts'
import { CheckCircle2, ChevronDown, Clock, Copy, CreditCard, Edit, Ellipsis, Eye, Trash2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function OrdersPage() {
  const [orderTable, setOrderTable] = useState<Cart[]>([])

  const fetchOrders = async () => {
    const response = await getCarts()
    const mapped = (response.data || []).map((item: any) => {
      const date = new Date(item.created_at)
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`
      return {
        ...item,
        created_at: formattedDate,
      }
    })
    setOrderTable(mapped)
  }

  const deleteOrder = async (orderId: number) => {
    try {
      const response = await deleteCart(orderId)
      if (response.status === 'success') {
        toast.success('Order deleted successfully')
        fetchOrders()
      }
    } catch (error) {
      toast.error('Failed to delete order')
    }
  }

  const router = useRouter()
  const columns: ColumnDef<Cart>[] = [
    {
      accessorKey: 'user_name',
      header: 'Tên',
    },
    {
      accessorKey: 'telephone_number',
      header: 'SĐT',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'is_signed_up',
      header: 'Tình trạng đăng ký',
      render: ({ row }) => {
        return row.is_signed_up ? (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
            Đã đăng ký
          </Badge>
        ) : (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
            Chưa đăng ký
          </Badge>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Tình trạng đơn hàng',
      render: ({ row }) => {
        const status = row.status
        const orderId = row.id
        const statusOptions = [
          { value: 'pending', label: 'PENDING', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
          { value: 'paid', label: 'PAID', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          {
            value: 'delivered',
            label: 'DELIVERED',
            icon: CheckCircle2,
            color: 'text-green-600 bg-green-50 border-green-200',
          },
          { value: 'cancelled', label: 'CANCELLED', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
        ]

        const currentStatus = statusOptions.find((opt) => opt.value === status)

        const handleStatusChange = async (value: string) => {
          const prevStatus = row.status
          setOrderTable((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: value } : order)))

          try {
            const { product_variants, ...restRow } = row
            const transformedRow = {
              ...restRow,
              status: value,
              product_variant_ids: product_variants?.map((variant) => variant.id) || [],
            }

            const response = await editCart(orderId, transformedRow)
            if (response.status === 'success') {
              toast.success('Order status updated successfully')
              fetchOrders()
            }
          } catch (error) {
            setOrderTable((prev) =>
              prev.map((order) => (order.id === orderId ? { ...order, status: prevStatus } : order))
            )
            toast.error('Failed to update order status')
          }
        }

        return (
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className={`w-[180px] ${currentStatus?.color}`}>
              <SelectValue placeholder="Thay đổi trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className={opt.color}>
                  <div className="flex items-center gap-2">
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      },
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
            <DeleteMenuItem onConfirm={() => deleteOrder(row.id)} />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <ContentLayout title="Đơn hàng">
      <DataTable
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={orderTable}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
