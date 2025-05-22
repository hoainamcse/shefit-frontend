'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { CreateCourseForm } from '@/components/forms/create-course-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { getFormCategoryLabel } from '@/lib/label'
import { ListCourse } from '@/models/course-admin'
import { deleteCourse, getCourses } from '@/network/server/courses-admin'
import { Copy, Edit, Ellipsis, Eye, Import, Radio, Trash2, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function CreateCourseDialog({
  courseFormat,
  open,
  setOpen,
  onSuccess,
}: {
  courseFormat: 'video' | 'live'
  open?: boolean
  setOpen?: (open: boolean) => void
  onSuccess?: () => void
}) {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
    if (setOpen) {
      setOpen(false)
    }
  }

  return (
    <DialogContent className="max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle>Thêm khoá học</DialogTitle>
        <DialogDescription>Tạo khoá học {courseFormat === 'video' ? 'Video' : 'Zoom'}</DialogDescription>
        <ScrollArea className="h-[600px]" type="always">
          <CreateCourseForm format={courseFormat} isOneOnOne onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogHeader>
    </DialogContent>
  )
}

export default function OneOnOneClassesPage() {
  const router = useRouter()
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [liveDialogOpen, setLiveDialogOpen] = useState(false)

  const [oneOnOneClasses, setOneOnOneClasses] = useState<ListCourse[]>([])

  const fetchOneOnOneClasses = async () => {
    const oneOnOneResponse = await getCourses('', true)
    setOneOnOneClasses(oneOnOneResponse.data)
  }

  useEffect(() => {
    fetchOneOnOneClasses()
  }, [])

  const handleDelete = async (id: string) => {
    const response = await deleteCourse(id)
    if (response.status === 'success') {
      toast.success('Xoá khoá học thành công')
      fetchOneOnOneClasses()
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
    },
    // {
    //   accessorKey: 'equipments',
    //   header: 'Dụng cụ',
    //   render: ({ row }) => (
    //     <div className="flex flex-wrap gap-2">
    //       {row.equipments.map((equipment) => (
    //         <Badge key={equipment} variant="secondary" className="text-foreground">
    //           {equipment}
    //         </Badge>
    //       ))}
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: 'muscles',
    //   header: 'Nhóm cơ',
    //   render: ({ row }) => (
    //     <div className="flex flex-wrap gap-2">
    //       {row.muscles.map((muscle) => (
    //         <Badge key={muscle} variant="secondary" className="text-foreground">
    //           {muscle}
    //         </Badge>
    //       ))}
    //     </div>
    //   ),
    // },
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
          {row.difficulty_level}
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
      accessorKey: 'course_format',
      header: 'Loại',
      render: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.course_format}
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
            <DropdownMenuItem onClick={() => router.push(`/admin/${row.course_format}-classes/${row.id}`)}>
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AddButton text="Thêm khoá học" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setVideoDialogOpen(true)
            }}
          >
            <Video className="mr-2 h-4 w-4" /> Khoá học Video
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setLiveDialogOpen(true)
            }}
          >
            <Radio className="mr-2 h-4 w-4" /> Khoá học Zoom
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MainButton text="Nhập khoá học" variant="outline" icon={Import} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => router.push('/admin/video-classes/new')}>
            <Video /> Khoá học Video
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <CreateCourseDialog
          courseFormat="video"
          open={videoDialogOpen}
          setOpen={setVideoDialogOpen}
          onSuccess={() => {
            setVideoDialogOpen(false)
            fetchOneOnOneClasses()
          }}
        />
      </Dialog>

      <Dialog open={liveDialogOpen} onOpenChange={setLiveDialogOpen}>
        <CreateCourseDialog
          courseFormat="live"
          open={liveDialogOpen}
          setOpen={setLiveDialogOpen}
          onSuccess={() => {
            setLiveDialogOpen(false)
            fetchOneOnOneClasses()
          }}
        />
      </Dialog>
    </ContentLayout>
  )
}
