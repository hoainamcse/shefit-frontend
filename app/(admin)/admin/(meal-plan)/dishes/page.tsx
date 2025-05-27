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
import { Diet } from '@/models/diets'
import { Dish } from '@/models/dish'
import { deleteDish } from '@/network/server/dish'
import { getDiets } from '@/network/server/diets'
import { getListDishes } from '@/network/server/dish'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [dietList, setDietList] = useState<Diet[]>([])

  const router = useRouter()
  const dietIdToName = useMemo(() => Object.fromEntries(dietList.map((diet) => [diet.id, diet.name])), [dietList])
  const columns: ColumnDef<Dish>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'diet_id',
      header: 'Chế độ ăn',
      render: ({ row }) => (
        <span className="block min-w-[120px] text-gray-900">{dietIdToName[row.diet_id] || '-'}</span>
      ),
    },
    {
      accessorKey: 'image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image} alt={`${row.name} thumbnail`} className="h-24 w-24 rounded-lg object-cover " />
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
              <Copy /> Sao chép món ăn ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(`/admin/dishes/${row.id}`)
              }}
            >
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DeleteMenuItem onConfirm={() => handleDelete(row.id)} />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  const headerExtraContent = (
    <>
      <AddButton text="Thêm món ăn" onClick={() => router.push('/admin/dishes/create')} />
      <MainButton text="Nhập món ăn" variant="outline" icon={Import} />
    </>
  )

  const handleDelete = async (dishId: number) => {
    try {
      const res = await deleteDish([dishId])
      if (res.status === 'success') {
        toast.success('Xoá món ăn thành công')
        setDishes((dishes) => dishes.filter((d) => d.id !== dishId))
      } else {
        toast.error('Xoá món ăn thất bại')
      }
    } catch (e) {
      toast.error('Có lỗi khi xoá món ăn')
    }
  }

  useEffect(() => {
    const fetchDishes = async () => {
      const response = await getListDishes()
      const dietResponse = await getDiets()
      setDietList(dietResponse.data || [])
      setDishes(response.data || [])
    }
    fetchDishes()
  }, [])

  return (
    <ContentLayout title="Thư viện món ăn">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={dishes}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
