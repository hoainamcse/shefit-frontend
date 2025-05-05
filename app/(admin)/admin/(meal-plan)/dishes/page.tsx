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

// type Dish = {
//   id: string
//   name: string
//   diet: string
//   image: string
// }

// const mealPlans: Dish[] = [
//   {
//     id: '1',
//     name: 'Dishes 1',
//     diet: 'Diet 1',
//     image:
//       'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
//   },
//   {
//     id: '2',
//     name: 'Dishes 2',
//     diet: 'Diet 2',
//     image:
//       'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
//   },
//   {
//     id: '3',
//     name: 'Dishes 3',
//     diet: 'Diet 3',
//     image:
//       'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
//   },
//   {
//     id: '4',
//     name: 'Dishes 4',
//     diet: 'Diet 4',
//     image:
//       'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
//   },
//   {
//     id: '5',
//     name: 'Dishes 5',
//     diet: 'Diet 5',
//     image:
//       'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
//   },
// ]

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
            <DropdownMenuItem onClick={() => router.push(`/admin/dishes/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              tabIndex={0}
              aria-label="Xoá món ăn"
              onClick={() => handleDelete(row.id)}
            >
              <Trash2 /> Xoá
            </DropdownMenuItem>
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
    if (window.confirm('Bạn có chắc muốn xoá món ăn này?')) {
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
  }

  useEffect(() => {
    const fetchDishes = async () => {
      const response = await getListDishes()
      const dietResponse = await getDiets()
      setDietList(dietResponse.data || [])
      console.log('response', response)
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
