'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { FileUploader } from '@/components/file-uploader'
import { CreateMuscleEquipForm } from '@/components/forms/create-muscle-equip-form'
import { FormInputField } from '@/components/forms/fields'
import { FormImageInputField } from '@/components/forms/fields/form-image-input-field'
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
import { Equipment } from '@/models/equipments'
import { MuscleGroup } from '@/models/muscle-group'
import { createEquipment, deleteEquipment, getEquipments, updateEquipment } from '@/network/server/equipments'
import { createMuscleGroup, deleteMuscleGroup, getMuscleGroups, updateMuscleGroup } from '@/network/server/muscle-group'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function MuscleGroupsAndEquipmentsPage() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [openMuscleGroupModal, setOpenMuscleGroupModal] = useState(false)
  const [openEquipmentModal, setOpenEquipmentModal] = useState(false)
  const [editingMuscleGroup, setEditingMuscleGroup] = useState<MuscleGroup>()
  const [editingEquipment, setEditingEquipment] = useState<Equipment>()

  const fetchMuscleGroups = async () => {
    const response = await getMuscleGroups()
    console.log(response)
    setMuscleGroups(response.data || [])
  }

  const fetchEquipments = async () => {
    const response = await getEquipments()
    setEquipments(response.data || [])
  }

  useEffect(() => {
    fetchMuscleGroups()
    fetchEquipments()
  }, [])

  const handleDeleteMuscleGroup = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xoá nhóm cơ này?')) {
      try {
        const res = await deleteMuscleGroup(id)
        if (res.status === 'success') {
          toast.success('Xoá nhóm cơ thành công')
          fetchMuscleGroups()
        }
      } catch (e) {
        toast.error('Có lỗi khi xoá nhóm cơ')
      }
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xoá dụng cụ này?')) {
      try {
        const res = await deleteEquipment(id)
        if (res.status === 'success') {
          toast.success('Xoá dụng cụ thành công')
          fetchEquipments()
        }
      } catch (e) {
        toast.error('Có lỗi khi xoá dụng cụ')
      }
    }
  }

  const columnsMuscleGroups: ColumnDef<MuscleGroup>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image} alt={`${row.name} thumbnail`} className="h-16 w-16 rounded-lg object-cover " />
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
            <DropdownMenuItem
              onClick={() => {
                setEditingMuscleGroup(row)
                setOpenMuscleGroupModal(true)
              }}
            >
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDeleteMuscleGroup(row.id.toString())}
            >
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const headerExtraContentMuscleGroups = (
    <CreateMuscleEquipDialog
      open={openMuscleGroupModal}
      setOpen={setOpenMuscleGroupModal}
      isEdit={!!editingMuscleGroup}
      updateData={fetchMuscleGroups}
      data={editingMuscleGroup}
      onClose={() => {
        setEditingMuscleGroup(undefined)
        setOpenMuscleGroupModal(false)
      }}
      type="muscle-groups"
      create={createMuscleGroup}
      update={updateMuscleGroup}
    >
      <AddButton text="Thêm nhóm cơ" />
    </CreateMuscleEquipDialog>
  )

  const columnsEquipments: ColumnDef<Equipment>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'image',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image} alt={`${row.name} thumbnail`} className="h-16 w-16 rounded-lg object-cover " />
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
            <DropdownMenuItem
              onClick={() => {
                setEditingEquipment(row)
                setOpenEquipmentModal(true)
              }}
            >
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDeleteEquipment(row.id.toString())}
            >
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const headerExtraContentEquipments = (
    <CreateMuscleEquipDialog
      open={openEquipmentModal}
      setOpen={setOpenEquipmentModal}
      updateData={fetchEquipments}
      isEdit={!!editingEquipment}
      data={editingEquipment}
      onClose={() => {
        setEditingEquipment(undefined)
        setOpenEquipmentModal(false)
      }}
      type="equipments"
      create={createEquipment}
      update={updateEquipment}
    >
      <AddButton text="Thêm dụng cụ" />
    </CreateMuscleEquipDialog>
  )

  return (
    <ContentLayout title="Nhóm cơ & dụng cụ">
      <div className="flex items-start space-x-4">
        <DataTable
          headerExtraContent={headerExtraContentMuscleGroups}
          searchPlaceholder="Tìm kiếm theo tên, ..."
          data={muscleGroups}
          columns={columnsMuscleGroups}
          onSelectChange={() => {}}
        />
        <Separator orientation="vertical" />
        <DataTable
          headerExtraContent={headerExtraContentEquipments}
          searchPlaceholder="Tìm kiếm theo tên, ..."
          data={equipments}
          columns={columnsEquipments}
          onSelectChange={() => {}}
        />
      </div>
    </ContentLayout>
  )
}

interface CreateMuscleEquipDialogProps {
  children: React.ReactNode
  updateData?: () => void
  open: boolean
  setOpen: (open: boolean) => void
  isEdit: boolean
  data?: MuscleGroup | Equipment
  onClose: () => void
  type: 'muscle-groups' | 'equipments'
  create: (data: any) => Promise<{ status: string }>
  update: (id: string, data: any) => Promise<{ status: string }>
}

function CreateMuscleEquipDialog({
  children,
  updateData,
  open,
  setOpen,
  isEdit,
  data,
  onClose,
  type,
  create,
  update,
}: CreateMuscleEquipDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'muscle-groups'
              ? isEdit
                ? 'Cập nhật nhóm cơ'
                : 'Thêm nhóm cơ'
              : isEdit
              ? 'Cập nhật dụng cụ'
              : 'Thêm dụng cụ'}
          </DialogTitle>
        </DialogHeader>
        <CreateMuscleEquipForm
          isEdit={isEdit}
          data={data}
          onSuccess={() => {
            setOpen(false)
            updateData?.()
            onClose()
          }}
          type={type}
          create={create}
          update={update}
        />
      </DialogContent>
    </Dialog>
  )
}
