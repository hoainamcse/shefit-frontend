'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { BodyQuizUser, UserBodyQuiz } from '@/models/body-quiz'

import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { getBodyQuizzesHistoryByUser, queryKeyBodyQuizzes, updateBodyQuizHistory } from '@/network/client/body-quizzes'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { SheetEdit } from '@/components/dialogs/sheet-edit'
import { FormRichTextField } from '@/components/forms/fields'
import { MainButton } from '@/components/buttons/main-button'
import { queryKeyUsers } from '@/network/client/users'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { Form } from '@/components/ui/form'
import { htmlToText } from '@/utils/helpers'

interface BodyQuizViewProps {
  userId: BodyQuizUser['id']
}

export function UserBodyQuizzesTable({ userId }: BodyQuizViewProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyUsers, userId, queryKeyBodyQuizzes, 'attempts', { ...pagination, userID: userId }],
    queryFn: () => getBodyQuizzesHistoryByUser(userId, { page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<UserBodyQuiz>[]>(
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
      },
      {
        header: 'Tên đây đủ',
        accessorFn: (row) => row.user?.fullname,
        cell: ({ row }) => (
          <div className="font-medium">
            <a
              href={`/admin/users/${row.original.user.id}`}
              className="hover:underline underline-offset-2"
              target="_blank"
            >
              {row.original.user.fullname}
            </a>
          </div>
        ),
        size: 120,
      },
      {
        header: 'Quiz',
        accessorFn: (row) => row.body_quiz?.title,
        cell: ({ row }) => (
          <div>
            <a
              href={`/admin/quizzes/${row.original.body_quiz.id}`}
              className="hover:underline underline-offset-2"
              target="_blank"
            >
              {row.original.body_quiz.title}
            </a>
          </div>
        ),
        size: 120,
      },
      {
        header: 'Ngày làm',
        accessorKey: 'quiz_date',
        cell: ({ row }) => format(row.getValue('quiz_date'), 'Pp'),
        size: 180,
      },
      {
        header: 'Câu trả lời',
        accessorKey: 'responses',
        cell: ({ row }) => (
          <a href={`/quizzes/${row.original.id}/result`} target="_blank">
            Xem trả lời
          </a>
        ),
        size: 180,
      },
      {
        header: 'Nhận xét',
        accessorKey: 'comment',
        cell: ({ row }) => htmlToText(row.getValue('comment') || ''),
        size: 180,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
      },
    ],
    []
  )

  const [selectedRow, setSelectedRow] = useState<UserBodyQuiz | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onEditRow = (row: UserBodyQuiz) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: UserBodyQuiz) => {
    toast.warning('Chức năng xóa kết quả quiz chưa được triển khai')
  }

  const onEditSuccess = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(false)
    refetch()
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
    <>
      <DataTable
        data={data?.data}
        columns={columns}
        state={{ pagination }}
        rowCount={data?.paging.total}
        onPaginationChange={setPagination}
      />
      <SheetEdit
        title="Chỉnh sửa kết quả quiz"
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        {selectedRow && <EditUserBodyQuizForm data={selectedRow} onSuccess={onEditSuccess} />}
      </SheetEdit>
    </>
  )
}

// ! Follow UserBodyQuizPayload model in models/body-quiz.ts
const formSchema = z.object({
  user_id: z.number(),
  body_quiz_id: z.number(),
  quiz_date: z.string(),
  responses: z.array(z.string()),
  comment: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface EditUserBodyQuizFormProps {
  data: UserBodyQuiz
  onSuccess?: () => void
}

function EditUserBodyQuizForm({ data, onSuccess }: EditUserBodyQuizFormProps) {
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: data.user.id,
      body_quiz_id: data.body_quiz.id,
      quiz_date: data.quiz_date,
      responses: data.responses || [],
      comment: data.comment || '',
    },
  })

  const equipmentMutation = useMutation({
    mutationFn: (values: FormValue) => updateBodyQuizHistory(data.id, { ...values }),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success('Cập nhật kết quả quiz thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    equipmentMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormRichTextField form={form} name="comment" label="Nhận xét" placeholder="Nhập nhận xét" />
        <div className="flex justify-end">
          {form.formState.isDirty && <MainButton text="Cập nhật" loading={equipmentMutation.isPending} />}
        </div>
      </form>
    </Form>
  )
}
