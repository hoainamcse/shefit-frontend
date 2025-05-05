'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
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
import { getProducts, getCategories, getColors, getSizes, deleteProduct } from '@/network/server/products'
import { Copy, Edit, Ellipsis, Eye, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Color {
  id: number
  name: string
  hex_code: string
}

interface Size {
  id: number
  size: string
}

interface ProductRow {
  id: number
  name: string
  price: number
  sizes: Size[]
  colors: Color[]
  category_name: string
  image_url: string
}

export default function ProductsPage() {
  const [productTable, setProductTable] = useState<ProductRow[]>([])
  const router = useRouter()

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, colorsRes, sizesRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getColors(),
        getSizes(),
      ])

      const products = productsRes.data
      const categories = categoriesRes.data
      const colors = colorsRes.data
      const sizes = sizesRes.data

      const tableData = products.map((product) => {
        const sizesArr: Size[] = []
        const colorsArr: Color[] = []

        product.variants.forEach((variant) => {
          const sizeObj = sizes.find((s) => s.id === variant.size_id)
          if (sizeObj && !sizesArr.some((s) => s.id === sizeObj.id)) {
            sizesArr.push(sizeObj)
          }
          const colorObj = colors.find((c) => c.id === variant.color_id)
          if (colorObj && !colorsArr.some((c) => c.id === colorObj.id)) {
            colorsArr.push(colorObj)
          }
        })

        const categoryObj = categories.find((cat) => cat.id === product.category_id)
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          sizes: sizesArr,
          colors: colorsArr,
          category_name: categoryObj ? categoryObj.name : '',
          image_url: product.image_urls[0] || '',
        }
      })
      setProductTable(tableData)
    } catch (e) {
      setProductTable([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      try {
        const res = await deleteProduct(id.toString())
        if (res.status === 'success') {
          toast.success('Xoá sản phẩm thành công')
          fetchData()
        }
      } catch (e) {
        toast.error('Có lỗi khi xoá sản phẩm')
      }
    }
  }

  const columns: ColumnDef<ProductRow>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'price',
      header: 'Giá',
      render: ({ row }) => <span>{row.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
    },
    {
      accessorKey: 'sizes',
      header: 'Kích thước',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.sizes.map((size) => (
            <Badge key={size.id} variant="secondary">
              {size.size}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'colors',
      header: 'Màu sắc',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.colors.map((color) => (
            <Badge key={color.id} style={{ backgroundColor: color.hex_code }}>
              {color.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'category_name',
      header: 'Phân loại',
    },
    {
      accessorKey: 'image_url',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.image_url} alt={`${row.name} thumbnail`} className="h-24 w-24 rounded-lg object-cover" />
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
              <Copy /> Sao chép sản phẩm ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <Eye /> Xem
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => router.push(`/admin/products/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(row.id)}>
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const headerExtraContent = <AddButton text="Thêm sản phẩm" onClick={() => router.push('/admin/products/create')} />

  return (
    <ContentLayout title="Sản phẩm">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={productTable}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
