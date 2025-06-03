'use client'

import { Metadata } from 'next'

import { ContentLayout } from '@/components/admin-panel/content-layout'

import LiveClassesPageClient from './page-client'
import { deleteCourse, getCourses, updateCourse } from '@/network/server/courses-admin'
import { useAuth } from '@/components/providers/auth-context'
import { getSubAdminCourses } from '@/network/server/sub-admin'
import { useEffect, useState } from 'react'
import { ListCourse } from '@/models/course-admin'
import { ListResponse } from '@/models/response'
import { MainButton } from '@/components/buttons/main-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { toast } from 'sonner'
import { useClipboard } from '@/hooks/use-clipboard'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { useDebounced } from '@/hooks/useDebounced'
import { Copy, Edit, Ellipsis, Import } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddButton } from '@/components/buttons/add-button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateCourseForm } from '@/components/forms/create-course-form'
import { Badge } from '@/components/ui/badge'
import { difficultyLevelLabel, formCategoryLabel } from '@/lib/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'

export const dynamic = 'force-static'

// export const metadata: Metadata = {
//   title: 'Quản lý khoá học Zoom',
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

export default function LiveClassesPage() {
  const { role, accessToken } = useAuth()
  const [data, setData] = useState<ListCourse[]>()

  const { copy } = useClipboard()
  const router = useRouter()

  const fetchLiveClasses = async () => {
    let res
    if (role === 'sub_admin' && accessToken) {
      res = await getSubAdminCourses(accessToken, 'live', false)
    } else {
      res = await getCourses('live', false)
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
            <DropdownMenuItem onClick={() => router.push(`/admin/live-classes/${row.id}`)}>
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
    <ContentLayout title="Khoá tập Zoom">
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
          <DialogDescription>Tạo khoá tập Zoom</DialogDescription>
          <ScrollArea className="h-[600px]" type="always">
            <CreateCourseForm
              format="live"
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
