'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Exercise } from '@/models/exercise'

import { toast } from 'sonner'
import { ImportIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { createExercise, deleteExercise, getExercises, queryKeyExercises } from '@/network/client/exercises'
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
    pageSize: 10,
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

  const exerciseMutation = useMutation({
    mutationFn: (data: any[]) => Promise.all(data.map((item) => createExercise(item))),
    onSuccess: () => {
      toast.success('Nhập bài tập thành công')
      onSuccess?.()
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(`Lỗi khi nhập bài tập: ${error.message}`)
    },
  })

  const onSubmit = async () => {
    const equipmentNames = data.flatMap((item) =>
      (item.equipments || '')
        .split(';')
        .map((item: string) => item.trim())
        .filter((item: string) => item !== '')
    )
    const muscleGroupNames = data.flatMap((item) =>
      (item.muscle_groups || '')
        .split(';')
        .map((item: string) => item.trim())
        .filter((item: string) => item !== '')
    )

    const uniqueEquipmentNames = Array.from(new Set(equipmentNames)).filter(Boolean)
    const uniqueMuscleGroupNames = Array.from(new Set(muscleGroupNames)).filter(Boolean)

    const equipmentsData = await Promise.all(
      uniqueEquipmentNames.map((eq) =>
        createEquipment({ name: eq, image: 'https://placehold.co/600x400?text=example' })
      )
    )
    const muscleGroupsData = await Promise.all(
      uniqueMuscleGroupNames.map((eq) =>
        createMuscleGroup({ name: eq, image: 'https://placehold.co/600x400?text=example' })
      )
    )

    const dataWithIds = data.map((item) => {
      const equipmentsIds = (item.equipments || '')
        .split(';')
        .map((eq: string) => eq.trim())
        .filter((eq: string) => eq !== '')
        .map((eq: string) => equipmentsData.find((e) => e.data.name === eq)?.data.id)
        .filter(Boolean)

      const muscleGroupsIds = (item.muscle_groups || '')
        .split(';')
        .map((mg: string) => mg.trim())
        .filter((mg: string) => mg !== '')
        .map((mg: string) => muscleGroupsData.find((mgItem) => mgItem.data.name === mg)?.data.id)
        .filter(Boolean)

      const { equipments, muscle_groups, ...rest } = item

      return {
        ...rest,
        equipment_ids: equipmentsIds,
        muscle_group_ids: muscleGroupsIds,
      }
    })

    exerciseMutation.mutateAsync(dataWithIds)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MainButton text="Nhập bài tập" icon={ImportIcon} variant="outline" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Nhập món ăn</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách bài tập từ tệp Excel</DialogDescription>
        </DialogHeader>
        <ExcelReader onSuccess={setData} />
        {data.length > 0 && (
          <MainButton text="Nhập bài tập" className="mt-4" onClick={onSubmit} loading={exerciseMutation.isPending} />
        )}
      </DialogContent>
    </Dialog>
  )
}
