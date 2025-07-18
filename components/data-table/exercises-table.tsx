'use client'

import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table'
import type { Exercise } from '@/models/exercise'

import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  deleteBulkExercise,
  deleteExercise,
  getExercises,
  importExerciseExcel,
  queryKeyExercises,
} from '@/network/client/exercises'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { Spinner } from '@/components/spinner'
import { EditExerciseForm } from '../forms/edit-exercise-form'
import { AddButton } from '../buttons/add-button'
import { EditSheet } from './edit-sheet'
import { Badge } from '../ui/badge'
import { MainButton } from '../buttons/main-button'
import { ExcelImportDialog } from '../excel-import-dialog'

interface ExercisesTableProps {
  onConfirmRowSelection?: (selectedRows: Exercise[]) => void
}

export function ExercisesTable({ onConfirmRowSelection }: ExercisesTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyExercises, pagination],
    queryFn: () => getExercises({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
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
        header: 'Tên bài tập',
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
              <img src={thumbnail || 'https://placehold.co/600x400?text=example'} alt={`${row.getValue('name')} thumbnail`} className="h-16 rounded-md object-cover" />
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
        return 'Xoá bài tập thành công'
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
        return 'Xoá bài tập thành công'
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
                text={`Chọn ${Object.keys(rowSelection).length} bài tập`}
                onClick={() => {
                  const selectedRows = Object.keys(rowSelection).map((key) => data?.data?.[Number(key)])
                  if (selectedRows.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một bài tập')
                    return
                  }
                  onConfirmRowSelection(selectedRows.filter((row): row is Exercise => !!row))
                }}
              />
            )}
            <AddButton text="Thêm bài tập" onClick={onAddRow} />
            <ExcelImportDialog
              title="Bài tập"
              handleSubmit={async (file: File) => {
                await importExerciseExcel(file)
                refetch()
              }}
            />
          </>
        }
      />
      <EditSheet
        title={isEdit ? 'Chỉnh sửa bài tập' : 'Thêm bài tập'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditExerciseForm data={selectedRow} onSuccess={onEditSuccess} />
      </EditSheet>
    </>
  )
}
