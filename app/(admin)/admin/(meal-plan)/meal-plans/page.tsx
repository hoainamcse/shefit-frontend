'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { useDebounced } from '@/hooks/useDebounced'
import { Calorie } from '@/models/calorie'
import { Diet } from '@/models/diets'
import { MealPlan } from '@/models/meal-plans'
import { getCalories } from '@/network/server/calorie'
import { getDiets } from '@/network/server/diets'
import { deleteMealPlan, getListMealPlans, getMealPlanDetails, updateMealPlan } from '@/network/server/meal-plans'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'

const PublicSwitchCell = ({ mealPlanData }: { mealPlanData: MealPlan }) => {
  const [checked, setChecked] = useState(mealPlanData.is_public)
  const debouncedUpdate = useDebounced(async (newVal: boolean) => {
    const detailMealPlan = await getMealPlanDetails(mealPlanData.id)
    if (!detailMealPlan.data) return
    const { calories, ...mealPlan } = detailMealPlan.data
    const res = await updateMealPlan(mealPlanData.id, { ...mealPlan, calorie_id: calories.id, is_public: newVal })
    if (res.status === 'success') toast.success('Cập nhật hiển thị thành công')
    else toast.error('Cập nhật hiển thị thất bại')
  }, 700)
  const handleChange = (val: boolean) => {
    setChecked(val)
    debouncedUpdate(val)
  }
  return <Switch checked={checked} onCheckedChange={handleChange} />
}

export default function MealPlansPage() {
  const router = useRouter()
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [dietList, setDietList] = useState<Diet[]>([])

  const dietIdToName = useMemo(() => Object.fromEntries(dietList.map((diet) => [diet.id, diet.name])), [dietList])

  const columns: ColumnDef<MealPlan>[] = [
    {
      accessorKey: 'title',
      header: 'Tên',
    },
    {
      accessorKey: 'description',
      header: 'Thông tin',
      render: ({ row }) => (
        <span className="block max-w-xs truncate overflow-hidden whitespace-nowrap " title={row.description}>
          {row.description}
        </span>
      ),
    },
    {
      accessorKey: 'calories',
      header: 'Mức calo',
      render: ({ row }) => <span className="block min-w-[100px] text-gray-900">{row.calories.name}</span>,
    },
    {
      accessorKey: 'diet_id',
      header: 'Chế độ ăn',
      render: ({ row }) => (
        <span className="block min-w-[120px] text-gray-900">{dietIdToName[row.diet_id] || '-'}</span>
      ),
    },
    {
      accessorKey: 'is_public',
      header: 'Hiển thị',
      render: ({ row }) => <PublicSwitchCell mealPlanData={row} />,
    },
    {
      accessorKey: 'actions',
      render: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem>
              <Copy /> Sao chép thực đơn ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                router.push(`/admin/meal-plans/${row.id}`)
              }}
            >
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(row.id)}>
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const handleDelete = async (mealPlanId: string) => {
    if (window.confirm('Bạn có chắc muốn xoá thực đơn này?')) {
      try {
        const res = await deleteMealPlan(mealPlanId)
        if (res.status === 'success') {
          toast.success('Xoá thực đơn thành công')
          setMealPlans((mealPlans) => mealPlans.filter((mealPlan) => mealPlan.id !== mealPlanId))
        }
      } catch (e) {
        toast.error('Có lỗi khi xoá thực đơn')
      }
    }
  }

  useEffect(() => {
    const fetchMealPlans = async () => {
      const response = await getListMealPlans()
      const dietResponse = await getDiets()
      setDietList(dietResponse.data || [])
      setMealPlans(response.data || [])
    }
    fetchMealPlans()
  }, [])
  const headerExtraContent = (
    <>
      <AddButton text="Thêm thực đơn" onClick={() => router.push('/admin/meal-plans/create')} />
      <MainButton text="Nhập thực đơn" variant="outline" icon={Import} />
    </>
  )

  return (
    <ContentLayout title="Thực đơn">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo tên, ..."
        data={mealPlans}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
  )
}
