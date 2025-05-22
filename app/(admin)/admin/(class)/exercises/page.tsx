'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { FormMultiSelectField, FormInputField, FormTextareaField } from '@/components/forms/fields'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form } from '@/components/ui/form'
import { getYoutubeThumbnail } from '@/lib/youtube'
import { Exercise } from '@/models/exercies'
import { deleteExercise, getExercises } from '@/network/server/exercise'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const router = useRouter()

  const fetchExercises = async () => {
    const response = await getExercises()
    setExercises(response.data)
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  const handleDeleteExercise = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá bài tập này?')) {
      try {
        const res = await deleteExercise(id)
        if (res.status === 'success') {
          toast.success('Xoá bài tập thành công')
          fetchExercises()
        }
      } catch (e) {
        toast.error('Có lỗi khi xoá bài tập')
      }
    }
  }

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
            <Badge key={equipment.id} variant="secondary" className="text-foreground">
              {equipment.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'muscle_groups',
      header: 'Nhóm cơ',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.muscle_groups.map((muscle_group) => (
            <Badge key={muscle_group.id} variant="secondary" className="text-foreground">
              {muscle_group.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'youtube_url',
      header: 'Video',
      render: ({ row }) => {
        const thumbnail = getYoutubeThumbnail(row.youtube_url)
        return (
          <a href={row.youtube_url} target="_blank">
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
            <DropdownMenuItem onClick={() => router.push(`/admin/exercises/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDeleteExercise(row.id)}
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
      <AddButton text="Thêm bài tập" onClick={() => router.push('/admin/exercises/create')} />
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

// function CreateExerciseDialog({ children }: { children: React.ReactNode }) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Thêm bài tập</DialogTitle>
//         </DialogHeader>
//         <CreateExerciseForm />
//       </DialogContent>
//     </Dialog>
//   )
// }

// function CreateExerciseForm() {
//   const form = useForm()
//   return (
//     <Form {...form}>
//       <form className="space-y-6">
//         <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên bài tập" />
//         <FormTextareaField form={form} name="description" label="Thông tin" />
//         <FormMultiSelectField
//           form={form}
//           name="equipment_ids"
//           label="Dụng cụ"
//           data={equipments}
//           placeholder="Chọn dụng cụ"
//         />
//         <FormMultiSelectField
//           form={form}
//           name="muscle_group_ids"
//           label="Nhóm cơ"
//           data={muscleGroups}
//           placeholder="Chọn nhóm cơ"
//         />
//         <FormInputField form={form} name="url" label="Link Youtube" placeholder="Nhập link Youtube" />
//         <MainButton text="Tạo" className="w-full" />
//       </form>
//     </Form>
//   )
// }
