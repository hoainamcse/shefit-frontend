'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Exercise } from '@/models/exercise'

import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  deleteBulkExercise,
  deleteExercise,
  getExercises,
  importExerciseExcel,
  queryKeyExercises,
} from '@/network/client/exercises'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getMuscleGroups, queryKeyMuscleGroups } from '@/network/client/muscle-groups'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { Spinner } from '@/components/spinner'
import { useDebounce } from '@/hooks/use-debounce'
import { EditExerciseForm } from '../forms/edit-exercise-form'
import { AddButton } from '../buttons/add-button'
import { EditSheet } from './edit-sheet'
import { Badge } from '../ui/badge'
import { MainButton } from '../buttons/main-button'
import { ExcelImportDialog } from '../excel-import-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface ExercisesTableProps {
  onConfirmRowSelection?: (selectedRows: Exercise[]) => void
}

export function ExercisesTable({ onConfirmRowSelection }: ExercisesTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | undefined>(undefined)
  const [rowSelection, setRowSelection] = useState<Exercise[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      queryKeyExercises,
      {
        ...pagination,
        ...(debouncedSearchQuery ? { name: debouncedSearchQuery } : {}),
        ...(selectedMuscleGroup ? { muscle_group_id: Number(selectedMuscleGroup) } : {}),
      },
    ],
    queryFn: () =>
      getExercises({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        ...(debouncedSearchQuery ? { name: debouncedSearchQuery } : {}),
        ...(selectedMuscleGroup ? { muscle_group_id: Number(selectedMuscleGroup) } : {}),
      }),
    placeholderData: keepPreviousData,
  })

  const muscleGroupsQuery = useQuery({
    queryKey: [queryKeyMuscleGroups],
    queryFn: () => getMuscleGroups(),
  })

  const columns = useMemo<ColumnDef<Exercise>[]>(
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
        header: 'Tên động tác',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Mô tả',
        accessorKey: 'description',
        size: 180,
      },
      {
        header: 'Nhóm cơ',
        accessorKey: 'muscle_groups',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.muscle_groups.map((muscleGroup) => (
              <Badge key={muscleGroup.id} variant="outline">
                {muscleGroup.name}
              </Badge>
            ))}
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
      {
        header: 'Dụng cụ',
        accessorKey: 'equipments',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.equipments.map((equipment) => (
              <Badge key={equipment.id} variant="outline">
                {equipment.name}
              </Badge>
            ))}
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
      {
        header: 'Video',
        accessorKey: 'youtube_url',
        cell: ({ row }) => {
          const thumbnail = getYouTubeThumbnail(row.getValue('youtube_url'))
          return (
            <a href={row.getValue('youtube_url')} target="_blank">
              <img
                src={thumbnail || 'https://placehold.co/400?text=shefit.vn&font=Oswald'}
                alt={`${row.getValue('name')} thumbnail`}
                className="h-16 rounded-md object-cover"
              />
            </a>
          )
        },
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

  const [selectedRow, setSelectedRow] = useState<Exercise | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Exercise) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Exercise) => {
    const deletePromise = () => deleteExercise(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá động tác thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Exercise[]) => {
    const deletePromise = () => deleteBulkExercise(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá động tác thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
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

  const isEdit = !!selectedRow

  return (
    <>
      <DataTable
        data={data?.data}
        columns={columns}
        state={{ pagination }}
        rowCount={data?.paging.total}
        onDelete={onDeleteRows}
        onPaginationChange={setPagination}
        onRowSelectionChange={setRowSelection}
        leftSection={
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Input
                placeholder="Nhập tên động tác"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8"
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>
            <Select
              value={selectedMuscleGroup || ''}
              onValueChange={(value) => setSelectedMuscleGroup(value || undefined)}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Chọn nhóm cơ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {muscleGroupsQuery.data?.data.map((mg) => (
                    <SelectItem key={mg.id} value={String(mg.id)}>
                      {mg.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {selectedMuscleGroup && (
                  <>
                    <SelectSeparator />
                    <Button
                      className="w-full px-2"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedMuscleGroup(undefined)
                      }}
                    >
                      Bỏ chọn
                    </Button>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        }
        rightSection={
          <>
            {onConfirmRowSelection && (
              <MainButton
                variant="outline"
                text={`Chọn ${rowSelection.length} động tác`}
                onClick={() => {
                  if (rowSelection.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một động tác')
                    return
                  }
                  onConfirmRowSelection(rowSelection)
                }}
              />
            )}
            <AddButton text="Thêm động tác" onClick={onAddRow} />
            <ExcelImportDialog
              title="Động tác"
              handleSubmit={async (file: File) => {
                await importExerciseExcel(file)
                refetch()
              }}
            />
          </>
        }
      />
      <EditSheet
        title={isEdit ? 'Chỉnh sửa động tác' : 'Thêm động tác'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditExerciseForm data={selectedRow} onSuccess={onEditSuccess} />
      </EditSheet>
    </>
  )
}
