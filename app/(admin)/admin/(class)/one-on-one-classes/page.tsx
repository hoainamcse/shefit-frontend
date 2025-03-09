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
import { Switch } from '@/components/ui/switch'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'

type Membership = {
  id: string
  name: string
}

type Trainer = {
  id: string
  name: string
}

type OneOnOneClass = {
  id: string
  name: string
  description: string
  equipments: string[]
  muscles: string[]
  trainer: Trainer
  level: 'beginner' | 'intermediate' | 'advanced'
  membership?: Membership
  type: 'video' | 'live'
  is_public: boolean
}

const oneOnOneClasses: OneOnOneClass[] = [
  {
    id: '1',
    name: 'Fitness Trainer',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Belt Squat', 'Power Rack'],
    muscles: ['Trapezius', 'Soleus'],
    level: 'beginner',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
    type: 'video',
    is_public: true,
  },
  {
    id: '2',
    name: 'Fitness Trainer',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Belt Squat', 'Power Rack'],
    muscles: ['Trapezius', 'Soleus'],
    level: 'intermediate',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
    type: 'video',
    is_public: true,
  },
  {
    id: '3',
    name: 'Fitness Trainer',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Belt Squat', 'Power Rack'],
    muscles: ['Trapezius', 'Soleus'],
    level: 'advanced',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
    type: 'live',
    is_public: false,
  },
  {
    id: '4',
    name: 'Fitness Trainer',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Belt Squat', 'Power Rack'],
    muscles: ['Trapezius', 'Soleus'],
    level: 'beginner',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
    type: 'video',
    is_public: true,
  },
  {
    id: '5',
    name: 'Fitness Trainer',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Belt Squat', 'Power Rack'],
    muscles: ['Trapezius', 'Soleus'],
    level: 'intermediate',
    trainer: {
      id: '1',
      name: 'John Doe',
    },
    membership: {
      id: '1',
      name: 'Độ mông 4 tuần',
    },
    type: 'live',
    is_public: true,
  },
]

export default function OneOnOneClassesPage() {
  const columns: ColumnDef<OneOnOneClass>[] = [
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
      render: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.level}
        </Badge>
      ),
    },
    {
      accessorKey: 'membership',
      header: 'Membership',
      render: ({ row }) => row.membership?.name ?? '-',
    },
    {
      accessorKey: 'type',
      header: 'Loại',
      render: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.type}
        </Badge>
      ),
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
      <MainButton text="Nhập khoá học (Video)" variant="outline" icon={Import} />
    </>
  )

  return (
    <ContentLayout title="Khoá học Zoom">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={oneOnOneClasses}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
