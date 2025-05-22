'use client'

import { useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateCourseForm } from '@/components/forms/create-course-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { deleteCourse } from '@/network/server/courses-admin'
import { toast } from 'sonner'
import { ListCourse } from '@/models/course-admin'

export default function VideoClassesPageClient({ data }: { data: ListResponse<ListCourse> }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const response = await deleteCourse(id)
    if (response.status === 'success') {
      toast.success('Xoá khoá học thành công')
    } else {
      toast.error('Xoá khoá học thất bại')
    }
    //router.refresh()
  }

  const columns: ColumnDef<ListCourse>[] = [
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
      accessorKey: 'subscriptions',
      header: 'Membership',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.subscriptions.map((subscription) => (
            <Badge key={subscription.id} variant="secondary" className="text-foreground">
              {subscription.name}
            </Badge>
          ))}
        </div>
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
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDelete(row.id.toString())}
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
      <CreateCourseDialog />
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

function CreateCourseDialog() {
  const [open, setOpen] = useState(false)

  function onSuccess() {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddButton text="Thêm khoá học" />
      </DialogTrigger>
      <DialogContent className="max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Thêm khoá học</DialogTitle>
          <DialogDescription>Tạo khoá học video</DialogDescription>
          <ScrollArea className="h-[600px]" type="always">
            <CreateCourseForm format="video" onSuccess={onSuccess} />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
