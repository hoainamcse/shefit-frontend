'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import type { Equipment } from '@/models/equipment'

import { toast } from 'sonner'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { deleteBulkEquipment, deleteEquipment, getEquipments, queryKeyEquipments } from '@/network/client/equipments'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'

import { EditEquipmentForm } from '../forms/edit-equipment-form'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { SheetEdit } from '../dialogs/sheet-edit'

interface EquipmentsTableProps {
  onConfirmRowSelection?: (selectedRows: Equipment[]) => void
}

export function EquipmentsTable({ onConfirmRowSelection }: EquipmentsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [rowSelection, setRowSelection] = useState<Equipment[]>([])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyEquipments, pagination],
    queryFn: () => getEquipments({ page: pagination.pageIndex, per_page: pagination.pageSize }),
    placeholderData: keepPreviousData,
  })

  const columns = useMemo<ColumnDef<Equipment>[]>(
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
        header: 'Tên dụng cụ',
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        size: 180,
        enableHiding: false,
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
        size: 100,
        enableSorting: false,
      },
      {
        header: 'Mô tả',
        accessorKey: 'description',
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

  const [selectedRow, setSelectedRow] = useState<Equipment | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const onAddRow = () => {
    setSelectedRow(null)
    setIsEditSheetOpen(true)
  }

  const onEditRow = (row: Equipment) => {
    setSelectedRow(row)
    setIsEditSheetOpen(true)
  }

  const onDeleteRow = async (row: Equipment) => {
    const deletePromise = () => deleteEquipment(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá dụng cụ thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: Equipment[]) => {
    const deletePromise = () => deleteBulkEquipment(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá dụng cụ thành công'
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
        rightSection={
          <>
            {onConfirmRowSelection && (
              <MainButton
                variant="outline"
                text={`Chọn ${rowSelection.length} dụng cụ`}
                onClick={() => {
                  if (rowSelection.length === 0) {
                    toast.error('Vui lòng chọn ít nhất một dụng cụ')
                    return
                  }
                  onConfirmRowSelection(rowSelection)
                }}
              />
            )}
            <AddButton text="Thêm dụng cụ" onClick={onAddRow} />
          </>
        }
      />
      <SheetEdit
        title={isEdit ? 'Chỉnh sửa dụng cụ' : 'Thêm dụng cụ'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      >
        <EditEquipmentForm data={selectedRow} onSuccess={onEditSuccess} />
      </SheetEdit>
    </>
  )
}
