'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'

import { toast } from 'sonner'
import { ImportIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { createDish, deleteDish, getDishes, queryKeyDishes } from '@/network/client/dishes'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { createDiet } from '@/network/client/diets'
import { Spinner } from '@/components/spinner'
import { Dish } from '@/models/dish'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { EditDishForm } from '../forms/edit-dish-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { ExcelReader } from '../excel-reader'
import { EditSheet } from './edit-sheet'

export function DishesTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyDishes, pagination],
    queryFn: () => getDishes({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Dish>[]>(
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
        header: 'Tên món ăn',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
      },
      {
        header: 'Chế độ ăn',
        accessorFn: (originalRow) => originalRow.diet?.name,
        size: 180,
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'image',
        cell: ({ row }) => (
          <div>
            <img
              src={row.getValue('image')}
              alt={`${row.getValue('name')} thumbnail`}
              className="h-16 w-28 rounded-md object-cover"
            />
          </div>
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

  const [selectedRow, setSelectedRow] = useState<Dish | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Dish) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Dish) => {
    const deletePromise = () => deleteDish(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá món ăn thành công'
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
            <AddButton text="Thêm món ăn" onClick={onAddRow} />
            <ImportDialog onSuccess={refetch} />
          </>
        }
      />
      <EditSheet
        title={isEdit ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditDishForm data={selectedRow} onSuccess={onEditSuccess} />
      </EditSheet>
    </>
  )
}

function ImportDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any[]>([])

  const dishMutation = useMutation({
    mutationFn: (data: any[]) => Promise.all(data.map((item) => createDish(item))),
    onSuccess: () => {
      toast.success('Nhập món ăn thành công')
      onSuccess?.()
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(`Lỗi khi nhập món ăn: ${error.message}`)
    },
  })

  const onSubmit = async () => {
    const uniqueDietNames = Array.from(new Set(data.map((item) => item.diet))).filter(Boolean)
    const diets = await Promise.all(
      uniqueDietNames.map((diet) =>
        createDiet({ diets: [{ name: diet, description: '', image: 'https://placehold.co/600x400?text=example' }] })
      )
    )

    const dataWithDietId = data.map((item) => {
      const _diet = diets.find((d) => d.data[0].name === item.diet)
      const { diet, ...rest } = item
      return {
        ...rest,
        diet_id: _diet ? _diet.data[0].id : null,
        image: 'https://placehold.co/600x400?text=example',
      }
    })
    dishMutation.mutateAsync(dataWithDietId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MainButton text="Nhập món ăn" icon={ImportIcon} variant="outline" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Nhập món ăn</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách món ăn từ tệp Excel</DialogDescription>
        </DialogHeader>
        <ExcelReader
          headers={{
            name: 'text',
            description: 'text',
            diet: 'text',
            calories: 'number',
            protein: 'number',
            fat: 'number',
            carb: 'number',
            fiber: 'number',
          }}
          onSuccess={setData}
        />
        {data.length > 0 && (
          <MainButton text="Nhập món ăn" className="mt-4" onClick={onSubmit} loading={dishMutation.isPending} />
        )}
      </DialogContent>
    </Dialog>
  )
}
