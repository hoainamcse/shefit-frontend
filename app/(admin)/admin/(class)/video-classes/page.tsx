'use client'

import { Metadata } from 'next'

import { ContentLayout } from '@/components/admin-panel/content-layout'

import VideoClassesPageClient from './page-client'
import { deleteCourse, getCourses, updateCourse } from '@/network/server/courses-admin'
import { useAuth } from '@/components/providers/auth-context'
import { ListResponse } from '@/models/response'
import { ListCourse } from '@/models/course-admin'
import { useEffect, useState } from 'react'
import { getSubAdminCourses } from '@/network/server/sub-admin'
import { ColumnDef, DataTable } from '@/components/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateCourseForm } from '@/components/forms/create-course-form'
import { AddButton } from '@/components/buttons/add-button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useClipboard } from '@/hooks/use-clipboard'
import { Badge } from '@/components/ui/badge'
import { getDifficultyLevelLabel, getFormCategoryLabel } from '@/lib/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, Ellipsis, Import } from 'lucide-react'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'
import { useDebounced } from '@/hooks/useDebounced'
import { Switch } from '@/components/ui/switch'
import { MainButton } from '@/components/buttons/main-button'

export const dynamic = 'force-static'

// export const metadata: Metadata = {
//   title: 'Quản lý khoá học Video',
//   description: '',
// }

const PublicSwitchCell = ({ row }: { row: ListCourse }) => {
  const { accessToken } = useAuth()
  const [checked, setChecked] = useState(row.is_public)
  const debouncedUpdate = useDebounced(async (newVal: boolean) => {
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

export default function VideoClassesPage() {
  const { role, accessToken } = useAuth()
  const [data, setData] = useState<ListCourse[]>()
  const { copy } = useClipboard()
  const router = useRouter()

  const fetchLiveClasses = async () => {
    let res
    if (role === 'sub_admin' && accessToken) {
      res = await getSubAdminCourses(accessToken, 'video', false)
    } else {
      res = await getCourses('video', false)
    }
    setData(res.data)
  }

  const handleDelete = async (id: string) => {
    if (!accessToken) return
    const response = await deleteCourse(id, accessToken)
    if (response.status === 'success') {
      toast.success('Xoá khoá tập thành công')
      fetchLiveClasses()
    } else {
      toast.error('Xoá khoá tập thất bại')
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
      <CreateCourseDialog updateData={fetchLiveClasses} />
      <MainButton text="Nhập khoá tập" variant="outline" icon={Import} />
    </>
  )

  useEffect(() => {
    fetchLiveClasses()
  }, [])

  return (
    <ContentLayout title="Khoá tập Video">
      <DataTable
        headerExtraContent={role === 'admin' ? headerExtraContent : null}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={data || []}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}

function CreateCourseDialog({ updateData }: { updateData?: () => void }) {
  const [open, setOpen] = useState(false)

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
            <CreateCourseForm
              format="video"
              onSuccess={() => {
                setOpen(false)
                updateData?.()
              }}
            />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
