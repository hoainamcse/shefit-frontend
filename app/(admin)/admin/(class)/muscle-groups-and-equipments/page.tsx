'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { FileUploader } from '@/components/file-uploader'
import FormInputField from '@/components/forms/fields/form-input-field'
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
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export default function MuscleGroupsAndEquipmentsPage() {
  return (
    <ContentLayout title="Nhóm cơ & dụng cụ">
      <div className="flex items-center space-x-4">
        <MuscleGroups />
        <Separator orientation="vertical" />
        <Equipments />
      </div>
    </ContentLayout>
  )
}

type MuscleGroup = {
  id: string
  name: string
  image: string
}

const muscleGroups: MuscleGroup[] = [
  {
    id: '1',
    name: 'Deltoid',
    image:
      'https://stgaccinwbsdevlrs01.blob.core.windows.net/newcorporatewbsite/blogs/october2023/detail-main-Deltoid-muscle-1.jpeg',
  },
  {
    id: '2',
    name: 'Deltoid',
    image:
      'https://stgaccinwbsdevlrs01.blob.core.windows.net/newcorporatewbsite/blogs/october2023/detail-main-Deltoid-muscle-1.jpeg',
  },
  {
    id: '3',
    name: 'Deltoid',
    image:
      'https://stgaccinwbsdevlrs01.blob.core.windows.net/newcorporatewbsite/blogs/october2023/detail-main-Deltoid-muscle-1.jpeg',
  },
  {
    id: '4',
    name: 'Deltoid',
    image:
      'https://stgaccinwbsdevlrs01.blob.core.windows.net/newcorporatewbsite/blogs/october2023/detail-main-Deltoid-muscle-1.jpeg',
  },
  {
    id: '5',
    name: 'Deltoid',
    image:
      'https://stgaccinwbsdevlrs01.blob.core.windows.net/newcorporatewbsite/blogs/october2023/detail-main-Deltoid-muscle-1.jpeg',
  },
]

function MuscleGroups() {
  const columns: ColumnDef<MuscleGroup>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image} alt={`${row.name} thumbnail`} className="h-12 rounded" />
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
              <Copy /> Sao chép nhóm cơ ID
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
    <CreateExerciseDialog>
      <AddButton text="Thêm nhóm cơ" />
    </CreateExerciseDialog>
  )

  return (
    <DataTable
      headerExtraContent={headerExtraContent}
      searchPlaceholder="Tìm kiếm theo tên, ..."
      data={muscleGroups}
      columns={columns}
      onSelectChange={() => {}}
    />
  )
}

type Equipment = {
  id: string
  name: string
  image: string
}

const equipment: Equipment[] = [
  {
    id: '1',
    name: 'Wheel Roller',
    image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
  },
  {
    id: '2',
    name: 'Wheel Roller',
    image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
  },
  {
    id: '3',
    name: 'Wheel Roller',
    image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
  },
  {
    id: '4',
    name: 'Wheel Roller',
    image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
  },
  {
    id: '5',
    name: 'Wheel Roller',
    image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
  },
]

function Equipments() {
  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image} alt={`${row.name} thumbnail`} className="h-12 rounded" />
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
              <Copy /> Sao chép dụng cụ ID
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
    <CreateExerciseDialog>
      <AddButton text="Thêm dụng cụ" />
    </CreateExerciseDialog>
  )

  return (
    <DataTable
      headerExtraContent={headerExtraContent}
      searchPlaceholder="Tìm kiếm theo tên, ..."
      data={equipment}
      columns={columns}
      onSelectChange={() => {}}
    />
  )
}

function CreateExerciseDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhóm cơ</DialogTitle>
        </DialogHeader>
        <CreateExerciseForm />
      </DialogContent>
    </Dialog>
  )
}

function CreateExerciseForm() {
  const form = useForm()
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên bài tập" />
        <div className="space-y-4">
          <Label>Hình</Label>
          <FileUploader />
        </div>
        <MainButton text="Tạo" className="w-full" />
      </form>
    </Form>
  )
}
