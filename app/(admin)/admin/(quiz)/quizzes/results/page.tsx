'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, Edit, Ellipsis, Trash2 } from 'lucide-react'

type QuizResult = {
  id: string
  name: string
  phone_number: string
  comment: string
  num_completed: number
  createdAt: string
  updatedAt: string
}

const quizResults: QuizResult[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone_number: '0909090909',
    comment: 'Cần tập nhiều kháng lực hơn',
    num_completed: 10,
    createdAt: '2025-03-26',
    updatedAt: '2025-03-26',
  },
  {
    id: '2',
    name: 'Nguyễn Văn B',
    phone_number: '0909090909',
    comment: 'Cần tập nhiều kháng lực hơn',
    num_completed: 10,
    createdAt: '2025-03-26',
    updatedAt: '2025-03-26',
  },
  {
    id: '3',
    name: 'Nguyễn Văn C',
    phone_number: '0909090909',
    comment: 'Cần tập nhiều kháng lực hơn',
    num_completed: 10,
    createdAt: '2025-03-26',
    updatedAt: '2025-03-26',
  },
  {
    id: '4',
    name: 'Nguyễn Văn D',
    phone_number: '0909090909',
    comment: 'Cần tập nhiều kháng lực hơn',
    num_completed: 10,
    createdAt: '2025-03-26',
    updatedAt: '2025-03-26',
  },
  {
    id: '5',
    name: 'Nguyễn Văn E',
    phone_number: '0909090909',
    comment: 'Cần tập nhiều kháng lực hơn',
    num_completed: 10,
    createdAt: '2025-03-26',
    updatedAt: '2025-03-26',
  },
  {
    id: '6',
    name: 'Nguyễn Văn F',
    phone_number: '0909090909',
    comment: 'Cần tập nhiều kháng lực hơn',
    num_completed: 10,
    createdAt: '2025-03-26',
    updatedAt: '2025-03-26',
  },
]

export default function QuizResultsPage() {
  const columns: ColumnDef<QuizResult>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
    },
    {
      accessorKey: 'phone_number',
      header: 'SĐT',
    },
    {
      accessorKey: 'comment',
      header: 'Nhận xét',
    },
    {
      accessorKey: 'num_completed',
      header: 'Số lần đã làm',
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tham gia',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Ngày cập nhật',
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
              <Copy /> Sao chép kết quả ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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

  return (
    <ContentLayout title="Kết quả quiz">
      <DataTable
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={quizResults}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
