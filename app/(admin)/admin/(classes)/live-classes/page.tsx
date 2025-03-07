'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
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
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'

type Membership = {
  id: string
  name: string
}

type Trainer = {
  id: string
  name: string
}

type LiveClass = {
  id: string
  name: string
  description: string
  equipments: string[]
  muscles: string[]
  trainer: Trainer
  level: 'beginner' | 'advanced' | 'advanced'
  membership?: Membership
}

const liveClasses: LiveClass[] = [
  {
    id: '1',
    name: 'Pilates Matworkk',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Recline Bike', 'Upright Bike'],
    muscles: ['Glutues', 'Quadriceps'],
    level: 'advanced',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
  },
  {
    id: '2',
    name: 'Pilates Matworkk',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Recline Bike', 'Upright Bike'],
    muscles: ['Glutues', 'Quadriceps'],
    level: 'advanced',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
  },
  {
    id: '3',
    name: 'Pilates Matworkk',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Recline Bike', 'Upright Bike'],
    muscles: ['Glutues', 'Quadriceps'],
    level: 'advanced',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
  },
  {
    id: '4',
    name: 'Pilates Matworkk',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Recline Bike', 'Upright Bike'],
    muscles: ['Glutues', 'Quadriceps'],
    level: 'advanced',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
  },
  {
    id: '5',
    name: 'Pilates Matworkk',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Recline Bike', 'Upright Bike'],
    muscles: ['Glutues', 'Quadriceps'],
    level: 'advanced',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
  },
]

export default function LiveClassesPage() {
  const columns: ColumnDef<LiveClass>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'trainer',
      header: 'HLV',
      render: ({ row }) => row.trainer.name,
    },
    {
      accessorKey: 'equipments',
      header: 'Dụng cụ',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.equipments.map((equipment) => (
            <Badge key={equipment} variant="secondary" className="text-foreground">
              {equipment}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'muscles',
      header: 'Nhóm cơ',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.muscles.map((muscle) => (
            <Badge key={muscle} variant="secondary" className="text-foreground">
              {muscle}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'level',
      header: 'Level',
      render: ({ row }) => <span className="capitalize">{row.level}</span>,
    },
    {
      accessorKey: 'membership',
      header: 'Membership',
      render: ({ row }) => row.membership?.name ?? '-',
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
              <Copy /> Sao chép khoá học ID
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
      <AddButton text="Thêm khoá học" />
      <MainButton text="Nhập dữ liệu" variant="outline" icon={Import} />
    </>
  )

  return (
    <ContentLayout title="Khoá học Zoom">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={liveClasses}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
