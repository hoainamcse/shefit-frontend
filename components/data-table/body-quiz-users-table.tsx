'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { BodyQuizUser } from '@/models/body-quiz'

import { toast } from 'sonner'
import { format } from 'date-fns'
import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getBodyQuizUsers, getUserBodyQuizzes, queryKeyBodyQuizUsers } from '@/network/client/body-quizzes'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { MainButton } from '../buttons/main-button'

export function BodyQuizUsersTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeyBodyQuizUsers, pagination],
    queryFn: () => getBodyQuizUsers({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<BodyQuizUser>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: 'Tên người dùng',
        accessorKey: 'fullname',
        cell: ({ row }) => <div className="font-medium">{row.getValue('fullname')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Username',
        accessorKey: 'user_name',
        size: 180,
      },
      {
        header: 'Số điện thoại',
        accessorKey: 'telephone_number',
        size: 180,
      },
      {
        header: 'Số quiz đã làm',
        accessorKey: 'num_quizzes_done',
        size: 180,
      },
      {
        header: 'Số quiz được nhận xét',
        accessorKey: 'num_quizzes_commented',
        size: 180,
      },
      {
        header: 'Lần làm quiz gần nhất',
        accessorKey: 'last_done',
        cell: ({ row }) => format(row.getValue('last_done'), 'Pp'),
        size: 180,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
        enableHiding: false,
      },
    ],
    []
  )

  const router = useRouter()

  const onEditRow = (row: BodyQuizUser) => {
    router.push(`/admin/users/${row.id}/quizzes`)
  }

  const onDeleteRow = (row: BodyQuizUser) => {
    toast.warning('Chức năng xóa người dùng chưa được triển khai')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    )
  }

  return (
    <DataTable
      data={data?.data}
      columns={columns}
      state={{ pagination }}
      rowCount={data?.paging.total}
      onPaginationChange={setPagination}
      rightSection={
        <ExportDialog data={data?.data} onSuccess={() => toast.success('Đã xuất danh sách người dùng thành công')} />
      }
    />
  )
}

function ExportDialog({ data, onSuccess }: { data?: BodyQuizUser[]; onSuccess?: () => void }) {
  if (!data) return null

  const [isPending, setIsPending] = useState(false)

  const onSubmit = async () => {
    setIsPending(true)
    try {
      const res = await Promise.all(data.map((user) => getUserBodyQuizzes(user.id)))
      const _data = res.flatMap((quiz) => quiz.data)
      const exportedData = _data.map((item) => {
        return {
          user_id: item.user_id,
          fullname: data.find((user) => user.id === item.user_id)?.fullname || 'N/A',
          username: data.find((user) => user.id === item.user_id)?.user_name || 'N/A',
          telephone_number: data.find((user) => user.id === item.user_id)?.telephone_number || 'N/A',
          body_quiz_id: item.body_quiz.id,
          body_quiz_title: item.body_quiz.title,
          submitted_at: format(new Date(item.quiz_date), 'Pp'),
          responses: item.responses.join(', '),
          comment: item.comment,
        }
      })

      // Using xlsx to create an Excel file
      const XLSX = require('xlsx')
      const worksheet = XLSX.utils.json_to_sheet(exportedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Body Quiz Users')

      // Download the file
      const fileName = `body_quiz_users_${new Date().toISOString()}.xlsx`
      XLSX.writeFile(workbook, fileName)
      onSuccess?.()
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xuất danh sách người dùng')
    } finally {
      setIsPending(false)
    }
  }

  return <MainButton text="Xuất danh sách" icon={Download} variant="outline" onClick={onSubmit} loading={isPending} />
}
