'use client'

import type { MealPlan, MealPlanDay, MealPlanDish, DishMealTime } from '@/models/meal-plan'

import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Beef, Droplets, ImportIcon, Leaf, Trash2, Wheat, Zap } from 'lucide-react'

import { EditMealPlanDishForm } from '@/components/forms/edit-meal-plan-dish-form'
import { EditMealPlanDayForm } from '@/components/forms/edit-meal-plan-day-form'
import { EditSheet } from '@/components/data-table/edit-sheet'
import { MainButton } from '@/components/buttons/main-button'
import { EditButton } from '@/components/buttons/edit-button'
import { AddButton } from '@/components/buttons/add-button'
import { dishMealTimeLabel } from '@/lib/label'
import { Spinner } from '@/components/spinner'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  createMealPlanDay,
  createMealPlanDish,
  deleteMealPlanDay,
  deleteMealPlanDish,
  getMealPlanDays,
  getMealPlanDishes,
  queryKeyMealPlanDays,
  queryKeyMealPlanDishes,
} from '@/network/client/meal-plans'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { transformDishes } from '@/lib/xlsx'
import { ExcelReader } from '@/components/excel-reader'

interface MealPlanViewProps {
  mealPlanID: MealPlan['id']
}

export function MealPlanView({ mealPlanID }: MealPlanViewProps) {
  const [isEditDayOpen, setIsEditDayOpen] = useState(false)
  const [isEditDishOpen, setIsEditDishOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<MealPlanDay | null>(null)
  const [selectedDish, setSelectedDish] = useState<MealPlanDish | null>(null)
  const [isAddingDay, setIsAddingDay] = useState(false)

  const isEditDay = !!selectedDay
  const isEditDish = !!selectedDish

  const {
    data: daysData,
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
    data: dishesData,
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

  const days = daysData?.data || []
  const dishes = dishesData?.data || []

  const sortedDays = [...days].sort((a: MealPlanDay, b: MealPlanDay) => a.day_number - b.day_number)
  const mealTimeOrder: DishMealTime[] = ['breakfast', 'lunch', 'dinner', 'snack']
  const sortedDishes = [...dishes].sort((a: MealPlanDish, b: MealPlanDish) => {
    return mealTimeOrder.indexOf(a.meal_time) - mealTimeOrder.indexOf(b.meal_time)
  })

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
        <ImportDialog mealPlanID={mealPlanID} onSuccess={() => daysRefetch()} />
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
          {sortedDays.map((day: MealPlanDay) => (
            <button
              type="button"
              key={day.id}
              style={{ backgroundImage: `url(${day.image})` }}
              className={`bg-cover h-20 w-40 bg-center rounded-md whitespace-nowrap text-white flex-shrink-0 ${
                selectedDay?.id !== day.id && 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => setSelectedDay(day)}
            >
              Ngày {day.day_number}
            </button>
          ))}
        </div>
        {sortedDays.length === 0 && (
          <div className="text-center text-muted-foreground">Chưa có ngày nào trong thực đơn</div>
        )}
      </div>

      {/* Dishes for Selected Day */}
      {selectedDay && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base">
              Danh sách món ăn ngày {sortedDays.find((d: MealPlanDay) => d.id === selectedDay.id)?.day_number}
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
          ) : sortedDishes.length === 0 ? (
            <div className="text-center text-muted-foreground">Chưa có món ăn trong ngày</div>
          ) : (
            <div className="space-y-4">
              {sortedDishes.map((dish, index) => (
                <div key={`dish-${index}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Badge className={getMealTimeColor(dish.meal_time)} variant="outline">
                        {dishMealTimeLabel[dish.meal_time]}
                      </Badge>
                      <h3 className="font-medium">{dish.name}</h3>
                      <p className="text-gray-600">{dish.description}</p>

                      {/* Nutrition information */}
                      <div className="flex gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{dish.calories}</span>
                          <span className="text-muted-foreground">cal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Beef className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{dish.protein}g</span>
                          <span className="text-muted-foreground">protein</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wheat className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{dish.carb}g</span>
                          <span className="text-muted-foreground">carbs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{dish.fat}g</span>
                          <span className="text-muted-foreground">fat</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{dish.fiber}g</span>
                          <span className="text-muted-foreground">fiber</span>
                        </div>
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

function ImportDialog({ mealPlanID, onSuccess }: { mealPlanID: MealPlan['id']; onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    try {
      const _data = transformDishes(data)
      setIsLoading(true)

      for (const d of _data.days) {
        try {
          const dayResponse = await createMealPlanDay(mealPlanID, {
            day_number: d.day_number,
            image: 'https://placehold.co/600x400?text=example',
          })

          const dayId = dayResponse.data[0].id

          for (const dish of d.dishes) {
            await createMealPlanDish(mealPlanID, dayId, {
              ...dish,
              meal_time: 'breakfast',
            })
          }
        } catch (error) {
          console.error(`Error processing day ${d.day_number}:`, error)
          throw error
        }
      }

      setData([])
      toast.success('Nhập thực đơn thành công')
      onSuccess?.()
      setIsOpen(false)
    } catch (error) {
      console.error('Error creating meal plan dishes:', error)
      toast.error('Đã có lỗi xảy ra khi nhập thực đơn')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MainButton text="Nhập thực đơn" icon={ImportIcon} variant="outline" />
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Nhập món ăn</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách món ăn từ tệp Excel</DialogDescription>
        </DialogHeader>
        <ExcelReader
          specificHeaders={['day_number', 'dish_calories', 'dish_protein', 'dish_carb', 'dish_fat', 'dish_fiber']}
          onSuccess={setData}
        />
        {data.length > 0 && <MainButton text="Nhập thực đơn" className="mt-4" onClick={onSubmit} loading={isLoading} />}
      </DialogContent>
    </Dialog>
  )
}
