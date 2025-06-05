'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Course, CourseForm, CourseFormat, CourseLevel } from '@/models/course'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteCourse, getCourses, queryKeyCourses } from '@/network/client/courses'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { courseFormLabel, courseLevelLabel } from '@/lib/label'

// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { AddButton } from '../buttons/add-button'
import { Badge } from '../ui/badge'

interface CoursesTableProps {
  courseFormat?: CourseFormat
  isOneOnOne?: boolean
}

export function CoursesTable({ courseFormat, isOneOnOne = false }: CoursesTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyCourses, { ...pagination, courseFormat, isOneOnOne }],
    queryFn: () =>
      getCourses({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        ...(courseFormat ? { course_format: courseFormat } : {}),
        is_one_on_one: isOneOnOne,
      }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Course>[]>(
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
        header: 'Tên khoá tập',
        accessorKey: 'course_name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('course_name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'HLV',
        accessorKey: 'trainer',
        size: 180,
      },
      {
        header: 'Phom dáng',
        accessorKey: 'form_categories',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.form_categories.map((fc) => (
              <Badge key={fc} variant="outline" className={getFormColor(fc)}>
                {courseFormLabel[fc]}
              </Badge>
            ))}
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
      {
        header: 'Gói tập',
        accessorKey: 'subscriptions',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.subscriptions.map((s) => (
              <Badge key={s.id} variant="outline">
                {s.name}
              </Badge>
            ))}
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
      {
        header: 'Độ khó',
        accessorKey: 'difficulty_level',
        cell: ({ row }) => (
          <Badge variant="outline" className={getLevelColor(row.getValue('difficulty_level'))}>
            {courseLevelLabel[row.getValue('difficulty_level') as CourseLevel]}
          </Badge>
        ),
        size: 180,
        enableSorting: false,
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

  const onAddRow = () => {
    router.push(
      `/admin/courses/create?${courseFormat ? `course_format=${courseFormat}&` : ''}is_one_on_one=${isOneOnOne}`
    )
  }

  const onEditRow = (row: Course) => {
    router.push(`/admin/${row.course_format}-classes/${row.id}`)
  }

  const onDeleteRow = async (row: Course) => {
    const deletePromise = () => deleteCourse(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá khoá tập thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
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
      rightSection={<AddButton text="Thêm khoá tập" onClick={onAddRow} />}
    />
  )
}

const getFormColor = (courseForm: CourseForm) => {
  switch (courseForm) {
    case 'pear':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'apple':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'rectangle':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'hourglass':
      return 'bg-rose-100 text-rose-800 border-rose-200'
    case 'inverted_triangle':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getLevelColor = (level: CourseLevel) => {
  switch (level) {
    case 'beginner':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'advanced':
      return 'bg-pink-100 text-pink-800 border-pink-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
