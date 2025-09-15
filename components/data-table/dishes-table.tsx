'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Dish } from '@/models/dish'

import { toast } from 'sonner'

import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteDish, getDishes, queryKeyDishes, importDishExcel } from '@/network/client/dishes'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { getDiets, queryKeyDiets } from '@/network/client/diets'
import { useDebounce } from '@/hooks/use-debounce'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EditDishForm } from '../forms/edit-dish-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { DialogExcelImport } from '../dialogs/dialog-excel-import'
import { Button } from '../ui/button'
import { SheetEdit } from '../dialogs/sheet-edit'
import { getYouTubeThumbnail } from '@/lib/youtube'

interface DishesTableProps {
  onConfirmRowSelection?: (selectedRows: Dish[]) => void
}

export function DishesTable({ onConfirmRowSelection }: DishesTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedDiet, setSelectedDiet] = useState<string | undefined>(undefined)
  const [rowSelection, setRowSelection] = useState<Dish[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      queryKeyDishes,
      {
        ...pagination,
        ...(debouncedSearchQuery ? { name: debouncedSearchQuery } : {}),
        ...(selectedDiet ? { diet_id: Number(selectedDiet) } : {}),
      },
    ],
    queryFn: () =>
      getDishes({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        ...(debouncedSearchQuery ? { name: debouncedSearchQuery } : {}),
        ...(selectedDiet ? { diet_id: Number(selectedDiet) } : {}),
      }),
    placeholderData: keepPreviousData,
  })

  const dietsQuery = useQuery({
    queryKey: [queryKeyDiets],
    queryFn: () => getDiets(),
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
        header: 'Mô tả',
        accessorKey: 'description',
        cell: ({ row }) => <div className="line-clamp-2">{row.getValue('description')}</div>,
        size: 180,
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
          const imgSrc = isYoutube ? getYouTubeThumbnail(image) : image
          return (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-50 rounded-md overflow-hidden">
              <img
                src={imgSrc || 'https://placehold.co/400?text=shefit.vn&font=Oswald'}
                alt={`${row.getValue('name')} thumbnail`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )
        },
        size: 120,
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
        onRowSelectionChange={setRowSelection}
        leftSection={
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Input
                placeholder="Nhập tên món ăn"
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
            <Select value={selectedDiet || ''} onValueChange={(value) => setSelectedDiet(value || undefined)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Chọn chế độ ăn" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {dietsQuery.data?.data.map((diet) => (
                    <SelectItem key={diet.id} value={String(diet.id)}>
                      {diet.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {selectedDiet && (
                  <>
                    <SelectSeparator />
                    <Button
                      className="w-full px-2"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDiet(undefined)
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
                text={`Chọn ${rowSelection.length} món ăn`}
                onClick={() => {
                  if (rowSelection.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một món ăn')
                    return
                  }
                  onConfirmRowSelection(rowSelection)
                }}
              />
            )}
            <AddButton text="Thêm món ăn" onClick={onAddRow} />
            <DialogExcelImport
              title="Món ăn"
              handleSubmit={async (file: File) => {
                await importDishExcel(file)
                refetch()
              }}
            />
          </>
        }
      />
      <SheetEdit
        title={isEdit ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditDishForm data={selectedRow} onSuccess={onEditSuccess} />
      </SheetEdit>
    </>
  )
}
