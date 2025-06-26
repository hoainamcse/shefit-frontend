'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Dish } from '@/models/dish'

import { toast } from 'sonner'
import { ImportIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { createDish, deleteDish, getDishes, queryKeyDishes } from '@/network/client/dishes'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { createDiet } from '@/network/client/diets'
import { Spinner } from '@/components/spinner'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { EditDishForm } from '../forms/edit-dish-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { ExcelReader } from '../excel-reader'
import { EditSheet } from './edit-sheet'
import { getYoutubeThumbnail } from '@/lib/youtube'

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
        cell: ({ row }) => {
          const image = row.getValue('image')
          if (typeof image !== 'string') return null
          const isYoutube = image.includes('youtube.com') || image.includes('youtu.be')
          const imgSrc = isYoutube ? getYoutubeThumbnail(image) : image
          return (
            <div>
              <img
                src={imgSrc}
                alt={`${row.getValue('name')} thumbnail`}
                className="h-16 w-28 rounded-md object-cover"
              />
            </div>
          )
        },
        size: 180,
        enableSorting: false,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={(row) => onDeleteRows([row])} />,
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

  const onDeleteRows = async (selectedRows: Dish[]) => {
    console.log(selectedRows)
    const deletePromise = () => deleteDish(selectedRows.map((row) => row.id))

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
        onDelete={onDeleteRows}
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
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      const dietNames = new Set<string>()

      for (const item of data) {
        const dietList = (item.diets || '')
          .split(';')
          .map((d: string) => d.trim())
          .filter(Boolean)

        dietList.forEach((eq: string) => dietNames.add(eq))
      }

      const dietsMap = new Map()

      for (const name of dietNames) {
        const response = await createDiet({
          diets: [{ name, description: '', image: 'https://placehold.co/600x400?text=example' }],
        })
        dietsMap.set(name, response.data[0].id)
      }

      const dataWithIds = data.map((item) => {
        const dietsIds = (item.diets || '')
          .split(';')
          .map((d: string) => d.trim())
          .filter(Boolean)
          .map((d: string) => dietsMap.get(d))
          .filter(Boolean)

        const { diets, ...rest } = item

        return {
          ...rest,
          diet_ids: [...new Set(dietsIds)],
          image: 'https://placehold.co/600x400?text=example',
        }
      })

      for (const dish of dataWithIds) {
        await createDish(dish)
      }

      toast.success('Nhập món ăn thành công')
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
        <MainButton text="Nhập món ăn" icon={ImportIcon} variant="outline" />
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Nhập món ăn</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách món ăn từ tệp Excel</DialogDescription>
        </DialogHeader>
        <ExcelReader specificHeaders={['calories', 'protein', 'carb', 'fat', 'fiber']} onSuccess={setData} />
        {data.length > 0 && <MainButton text="Nhập món ăn" className="mt-4" onClick={onSubmit} loading={isLoading} />}
      </DialogContent>
    </Dialog>
  )
}
