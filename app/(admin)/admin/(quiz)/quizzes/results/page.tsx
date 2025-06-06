'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
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
import { formatDateString } from '@/lib/helpers'
import { UserBodyQuizz } from '@/models/user-body-quizz'
import { getAllUserBodyQuizzes, getListUserBodyQuizzes, getListUserBodyQuizById } from '@/network/server/user-body-quizz'
import { toast } from 'sonner'
import { Copy, Edit, Ellipsis, FolderDown, Trash2 } from 'lucide-react'
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
  const [isExporting, setIsExporting] = useState(false)
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

  const handleExportCsv = async () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('access_token') || ''
    const summaryResponse = await getListUserBodyQuizzes()
    const summaries = summaryResponse.data || []
    if (summaries.length === 0) {
      toast.info('Không có dữ liệu để xuất.')
      return
    }
    try {
      setIsExporting(true)
      const headers = ['user_id','user_name','full_name','telephone_number','body_quiz_id','quiz_date','responses','comment']
      const csvRows = [headers.join(',')]
      for (const summary of summaries) {
        const userId = summary.id.toString()
        let quizzesResponse
        try {
          quizzesResponse = await getListUserBodyQuizById(userId, token)
        } catch (error) {
          console.error(`Error fetching quizzes for user ${userId}:`, error)
          continue
        }
        const quizzes = quizzesResponse.data || []
        if (quizzes.length) {
          quizzes.forEach((quiz, index) => {
            const row = [
              index === 0 ? userId : '',
              index === 0 ? summary.user_name : '',
              index === 0 ? summary.fullname : '',
              index === 0 ? summary.telephone_number : '',
              quiz.body_quiz_id.toString(),
              formatDateString(quiz.quiz_date),
              quiz.responses.join('; '),
              quiz.comment,
            ]
            csvRows.push(row.map((f) => `"${f}"`).join(','))
          })
        } else {
          const row = [userId, summary.user_name, summary.fullname, summary.telephone_number, '', '', '', '']
          csvRows.push(row.map((f) => `"${f}"`).join(','))
        }
      }
      const csvString = csvRows.join('\n')
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'user_body_quizzes.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Dữ liệu đã được xuất thành công!')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Có lỗi khi xuất dữ liệu')
    } finally {
      setIsExporting(false)
    }
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
        headerExtraContent={
          <MainButton variant="outline" text="Xuất dữ liệu" onClick={handleExportCsv} icon={FolderDown} loading={isExporting} />
        }
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
