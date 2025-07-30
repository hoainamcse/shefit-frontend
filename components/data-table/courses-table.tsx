'use client'

import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table'
import type { Course, CourseForm, CourseFormat, CourseLevel } from '@/models/course'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  deleteBulkCourse,
  deleteCourse,
  duplicateCourse,
  getCourses,
  queryKeyCourses,
  updateCourseDisplayOrder,
} from '@/network/client/courses'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { courseFormLabel, courseLevelLabel } from '@/lib/label'

// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Check, Edit, X } from 'lucide-react'
import { Input } from '../ui/input'

interface CoursesTableProps {
  courseFormat?: CourseFormat
  isOneOnOne?: boolean
  onConfirmRowSelection?: (selectedRows: Course[]) => void
}

interface EditingState {
  [key: string]: {
    isEditing: boolean
    value: number
    originalValue: number
  }
}

export function CoursesTable({ courseFormat, isOneOnOne = false, onConfirmRowSelection }: CoursesTableProps) {
  const searchParams = useSearchParams()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [editingState, setEditingState] = useState<EditingState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyCourses, { ...pagination, courseFormat, isOneOnOne }],
    queryFn: () =>
      getCourses({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        ...(courseFormat ? { course_format: courseFormat } : {}),
        is_one_on_one: isOneOnOne,
        sort_by: 'display_order',
        sort_order: 'asc',
      }),
    placeholderData: keepPreviousData,
  })

  const handleEditDisplayOrder = (courseId: string, currentValue: number) => {
    setEditingState((prev) => ({
      ...prev,
      [courseId]: {
        isEditing: true,
        value: currentValue || 0,
        originalValue: currentValue,
      },
    }))
  }

  const handleCancelEdit = (courseId: string) => {
    setEditingState((prev) => {
      const newState = { ...prev }
      delete newState[courseId]
      return newState
    })
  }

  const handleSaveDisplayOrder = async (courseId: string) => {
    const editState = editingState[courseId]
    if (!editState) return

    const newValue = editState.value
    if (isNaN(newValue) || newValue < 0) {
      toast.error('Vui lòng nhập số hợp lệ (≥ 0)')
      return
    }

    try {
      await updateCourseDisplayOrder(Number(courseId), newValue)

      setEditingState((prev) => {
        const newState = { ...prev }
        delete newState[courseId]
        return newState
      })

      refetch()
      toast.success('Cập nhật STT thành công')
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi cập nhật')
    }
  }

  const handleInputChange = (mealPlanId: string, value: number) => {
    setEditingState((prev) => ({
      ...prev,
      [mealPlanId]: {
        ...prev[mealPlanId],
        value,
      },
    }))
  }

  const columns = useMemo<ColumnDef<Course>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
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
        header: 'STT',
        accessorKey: 'display_order',
        cell: ({ row }) => {
          const course = row.original
          const editState = editingState[course.id]
          const displayOrder = row.getValue('display_order') as number

          if (editState?.isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={editState.value}
                  onChange={(e) => handleInputChange(course.id.toString(), Number(e.target.value))}
                  className="w-20 h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  onClick={() => handleSaveDisplayOrder(course.id.toString())}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  onClick={() => handleCancelEdit(course.id.toString())}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          }

          return (
            <div className="flex items-center px-3 gap-3 group">
              <span className="font-medium">{displayOrder || 0}</span>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditDisplayOrder(course.id.toString(), displayOrder)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )
        },
        size: 140,
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
            {row.original.form_categories.map((c) => (
              <Badge key={c.id} variant="outline">
                {c.name}
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
        cell: ({ row }) => (
          <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} onDuplicate={onDuplicateRow} />
        ),
        size: 60,
        enableHiding: false,
      },
    ],
    [editingState]
  )

  const router = useRouter()

  const onAddRow = () => {
    router.push(`/admin/courses/create?${searchParams?.toString()}`)
  }

  const onEditRow = (row: Course) => {
    router.push(`/admin/courses/${row.id}`)
  }

  const onDuplicateRow = (row: Course) => {
    const duplicatePromise = () => duplicateCourse(row.id)

    toast.promise(duplicatePromise, {
      loading: 'Đang nhân bản...',
      success: (_) => {
        refetch()
        return 'Nhân bản khoá tập thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
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

  const onDeleteRows = async (selectedRows: Course[]) => {
    const deletePromise = () => deleteBulkCourse(selectedRows.map((row) => row.id))

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
      state={{ pagination, rowSelection }}
      rowCount={data?.paging.total}
      onDelete={onDeleteRows}
      onPaginationChange={setPagination}
      onRowSelectionChange={setRowSelection}
      rightSection={
        <>
          {onConfirmRowSelection && (
            <MainButton
              variant="outline"
              text={`Chọn ${Object.keys(rowSelection).length} khoá tập`}
              onClick={() => {
                const selectedRows = Object.keys(rowSelection).map((key) => data?.data?.[Number(key)])
                if (selectedRows.length === 0) {
                  toast.error('Vui lòng chọn ít nhất một khoá tập')
                  return
                }
                onConfirmRowSelection(selectedRows.filter((row): row is Course => !!row))
              }}
            />
          )}
          <AddButton text="Thêm khoá tập" onClick={onAddRow} />
        </>
      }
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
