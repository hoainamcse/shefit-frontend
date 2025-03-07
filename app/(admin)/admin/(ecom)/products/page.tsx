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
import { Copy, Edit, Ellipsis, Eye, Trash2 } from 'lucide-react'

type Color = {
  id: string
  name: string
  code: string
}

type Product = {
  id: string
  name: string
  price: number
  sizes: string[]
  colors: Color[]
  category: string
  images: string[]
}

const products: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 10000,
    sizes: ['S', 'M', 'L'],
    colors: [
      {
        id: '1',
        name: 'Red',
        code: '#ff8787',
      },
      {
        id: '2',
        name: 'Green',
        code: '#38d9a9',
      },
      {
        id: '3',
        name: 'Blue',
        code: '#4dabf7',
      },
    ],
    category: 'Clothing',
    images: ['https://m.media-amazon.com/images/I/81RE9EBCagL._AC_UF1000,1000_QL80_.jpg'],
  },
  {
    id: '2',
    name: 'Product 2',
    price: 20000,
    sizes: ['S', 'M', 'L'],
    colors: [
      {
        id: '1',
        name: 'Red',
        code: '#ff8787',
      },
      {
        id: '2',
        name: 'Green',
        code: '#38d9a9',
      },
      {
        id: '3',
        name: 'Blue',
        code: '#4dabf7',
      },
    ],
    category: 'Clothing',
    images: ['https://m.media-amazon.com/images/I/81RE9EBCagL._AC_UF1000,1000_QL80_.jpg'],
  },
  {
    id: '3',
    name: 'Product 3',
    price: 30000,
    sizes: ['S', 'M', 'L'],
    colors: [
      {
        id: '1',
        name: 'Red',
        code: '#ff8787',
      },
      {
        id: '2',
        name: 'Green',
        code: '#38d9a9',
      },
      {
        id: '3',
        name: 'Blue',
        code: '#4dabf7',
      },
    ],
    category: 'Clothing',
    images: ['https://m.media-amazon.com/images/I/81RE9EBCagL._AC_UF1000,1000_QL80_.jpg'],
  },
  {
    id: '4',
    name: 'Product 4',
    price: 40000,
    sizes: ['S', 'M', 'L'],
    colors: [
      {
        id: '1',
        name: 'Red',
        code: '#ff8787',
      },
      {
        id: '2',
        name: 'Green',
        code: '#38d9a9',
      },
      {
        id: '3',
        name: 'Blue',
        code: '#4dabf7',
      },
    ],
    category: 'Clothing',
    images: ['https://m.media-amazon.com/images/I/81RE9EBCagL._AC_UF1000,1000_QL80_.jpg'],
  },
  {
    id: '5',
    name: 'Product 5',
    price: 50000,
    sizes: ['S', 'M', 'L'],
    colors: [
      {
        id: '1',
        name: 'Red',
        code: '#ff8787',
      },
      {
        id: '2',
        name: 'Green',
        code: '#38d9a9',
      },
      {
        id: '3',
        name: 'Blue',
        code: '#4dabf7',
      },
    ],
    category: 'Clothing',
    images: ['https://m.media-amazon.com/images/I/81RE9EBCagL._AC_UF1000,1000_QL80_.jpg'],
  },
]

export default function ProductsPage() {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'price',
      header: 'Giá',
      render: ({ row }) => <span>đ{row.price.toLocaleString('vi-VN')}</span>,
    },
    {
      accessorKey: 'sizes',
      header: 'Kích thước',
      render: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.sizes.map((size) => (
            <Badge key={size} variant="secondary">
              {size}
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
            <Badge key={color.id} style={{ backgroundColor: color.code }}>
              {color.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Phân loại',
    },
    {
      accessorKey: 'images',
      header: 'Hình ảnh',
      render: ({ row }) => {
        return <img src={row.images[0]} alt={`${row.name} thumbnail`} className="h-12 rounded" />
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

  const headerExtraContent = <AddButton text="Thêm sản phẩm" />

  return (
    <ContentLayout title="Sản phẩm">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={products}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
