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
import { Switch } from '@/components/ui/switch'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'

type MealPlan = {
  id: string
  name: string
  description: string
  calory: string
  diet: string
  is_public: boolean
}

const mealPlans: MealPlan[] = [
  {
    id: '1',
    name: 'Meal plan 1',
    description: 'Description 1',
    calory: '1000-2000 cal',
    diet: 'Diet 1',
    is_public: true,
  },
  {
    id: '2',
    name: 'Meal plan 2',
    description: 'Description 2',
    calory: '< 1000 cal',
    diet: 'Diet 2',
    is_public: true,
  },
  {
    id: '3',
    name: 'Meal plan 3',
    description: 'Description 3',
    calory: '< 1000 cal',
    diet: 'Diet 3',
    is_public: false,
  },
  {
    id: '4',
    name: 'Meal plan 4',
    description: 'Description 4',
    calory: '> 2000 cal',
    diet: 'Diet 4',
    is_public: false,
  },
  {
    id: '5',
    name: 'Meal plan 5',
    description: 'Description 5',
    calory: '1000-2000 cal',
    diet: 'Diet 5',
    is_public: true,
  },
]

export default function MealPlansPage() {
  const columns: ColumnDef<MealPlan>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'description',
      header: 'Thông tin',
    },
    {
      accessorKey: 'calory',
      header: 'Calory',
    },
    {
      accessorKey: 'diet',
      header: 'Chế độ ăn',
    },
    {
      accessorKey: 'is_public',
      header: 'Public',
      render: ({ row }) => <Switch defaultChecked={row.is_public} />,
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
              <Copy /> Sao chép thực đơn ID
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
      <AddButton text="Thêm thực đơn" />
      <MainButton text="Nhập dữ liệu" variant="outline" icon={Import} />
    </>
  )

  return (
    <ContentLayout title="Thực đơn">
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
