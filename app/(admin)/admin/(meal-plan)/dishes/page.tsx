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

type Dish = {
  id: string
  name: string
  diet: string
  image: string
}

const mealPlans: Dish[] = [
  {
    id: '1',
    name: 'Dishes 1',
    diet: 'Diet 1',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
  },
  {
    id: '2',
    name: 'Dishes 2',
    diet: 'Diet 2',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
  },
  {
    id: '3',
    name: 'Dishes 3',
    diet: 'Diet 3',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
  },
  {
    id: '4',
    name: 'Dishes 4',
    diet: 'Diet 4',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
  },
  {
    id: '5',
    name: 'Dishes 5',
    diet: 'Diet 5',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/endive-salad-with-chicken-and-blue-cheese-661d80799959b.jpg?crop=0.956xw:0.714xh;0.0238xw,0.107xh&resize=980:*',
  },
]

export default function DishesPage() {
  const columns: ColumnDef<Dish>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'diet',
      header: 'Chế độ ăn',
    },
    {
      accessorKey: 'image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image} alt={`${row.name} thumbnail`} className="h-12 rounded" />
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
            <DropdownMenuItem>
              <Eye /> Xem
            </DropdownMenuItem>
            <DropdownMenuItem>
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
  const headerExtraContent = (
    <>
      <AddButton text="Thêm món ăn" />
      <MainButton text="Nhập món ăn" variant="outline" icon={Import} />
    </>
  )

  return (
    <ContentLayout title="Thư viện món ăn">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={mealPlans}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
