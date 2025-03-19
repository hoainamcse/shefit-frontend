'use client'

import { useRouter } from 'next/navigation'
import { Copy, Edit, Ellipsis, Import, Trash2 } from 'lucide-react'

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
import { ListResponse } from '@/models/response'
import { Course } from '@/models/course'
import { getDifficultyLevelLabel, getFormCategoryLabel } from '@/lib/label'

export default function VideoClassesPageClient({ data }: { data: ListResponse<Course> }) {
  const router = useRouter()

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: 'course_name',
      header: 'Tên',
    },
    {
      accessorKey: 'trainer',
      header: 'HLV',
      render: ({ row }) => row.trainer,
    },
    {
      accessorKey: 'form_categories',
      header: 'Dáng',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.form_categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-foreground">
              {getFormCategoryLabel(category)}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'difficulty_level',
      header: 'Độ khó',
      render: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {getDifficultyLevelLabel(row.difficulty_level)}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_public',
      header: 'Hiển thị',
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
            <DropdownMenuItem onClick={() => router.push(`/admin/video-classes/${row.id}`)}>
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
      <AddButton text="Thêm khoá học" onClick={() => router.push('/admin/video-classes/new')} />
      <MainButton text="Nhập khoá học" variant="outline" icon={Import} />
    </>
  )

  return (
    <DataTable
      headerExtraContent={headerExtraContent}
      searchPlaceholder="Tìm kiếm theo tên, ..."
      data={data.data}
      columns={columns}
      onSelectChange={() => {}}
    />
  )
}
