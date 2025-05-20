'use client'

import { useState, useEffect } from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Edit, Pencil, Save, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Category, Color } from '@/models/category'
import { Diet } from '@/models/diet-admin'
import { Calorie } from '@/models/calorie'
import { createCalorie, deleteCalorie, getCalories, updateCalorie } from '@/network/server/calorie'
import { createDiet, deleteDiet, getDiets, updateDiet } from '@/network/server/diet-admin'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreateDietForm } from '@/components/forms/create-diet-form'

export default function DietsCaloriesPage() {
  // Diet state
  const [diets, setDiets] = useState<Diet[]>([])
  const [openDietModal, setOpenDietModal] = useState(false)
  const [editingDiet, setEditingDiet] = useState<Diet>()

  // Calorie state
  const [calories, setCalories] = useState<Calorie[]>([])
  const [editCalorie, setEditCalorie] = useState<Calorie | null>(null)

  // Loading state
  const [loading, setLoading] = useState(false)

  const fetchDiets = async () => {
    const response = await getDiets()
    setDiets(response.data || [])
  }

  const fetchCalories = async () => {
    const response = await getCalories()
    setCalories(response.data || [])
  }

  useEffect(() => {
    fetchDiets()
    fetchCalories()
  }, [])

  // Calorie CRUD handlers
  const handleAddCalorie = () => {
    setEditCalorie({
      id: 0,
      name: '',
      description: '',
      created_at: '',
      updated_at: '',
    })
  }

  const handleEditCalorie = (calorie: Calorie) => {
    setEditCalorie({ ...calorie })
  }

  const handleSaveCalorie = async () => {
    if (!editCalorie) return
    if (!editCalorie.name.trim()) {
      toast.error('Tên lượng calo không được để trống')
      return
    }

    try {
      setLoading(true)
      const isNew = editCalorie.id === 0
      const { id, ...data } = editCalorie
      const response = isNew ? await createCalorie(data) : await updateCalorie(data, id)

      if (response.status === 'success') {
        toast.success(isNew ? 'Thêm lượng calo thành công' : 'Cập nhật lượng calo thành công')
        fetchCalories()
        setEditCalorie(null)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCalorie = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xoá lượng calo này?')) return

    try {
      setLoading(true)
      const response = await deleteCalorie(id)

      if (response.status === 'success') {
        toast.success('Xoá màu thành công')
        fetchCalories()
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  // Diet CRUD handlers
  const handleDeleteDiet = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xoá chế độ ăn này?')) return

    try {
      const response = await deleteDiet([id])
      if (response.status === 'success') {
        toast.success('Xoá chế độ ăn thành công')
        fetchDiets()
      } else {
        toast.error('Có lỗi khi xoá chế độ ăn')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleOpenEditDiet = (diet: Diet) => {
    setEditingDiet(diet)
    setOpenDietModal(true)
  }

  const dietHeaderExtraContent = (
    <CreateDietDialog
      open={openDietModal}
      setOpen={setOpenDietModal}
      updateData={fetchDiets}
      isEdit={!!editingDiet}
      data={editingDiet}
      onClose={() => {
        setEditingDiet(undefined)
        setOpenDietModal(false)
      }}
    >
      <AddButton
        text="Thêm chế độ ăn"
        onClick={() => {
          setEditingDiet(undefined)
          setOpenDietModal(true)
        }}
      />
    </CreateDietDialog>
  )

  // Diet table columns
  const dietColumns: ColumnDef<Diet>[] = [
    { accessorKey: 'name', header: 'Tên diet' },
    {
      accessorKey: 'description',
      header: 'Mô tả',
    },
    {
      accessorKey: 'actions',
      header: 'Thao tác',
      render: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-green-600 hover:text-green-800"
            onClick={() => handleOpenEditDiet(row)}
          >
            <Edit />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDeleteDiet(row.id)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ]

  // Calorie table columns
  const calorieColumns: ColumnDef<Calorie>[] = [
    {
      accessorKey: 'name',
      header: 'Tên lượng calo',
      render: ({ row }) => {
        const isEditing = editCalorie?.id === row.id

        return isEditing ? (
          <input
            type="text"
            value={editCalorie.name}
            onChange={(e) => setEditCalorie({ ...editCalorie, name: e.target.value })}
            className="w-full px-2 py-1.5 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
            aria-label="Tên lượng calo"
            tabIndex={0}
          />
        ) : (
          <span className="block py-1.5 px-2">{row.name}</span>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Thao tác',
      render: ({ row }) => {
        const isEditing = editCalorie?.id === row.id

        return isEditing ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="default" onClick={handleSaveCalorie} disabled={loading}>
              <Save className="h-4 w-4 mr-1" /> Lưu
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditCalorie(null)} disabled={loading}>
              <X className="h-4 w-4 mr-1" /> Huỷ
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditCalorie(row)}
              disabled={loading || !!editCalorie}
            >
              <Pencil className="h-4 w-4 mr-1" /> Cập nhật
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => handleDeleteCalorie(row.id)}
              disabled={loading || !!editCalorie}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Xoá
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <ContentLayout title="Quản lý chế độ ăn & calories">
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách chế độ ăn</h2>
        <DataTable
          data={diets}
          columns={dietColumns}
          headerExtraContent={dietHeaderExtraContent}
          searchPlaceholder="Tìm kiếm thực đơn..."
          onSelectChange={() => {}}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách calories</h2>
        <DataTable
          data={[...calories, ...(editCalorie && editCalorie.id === 0 ? [editCalorie] : [])]}
          columns={calorieColumns}
          headerExtraContent={<AddButton text="Thêm lượng calo" onClick={handleAddCalorie} disabled={!!editCalorie} />}
          searchPlaceholder="Tìm kiếm lượng calo..."
          onSelectChange={() => {}}
        />
      </div>
    </ContentLayout>
  )
}

interface CreateDietDialogProps {
  children: React.ReactNode
  updateData?: () => void
  open: boolean
  setOpen: (open: boolean) => void
  isEdit: boolean
  data?: Diet
  onClose: () => void
}

function CreateDietDialog({ children, updateData, open, setOpen, isEdit, data, onClose }: CreateDietDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'}</DialogTitle>
        </DialogHeader>
        <CreateDietForm
          isEdit={isEdit}
          data={data}
          onSuccess={() => {
            setOpen(false)
            updateData?.()
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
