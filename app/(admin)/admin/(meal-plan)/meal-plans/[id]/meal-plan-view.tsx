'use client'

import type { MealPlan, MealPlanDay, MealPlanDish, DishMealTime } from '@/models/meal-plan'

import { toast } from 'sonner'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sprout, Trash2 } from 'lucide-react'

import { EditMealPlanDishForm } from '@/components/forms/edit-meal-plan-dish-form'
import { EditMealPlanDayForm } from '@/components/forms/edit-meal-plan-day-form'
import { EditSheet } from '@/components/data-table/edit-sheet'
import { MainButton } from '@/components/buttons/main-button'
import { EditButton } from '@/components/buttons/edit-button'
import { AddButton } from '@/components/buttons/add-button'
import { Spinner } from '@/components/spinner'
import { Label } from '@/components/ui/label'
import { sortByKey } from '@/lib/helpers'
import {
  deleteMealPlanDay,
  deleteMealPlanDish,
  getMealPlanDays,
  getMealPlanDishes,
  importMealPlanExcel,
  queryKeyMealPlanDays,
  queryKeyMealPlanDishes,
} from '@/network/client/meal-plans'
import { ExcelImportDialog } from '@/components/excel-import-dialog'

interface MealPlanViewProps {
  mealPlanID: MealPlan['id']
}

const mealTimeOrder: DishMealTime[] = ['breakfast', 'lunch', 'snack', 'dinner']

