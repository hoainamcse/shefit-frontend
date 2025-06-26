'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Exercise } from '@/models/exercise'

import { toast } from 'sonner'
import { ImportIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  createExercise,
  deleteBulkExercise,
  deleteExercise,
  getExercises,
  queryKeyExercises,
} from '@/network/client/exercises'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { getYoutubeThumbnail } from '@/lib/youtube'
import { Spinner } from '@/components/spinner'

import { createMuscleGroup } from '@/network/client/muscle-groups'
import { EditExerciseForm } from '../forms/edit-exercise-form'
import { createEquipment } from '@/network/client/equipments'
import { AddButton } from '../buttons/add-button'
import { EditSheet } from './edit-sheet'
import { Badge } from '../ui/badge'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { MainButton } from '../buttons/main-button'
import { ExcelReader } from '../excel-reader'

export function ExercisesTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

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
          const thumbnail = getYoutubeThumbnail(row.getValue('youtube_url'))
          return (
            <a href={row.getValue('youtube_url')} target="_blank">
              <img src={thumbnail} alt={`${row.getValue('name')} thumbnail`} className="h-16 rounded-md object-cover" />
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
        state={{ pagination }}
        rowCount={data?.paging.total}
        onDelete={onDeleteRows}
        onPaginationChange={setPagination}
        rightSection={
          <>
            <AddButton text="Thêm bài tập" onClick={onAddRow} />
            <ImportDialog onSuccess={refetch} />
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

function ImportDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      const equipmentNames = new Set<string>()
      const muscleGroupNames = new Set<string>()

      for (const item of data) {
        const equipmentList = (item.equipments || '')
          .split(';')
          .map((eq: string) => eq.trim())
          .filter(Boolean)

        const muscleGroupList = (item.muscle_groups || '')
          .split(';')
          .map((mg: string) => mg.trim())
          .filter(Boolean)

        equipmentList.forEach((eq: string) => equipmentNames.add(eq))
        muscleGroupList.forEach((mg: string) => muscleGroupNames.add(mg))
      }

      const equipmentsMap = new Map()
      const muscleGroupsMap = new Map()

      for (const name of equipmentNames) {
        const response = await createEquipment({
          name,
          image: 'https://placehold.co/600x400?text=example',
        })
        equipmentsMap.set(name, response.data.id)
      }

      for (const name of muscleGroupNames) {
        const response = await createMuscleGroup({
          name,
          image: 'https://placehold.co/600x400?text=example',
        })
        muscleGroupsMap.set(name, response.data.id)
      }

      const dataWithIds = data.map((item) => {
        const equipmentsIds = (item.equipments || '')
          .split(';')
          .map((eq: string) => eq.trim())
          .filter(Boolean)
          .map((eq: string) => equipmentsMap.get(eq))
          .filter(Boolean)

        const muscleGroupsIds = (item.muscle_groups || '')
          .split(';')
          .map((mg: string) => mg.trim())
          .filter(Boolean)
          .map((mg: string) => muscleGroupsMap.get(mg))
          .filter(Boolean)

        const { equipments, muscle_groups, ...rest } = item

        return {
          ...rest,
          equipment_ids: [...new Set(equipmentsIds)],
          muscle_group_ids: [...new Set(muscleGroupsIds)],
        }
      })

      for (const exercise of dataWithIds) {
        await createExercise(exercise)
      }

      toast.success('Nhập bài tập thành công')
      onSuccess?.()
      setIsOpen(false)
    } catch (error: any) {
      toast.error(`Lỗi khi chuẩn bị dữ liệu: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MainButton text="Nhập bài tập" icon={ImportIcon} variant="outline" />
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Nhập món ăn</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách bài tập từ tệp Excel</DialogDescription>
        </DialogHeader>
        <ExcelReader onSuccess={setData} />
        {data.length > 0 && <MainButton text="Nhập bài tập" className="mt-4" onClick={onSubmit} loading={isLoading} />}
      </DialogContent>
    </Dialog>
  )
}
