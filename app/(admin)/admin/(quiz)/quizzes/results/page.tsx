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
import { formatDateString } from '@/lib/utils'
import UserBodyQuizz from '@/models/user-body-quizz'
import { getAllUserBodyQuizzes } from '@/network/server/user-body-quizz'
import { Copy, Edit, Ellipsis, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// type QuizResult = {
//   id: string
//   name: string
//   phone_number: string
//   comment: string
//   num_completed: number
//   createdAt: string
//   updatedAt: string
// }

// const quizResults: QuizResult[] = [
//   {
//     id: '1',
//     name: 'Nguyễn Văn A',
//     phone_number: '0909090909',
//     comment: 'Cần tập nhiều kháng lực hơn',
//     num_completed: 10,
//     createdAt: '2025-03-26',
//     updatedAt: '2025-03-26',
//   },
//   {
//     id: '2',
//     name: 'Nguyễn Văn B',
//     phone_number: '0909090909',
//     comment: 'Cần tập nhiều kháng lực hơn',
//     num_completed: 10,
//     createdAt: '2025-03-26',
//     updatedAt: '2025-03-26',
//   },
//   {
//     id: '3',
//     name: 'Nguyễn Văn C',
//     phone_number: '0909090909',
//     comment: 'Cần tập nhiều kháng lực hơn',
//     num_completed: 10,
//     createdAt: '2025-03-26',
//     updatedAt: '2025-03-26',
//   },
//   {
//     id: '4',
//     name: 'Nguyễn Văn D',
//     phone_number: '0909090909',
//     comment: 'Cần tập nhiều kháng lực hơn',
//     num_completed: 10,
//     createdAt: '2025-03-26',
//     updatedAt: '2025-03-26',
//   },
//   {
//     id: '5',
//     name: 'Nguyễn Văn E',
//     phone_number: '0909090909',
//     comment: 'Cần tập nhiều kháng lực hơn',
//     num_completed: 10,
//     createdAt: '2025-03-26',
//     updatedAt: '2025-03-26',
//   },
//   {
//     id: '6',
//     name: 'Nguyễn Văn F',
//     phone_number: '0909090909',
//     comment: 'Cần tập nhiều kháng lực hơn',
//     num_completed: 10,
//     createdAt: '2025-03-26',
//     updatedAt: '2025-03-26',
//   },
// ]

export default function QuizResultsPage() {
  const [quizResults, setQuizResults] = useState<UserBodyQuizz[]>([])
  const router = useRouter()

  const fetchData = async () => {
    const response = await getAllUserBodyQuizzes()
    const mapped = (response.data || []).map((item: any) => {
      return {
        ...item,
        created_at: formatDateString(item.created_at),
        updated_at: formatDateString(item.updated_at),
      }
    })
    setQuizResults(mapped)
  }
  const columns: ColumnDef<UserBodyQuizz>[] = [
    {
      accessorKey: 'user_name',
      header: 'Tên',
    },
    {
      accessorKey: 'telephone_number',
      header: 'SĐT',
    },
    {
      accessorKey: 'comment',
      header: 'Nhận xét',
    },
    {
      accessorKey: 'created_at',
      header: 'Ngày tham gia',
    },
    {
      accessorKey: 'updated_at',
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
            <DropdownMenuItem onClick={() => router.push(`/admin/quizzes/results/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            {/* <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 /> Xoá
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

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