export function MealPlanView({ mealPlanID }: MealPlanViewProps) {
  const [isEditDayOpen, setIsEditDayOpen] = useState(false)
  const [isEditDishOpen, setIsEditDishOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<MealPlanDay | null>(null)
  const [selectedDish, setSelectedDish] = useState<MealPlanDish | null>(null)
  const [isAddingDay, setIsAddingDay] = useState(false)

  const isEditDay = !!selectedDay
  const isEditDish = !!selectedDish

  const {
    data: days,
    isLoading: isDaysLoading,
    error: daysError,
    refetch: daysRefetch,
  } = useQuery({
    queryKey: [queryKeyMealPlanDays, mealPlanID],
    queryFn: () => getMealPlanDays(mealPlanID),
  })

  // useEffect(() => {
  //   if (daysData?.data && daysData.data.length > 0 && !selectedDay) {
  //     setSelectedDay(daysData.data[0])
  //   }
  // }, [daysData, selectedDay])

  const {
    data: dishes,
    isLoading: isDishesLoading,
    error: dishesError,
    refetch: dishesRefetch,
  } = useQuery({
    queryKey: [queryKeyMealPlanDishes, mealPlanID, selectedDay?.id!],
    queryFn: () => (selectedDay ? getMealPlanDishes(mealPlanID, selectedDay.id) : Promise.resolve(null)),
    enabled: !!selectedDay,
  })

  if (isDaysLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (daysError) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">{daysError.message}</p>
      </div>
    )
  }

  const daysData = sortByKey(days?.data || [], 'day_number')
  const dishesData = sortByKey(dishes?.data || [], 'created_at', { transform: (val) => new Date(val).getTime() })

  const onAddDay = () => {
    setIsAddingDay(true)
    setIsEditDayOpen(true)
  }

  const onAddDish = () => {
    setSelectedDish(null)
    setIsEditDishOpen(true)
  }

  const onEditDay = (day: MealPlanDay) => {
    setSelectedDay(day)
    setIsEditDayOpen(true)
  }

  const onEditDaySuccess = () => {
    if (isAddingDay) setIsAddingDay(false)
    setSelectedDay(null)
    setIsEditDayOpen(false)
    daysRefetch()
  }

  const onEditDish = (dish: MealPlanDish) => {
    setSelectedDish(dish)
    setIsEditDishOpen(true)
  }

  const onEditDishSuccess = () => {
    setSelectedDish(null)
    setIsEditDishOpen(false)
    dishesRefetch()
  }

  const onDeleteDay = async (day: MealPlanDay) => {
    const deletePromise = () => deleteMealPlanDay(mealPlanID, day.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        daysRefetch()
        setSelectedDay(null)
        return 'Xoá ngày thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteDish = async (dish: MealPlanDish) => {
    const deletePromise = () => deleteMealPlanDish(mealPlanID, selectedDay?.id!, dish.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        dishesRefetch()
        setSelectedDish(null)
        return 'Xoá món ăn thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExcelImportDialog
          title="Thực đơn"
          handleSubmit={async (file: File) => {
            await importMealPlanExcel(mealPlanID, file)
            daysRefetch()
          }}
        />
      </div>

      {/* Days Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Danh sách ngày</Label>
          <div className="flex items-center gap-2">
            {selectedDay && <EditButton size="icon" variant="outline" onClick={() => onEditDay(selectedDay)} />}
            {selectedDay && (
              <MainButton
                size="icon"
                variant="outline"
                icon={Trash2}
                className="hover:text-destructive"
                onClick={() => onDeleteDay(selectedDay!)}
              />
            )}
            <AddButton text="Thêm ngày" onClick={onAddDay} />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {daysData.map((day: MealPlanDay) => (
            <button
              type="button"
              key={day.id}
              style={{
                backgroundImage: day.image
                  ? `url(${day.image})`
                  : 'url(https://placehold.co/400?text=shefit.vn&font=Oswald)',
              }}
              className={`bg-cover h-20 w-40 bg-center rounded-md whitespace-nowrap text-white flex-shrink-0 ${
                selectedDay?.id !== day.id && 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => setSelectedDay(day)}
            >
              Ngày {day.day_number}
            </button>
          ))}
        </div>
        {daysData.length === 0 && (
          <div className="text-center text-muted-foreground">Chưa có ngày nào trong thực đơn</div>
        )}
      </div>

      {/* Dishes for Selected Day */}
      {selectedDay && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base">
              Danh sách món ăn ngày {daysData.find((d: MealPlanDay) => d.id === selectedDay.id)?.day_number}
            </Label>
            <AddButton text="Thêm món ăn" onClick={onAddDish} />
          </div>

          {isDishesLoading ? (
            <div className="flex items-center justify-center">
              <Spinner className="bg-ring dark:bg-white" />
            </div>
          ) : dishesError ? (
            <div className="flex items-center justify-center">
              <p className="text-destructive">{dishesError.message}</p>
            </div>
          ) : dishesData.length === 0 ? (
            <div className="text-center text-muted-foreground">Chưa có món ăn trong ngày</div>
          ) : (
            <div className="space-y-4">
              {dishesData.map((dish, index) => (
                <div key={`dish-${index}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-medium">{dish.name}</h3>
                      <p className="text-gray-600">{dish.description}</p>

                      {/* Nutrition information */}
                      <div className="flex gap-3 text-sm">
                        <Sprout className="h-4 w-4 text-emerald-500" />
                        <p>{dish.nutrients}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <EditButton size="icon" variant="outline" onClick={() => onEditDish(dish)} />
                      <MainButton
                        size="icon"
                        variant="outline"
                        icon={Trash2}
                        className="hover:text-destructive"
                        onClick={() => onDeleteDish(dish)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <EditSheet
        title={!isAddingDay ? 'Chỉnh sửa ngày' : 'Thêm ngày'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditDayOpen}
        onOpenChange={(open) => {
          setIsEditDayOpen(open)
          if (!open) setIsAddingDay(false)
        }}
      >
        <EditMealPlanDayForm
          mealPlanID={mealPlanID}
          data={!isAddingDay ? selectedDay : null}
          onSuccess={onEditDaySuccess}
        />
      </EditSheet>

      <EditSheet
        title={isEditDish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditDishOpen}
        onOpenChange={setIsEditDishOpen}
      >
        <EditMealPlanDishForm
          mealPlanID={mealPlanID}
          dayID={selectedDay?.id!}
          data={selectedDish}
          onSuccess={onEditDishSuccess}
        />
      </EditSheet>
    </div>
  )
}

const getMealTimeColor = (mealTime: DishMealTime) => {
  switch (mealTime) {
    case 'breakfast':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'lunch':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'dinner':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'snack':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
