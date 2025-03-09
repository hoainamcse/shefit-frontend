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
import { getYoutubeThumbnail } from '@/lib/youtube'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'

type Exercise = {
  id: string
  name: string
  description: string
  equipments: string[]
  muscles: string[]
  url: string
}

const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Dumbbell Row',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Barbell', 'Dumbbell'],
    muscles: ['Biceps', 'Triceps'],
    url: 'https://www.youtube.com/watch?v=5PoEksoJNaw',
  },
  {
    id: '2',
    name: 'Dumbbell Row',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Barbell', 'Dumbbell'],
    muscles: ['Biceps', 'Triceps'],
    url: 'https://www.youtube.com/watch?v=5PoEksoJNaw',
  },
  {
    id: '3',
    name: 'Dumbbell Row',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Barbell', 'Dumbbell'],
    muscles: ['Biceps', 'Triceps'],
    url: 'https://www.youtube.com/watch?v=5PoEksoJNaw',
  },
  {
    id: '4',
    name: 'Dumbbell Row',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Barbell', 'Dumbbell'],
    muscles: ['Biceps', 'Triceps'],
    url: 'https://www.youtube.com/watch?v=5PoEksoJNaw',
  },
  {
    id: '5',
    name: 'Dumbbell Row',
    description: 'This is a dumbbell row exercise.',
    equipments: ['Barbell', 'Dumbbell'],
    muscles: ['Biceps', 'Triceps'],
    url: 'https://www.youtube.com/watch?v=5PoEksoJNaw',
  },
]

export default function ExercisesPage() {
  const columns: ColumnDef<Exercise>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'description',
      header: 'Thông tin',
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
      accessorKey: 'url',
      header: 'Video',
      render: ({ row }) => {
        const thumbnail = getYoutubeThumbnail(row.url)
        return (
          <a href={row.url} target="_blank">
            <img src={thumbnail} alt={`${row.name} thumbnail`} className="h-12 rounded" />
          </a>
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
            <DropdownMenuItem>
              <Copy /> Sao chép bài tập ID
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
      <AddButton text="Thêm bài tập" />
      <MainButton text="Nhập bài tập" variant="outline" icon={Import} />
    </>
  )

  return (
    <ContentLayout title="Thư viện bài tập">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={exercises}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
