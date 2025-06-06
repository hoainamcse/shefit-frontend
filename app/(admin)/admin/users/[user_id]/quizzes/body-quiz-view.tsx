'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { BodyQuizUser, UserBodyQuiz } from '@/models/body-quiz'

import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { getUserBodyQuizzes, queryKeyUserBodyQuizzes, updateUserBodyQuiz } from '@/network/client/body-quizzes'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { EditSheet } from '@/components/data-table/edit-sheet'
import { FormTextareaField } from '@/components/forms/fields'
import { MainButton } from '@/components/buttons/main-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { Form } from '@/components/ui/form'

interface BodyQuizViewProps {
  userID: BodyQuizUser['id']
}

export function UserBodyQuizzesTable({ userID }: BodyQuizViewProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyUserBodyQuizzes, { ...pagination, userID }],
    queryFn: () => getUserBodyQuizzes(userID, { page: pagination.pageIndex, per_page: pagination.pageSize }),
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
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: 'Username',
        accessorKey: 'user_name',
        cell: ({ row }) => (
          <div className="font-medium">
            <a
              href={`/admin/users/${row.original.user_id}`}
              className="hover:underline underline-offset-2"
              target="_blank"
            >
              {row.getValue('user_name')}
            </a>
          </div>
        ),
        size: 120,
        enableHiding: false,
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
        header: 'Phản hồi',
        accessorKey: 'responses',
        cell: ({ row }) => row.original.responses.join('; '),
        size: 180,
      },
      {
        header: 'Nhận xét',
        accessorKey: 'comment',
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
      <EditSheet
        title="Chỉnh sửa kết quả quiz"
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        {selectedRow && <EditUserBodyQuizForm data={selectedRow} onSuccess={onEditSuccess} />}
      </EditSheet>
    </>
  )
}

// ! Follow UserBodyQuizPayload model in models/body-quiz.ts
const formSchema = z.object({
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
    defaultValues: { comment: data.comment || '' },
  })

  const equipmentMutation = useMutation({
    mutationFn: (values: FormValue) => updateUserBodyQuiz(data.id, { ...data, ...values }),
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
        <FormTextareaField form={form} name="comment" label="Nhận xét" placeholder="Nhập nhận xét" />
        <div className="flex justify-end">
          {form.formState.isDirty && <MainButton text="Cập nhật" loading={equipmentMutation.isPending} />}
        </div>
      </form>
    </Form>
  )
}
