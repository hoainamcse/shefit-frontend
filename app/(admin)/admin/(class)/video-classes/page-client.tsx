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
import { difficultyLevelLabel, formCategoryLabel } from '@/lib/label'
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
import { deleteCourse, updateCourse } from '@/network/server/courses-admin'
import { toast } from 'sonner'
import { ListCourse } from '@/models/course-admin'
import { useDebounced } from '@/hooks/useDebounced'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'
import { useClipboard } from '@/hooks/use-clipboard'
import { useAuth } from '@/components/providers/auth-context'

const PublicSwitchCell = ({ row }: { row: ListCourse }) => {
  const [checked, setChecked] = useState(row.is_public)
  const debouncedUpdate = useDebounced(async (newVal: boolean) => {
    const { accessToken } = useAuth()
    if (!accessToken) return
    const res = await updateCourse(row.id.toString(), { ...row, is_public: newVal }, accessToken)
    if (res.status === 'success') toast.success('Cập nhật hiển thị thành công')
    else toast.error('Cập nhật hiển thị thất bại')
  }, 700)
  const handleChange = (val: boolean) => {
    setChecked(val)
    debouncedUpdate(val)
  }
  return <Switch checked={checked} onCheckedChange={handleChange} />
}

export default function VideoClassesPageClient({ data }: { data: ListResponse<ListCourse> }) {
  const { copy } = useClipboard()
  const router = useRouter()
  const { accessToken } = useAuth()

  const handleDelete = async (id: string) => {
    if (!accessToken) return
    const response = await deleteCourse(id, accessToken)
    if (response.status === 'success') {
      toast.success('Xoá khoá tập thành công')
      router.refresh()
    } else {
      toast.error('Xoá khoá tập thất bại')
    }
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
              {formCategoryLabel[category]}
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
          {difficultyLevelLabel[row.difficulty_level]}
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
      render: ({ row }) => <PublicSwitchCell row={row} />,
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
            <DropdownMenuItem onClick={() => copy(row.id)}>
              <Copy /> Sao chép khoá tập ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/admin/video-classes/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DeleteMenuItem onConfirm={() => handleDelete(row.id.toString())} />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  const headerExtraContent = (
    <>
      <CreateCourseDialog />
      <MainButton text="Nhập khoá tập" variant="outline" icon={Import} />
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
        <AddButton text="Thêm khoá tập" />
      </DialogTrigger>
      <DialogContent className="max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Thêm khoá tập</DialogTitle>
          <DialogDescription>Tạo khoá tập video</DialogDescription>
          <ScrollArea className="h-[600px]" type="always">
            <CreateCourseForm format="video" onSuccess={onSuccess} />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
