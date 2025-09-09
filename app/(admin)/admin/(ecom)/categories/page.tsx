'use client'

import { useState, useEffect } from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { EditCouponForm } from '@/components/forms/edit-coupon-form'
import { Edit, Pencil, Save, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Category, Color, Size } from '@/models/category'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getColors,
  getSizes,
  createSize,
  updateSize,
  deleteSize,
  createColor,
  updateColor,
  deleteColor,
} from '@/network/client/products'
import { Coupon } from '@/models/coupon'
import { getCoupons, deleteCoupon } from '@/network/client/coupons'
import { DeleteButton } from '@/components/buttons/delete-button'

export default function CategoriesPage() {
  // Category state
  const [categories, setCategories] = useState<Category[]>([])
  const [editCategory, setEditCategory] = useState<Category | null>(null)

  // Size state
  const [sizes, setSizes] = useState<Size[]>([])
  const [editSize, setEditSize] = useState<Size | null>(null)

  // Color state
  const [colors, setColors] = useState<Color[]>([])
  const [editColor, setEditColor] = useState<Color | null>(null)

  // Coupon state
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [openCouponModal, setOpenCouponModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  // Loading state
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    const response = await getCategories()
    setCategories(response.data || [])
  }

  const fetchSizes = async () => {
    const response = await getSizes()
    setSizes(response.data || [])
  }

  const fetchColors = async () => {
    const response = await getColors()
    setColors(response.data || [])
  }

  const fetchCoupons = async () => {
    const { data } = await getCoupons({ coupon_type: 'ecommerce' })
    setCoupons(data)
  }

  useEffect(() => {
    fetchCategories()
    fetchSizes()
    fetchColors()
    fetchCoupons()
  }, [])

  // Categories CRUD
  const handleAddCategory = () => {
    setEditCategory({ id: 0, name: '' })
    setEditSize(null)
    setEditColor(null)
  }

  const handleEditCategory = (category: Category) => {
    setEditCategory({ ...category })
    setEditSize(null)
    setEditColor(null)
  }

  const handleSaveCategory = async () => {
    if (!editCategory) return
    if (!editCategory.name.trim()) {
      toast.error('Tên phân loại không được để trống')
      return
    }

    try {
      setLoading(true)
      const isNew = editCategory.id === 0
      const response = isNew
        ? await createCategory({ name: editCategory.name })
        : await updateCategory({ name: editCategory.name }, editCategory.id.toString())

      if (response.status === 'success') {
        toast.success(isNew ? 'Thêm phân loại thành công' : 'Cập nhật phân loại thành công')
        fetchCategories()
        setEditCategory(null)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteCategory(id.toString())

      if (response.status === 'success') {
        toast.success('Xoá phân loại thành công')
        fetchCategories()
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  // Size
  const handleAddSize = () => {
    setEditSize({ id: 0, size: '' })
    setEditCategory(null)
    setEditColor(null)
  }

  const handleEditSize = (size: Size) => {
    setEditSize({ ...size })
    setEditCategory(null)
    setEditColor(null)
  }

  const handleSaveSize = async () => {
    if (!editSize) return
    if (!editSize.size.trim()) {
      toast.error('Kích thước không được để trống')
      return
    }

    try {
      setLoading(true)
      const isNew = editSize.id === 0
      const response = isNew
        ? await createSize({ size: editSize.size })
        : await updateSize({ size: editSize.size }, editSize.id.toString())

      if (response.status === 'success') {
        toast.success(isNew ? 'Thêm kích thước thành công' : 'Cập nhật kích thước thành công')
        fetchSizes()
        setEditSize(null)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSize = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteSize(id.toString())

      if (response.status === 'success') {
        toast.success('Xoá kích thước thành công')
        fetchSizes()
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  // Color
  const handleAddColor = () => {
    setEditColor({ id: 0, name: '', hex_code: '#000000' })
    setEditCategory(null)
    setEditSize(null)
  }

  const handleEditColor = (color: Color) => {
    setEditColor({ ...color })
    setEditCategory(null)
    setEditSize(null)
  }

  const handleSaveColor = async () => {
    if (!editColor) return
    if (!editColor.name.trim()) {
      toast.error('Tên màu không được để trống')
      return
    }
    if (!editColor.hex_code.trim()) {
      toast.error('Mã màu không được để trống')
      return
    }

    try {
      setLoading(true)
      const isNew = editColor.id === 0
      const response = isNew
        ? await createColor({ name: editColor.name, hex_code: editColor.hex_code })
        : await updateColor({ name: editColor.name, hex_code: editColor.hex_code }, editColor.id.toString())

      if (response.status === 'success') {
        toast.success(isNew ? 'Thêm màu thành công' : 'Cập nhật màu thành công')
        fetchColors()
        setEditColor(null)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteColor = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteColor(id.toString())

      if (response.status === 'success') {
        toast.success('Xoá màu thành công')
        fetchColors()
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  // Coupon CRUD handlers
  const handleDeleteCoupon = async (id: number) => {
    try {
      const response = await deleteCoupon(id)
      if (response.status === 'success') {
        toast.success('Xoá khuyến mãi thành công')
        fetchCoupons()
      } else {
        toast.error('Có lỗi khi xoá khuyến mãi')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  // Category table columns
  const categoryColumns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
      render: ({ row }) => {
        const isEditing = editCategory?.id === row.id

        return isEditing ? (
          <input
            type="text"
            value={editCategory.name}
            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
            className="w-full px-2 py-1.5 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
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
        const isEditing = editCategory?.id === row.id

        return isEditing ? (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSaveCategory} disabled={loading}>
              <Save className="h-4 w-4 mr-1" /> Lưu
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditCategory(null)} disabled={loading}>
              <X className="h-4 w-4 mr-1" /> Huỷ
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditCategory(row)}
              disabled={loading || !!editCategory || !!editSize || !!editColor}
            >
              <Pencil className="h-4 w-4 mr-1" /> Cập nhật
            </Button>
            <DeleteButton
              text="Xoá"
              size="sm"
              disabled={loading || !!editCategory || !!editSize || !!editColor}
              onConfirm={() => handleDeleteCategory(row.id)}
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
            />
          </div>
        )
      },
    },
  ]

  // Size table columns
  const sizeColumns: ColumnDef<Size>[] = [
    {
      accessorKey: 'size',
      header: 'Kích thước',
      render: ({ row }) => {
        const isEditing = editSize?.id === row.id

        return isEditing ? (
          <input
            type="text"
            value={editSize.size}
            onChange={(e) => setEditSize({ ...editSize, size: e.target.value })}
            className="w-full px-2 py-1.5 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        ) : (
          <span className="block py-1.5 px-2">{row.size}</span>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Thao tác',
      render: ({ row }) => {
        const isEditing = editSize?.id === row.id

        return isEditing ? (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSaveSize} disabled={loading}>
              <Save className="h-4 w-4 mr-1" /> Lưu
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditSize(null)} disabled={loading}>
              <X className="h-4 w-4 mr-1" /> Huỷ
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditSize(row)}
              disabled={loading || !!editCategory || !!editSize || !!editColor}
            >
              <Pencil className="h-4 w-4 mr-1" /> Cập nhật
            </Button>
            <DeleteButton
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
              text="Xoá"
              size="sm"
              disabled={loading || !!editCategory || !!editSize || !!editColor}
              onConfirm={() => handleDeleteSize(row.id)}
            />
          </div>
        )
      },
    },
  ]

  // Color table columns
  const colorColumns: ColumnDef<Color>[] = [
    {
      accessorKey: 'color_preview',
      header: 'Màu',
      render: ({ row }) => {
        return (
          <div className="flex items-center">
            <div
              className="h-6 w-6 rounded-full mr-2 border border-gray-200"
              style={{ backgroundColor: row.hex_code }}
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'Tên màu',
      render: ({ row }) => {
        const isEditing = editColor?.id === row.id

        return isEditing ? (
          <input
            type="text"
            value={editColor.name}
            onChange={(e) => setEditColor({ ...editColor, name: e.target.value })}
            className="w-full px-2 py-1.5 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        ) : (
          <span className="block py-1.5 px-2">{row.name}</span>
        )
      },
    },
    {
      accessorKey: 'hex_code',
      header: 'Mã màu',
      render: ({ row }) => {
        const isEditing = editColor?.id === row.id

        return isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={editColor.hex_code}
              onChange={(e) => setEditColor({ ...editColor, hex_code: e.target.value })}
              className="w-12 h-8 p-0 cursor-pointer"
            />
            <input
              type="text"
              value={editColor.hex_code}
              onChange={(e) => setEditColor({ ...editColor, hex_code: e.target.value })}
              className="w-24 px-2 py-1.5 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ) : (
          <span className="block py-1.5 px-2">{row.hex_code}</span>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Thao tác',
      render: ({ row }) => {
        const isEditing = editColor?.id === row.id

        return isEditing ? (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSaveColor} disabled={loading}>
              <Save className="h-4 w-4 mr-1" /> Lưu
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditColor(null)} disabled={loading}>
              <X className="h-4 w-4 mr-1" /> Huỷ
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditColor(row)}
              disabled={loading || !!editCategory || !!editSize || !!editColor}
            >
              <Pencil className="h-4 w-4 mr-1" /> Cập nhật
            </Button>
            <DeleteButton
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
              text="Xoá"
              size="sm"
              disabled={loading || !!editCategory || !!editSize || !!editColor}
              onConfirm={() => handleDeleteColor(row.id)}
            />
          </div>
        )
      },
    },
  ]

  // Coupon columns
  const handleOpenEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setOpenCouponModal(true)
  }
  const couponHeaderExtraContent = (
    <CreateCouponDialog
      open={openCouponModal}
      setOpen={setOpenCouponModal}
      updateData={fetchCoupons}
      isEdit={!!editingCoupon}
      data={editingCoupon}
      onClose={() => {
        setEditingCoupon(null)
        setOpenCouponModal(false)
      }}
    >
      <AddButton
        text="Thêm khuyến mãi"
        onClick={() => {
          setEditingCoupon(null)
          setOpenCouponModal(true)
        }}
      />
    </CreateCouponDialog>
  )

  // Coupon table columns
  const couponColumns: ColumnDef<Coupon>[] = [
    { accessorKey: 'code', header: 'Mã khuyến mãi' },
    {
      accessorKey: 'discount_type',
      header: 'Loại khuyến mãi',
      render: ({ row }) => (row.discount_type === 'percentage' ? 'Tỷ lệ phần trăm' : 'Số tiền cố định'),
    },
    {
      accessorKey: 'discount_value',
      header: 'Giá trị',
      render: ({ row }) => {
        return row.discount_type === 'percentage'
          ? `${row.discount_value} (%)`
          : `${row.discount_value.toLocaleString()} (đ)`
      },
    },
    {
      accessorKey: 'usage_count',
      header: 'Lượt đã dùng',
    },
    {
      accessorKey: 'max_usage',
      header: 'Lượt dùng tối đa',
      render: ({ row }) => (row.max_usage ? `${row.max_usage}` : 'Unlimited'),
    },
    {
      accessorKey: 'max_usage_per_user',
      header: 'Lượt dùng tối đa mỗi người',
      render: ({ row }) => (row.max_usage_per_user ? `${row.max_usage_per_user}` : 'Unlimited'),
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
            onClick={() => handleOpenEditCoupon(row)}
          >
            <Edit />
          </Button>
          <DeleteButton
            size="icon"
            disabled={loading}
            onConfirm={() => handleDeleteCoupon(row.id)}
            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
          />
        </div>
      ),
    },
  ]

  return (
    <ContentLayout title="Quản lý thuộc tính sản phẩm">
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách phân loại</h2>
        <DataTable
          data={[...categories, ...(editCategory && editCategory.id === 0 ? [editCategory] : [])]}
          columns={categoryColumns}
          headerExtraContent={
            <AddButton
              text="Thêm phân loại"
              onClick={handleAddCategory}
              disabled={!!editCategory || !!editSize || !!editColor}
            />
          }
          searchPlaceholder="Tìm kiếm phân loại..."
          onSelectChange={() => {}}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách kích thước</h2>
        <DataTable
          data={[...sizes, ...(editSize && editSize.id === 0 ? [editSize] : [])]}
          columns={sizeColumns}
          headerExtraContent={
            <AddButton
              text="Thêm kích thước"
              onClick={handleAddSize}
              disabled={!!editCategory || !!editSize || !!editColor}
            />
          }
          searchPlaceholder="Tìm kiếm kích thước..."
          onSelectChange={() => {}}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách màu sắc</h2>
        <DataTable
          data={[...colors, ...(editColor && editColor.id === 0 ? [editColor] : [])]}
          columns={colorColumns}
          headerExtraContent={
            <AddButton
              text="Thêm màu"
              onClick={handleAddColor}
              disabled={!!editCategory || !!editSize || !!editColor}
            />
          }
          searchPlaceholder="Tìm kiếm màu sắc..."
          onSelectChange={() => {}}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Danh sách khuyến mãi</h2>
        <DataTable
          data={coupons}
          columns={couponColumns}
          headerExtraContent={couponHeaderExtraContent}
          searchPlaceholder="Tìm kiếm khuyến mãi..."
          onSelectChange={() => {}}
        />
      </div>
    </ContentLayout>
  )
}

interface CreateCouponDialogProps {
  children: React.ReactNode
  updateData?: () => void
  open: boolean
  setOpen: (open: boolean) => void
  isEdit: boolean
  data: Coupon | null
  onClose: () => void
}

function CreateCouponDialog({ children, updateData, open, setOpen, isEdit, data, onClose }: CreateCouponDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'}</DialogTitle>
        </DialogHeader>
        <EditCouponForm
          data={data}
          onSuccess={() => {
            setOpen(false)
            updateData?.()
            onClose()
          }}
          couponType="ecommerce"
        />
      </DialogContent>
    </Dialog>
  )
}
