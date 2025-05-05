'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { Trash2, Plus, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FormInputField, FormSelectField, FormSwitchField, FormTextareaField } from './fields'
import { formSchema as dishFormSchema, DishFormFields, FormDishValues } from './create-dish-form'
import { Diet } from '@/models/diets'
import { getDiets } from '@/network/server/diets'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createMealPlan,
  createMealPlanDays,
  updateMealPlanDays,
  createMealPlanDaysDishes,
  getMealPlanDays,
  updateMealPlan,
  updateMealPlanDish,
  deleteMealPlanDay,
  deleteMealPlanDish,
  getMealPlanDishes,
} from '@/network/server/meal-plans'
import { FormImageInputField } from './fields/form-image-input-field'
import { MealPlan } from '@/models/meal-plans'
import { Calorie } from '@/models/calorie'
import { getCalories } from '@/network/server/calorie'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Meal plan name must be at least 2 characters.',
  }),
  subtitle: z.string().min(10, {
    message: 'Summary must be at least 10 characters.',
  }),
  description: z.string().min(10, {
    message: 'Information must be at least 10 characters.',
  }),
  image: z.string().optional(),
  calorie_id: z.coerce.number().min(1, {
    message: 'Calorie value is required.',
  }),
  diet_id: z.coerce.number().min(1, {
    message: 'Please select a diet type.',
  }),
  meal_ingredients: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        name: z.string().min(1, 'Ingredient name is required'),
        image: z.string().optional(),
      })
    )
    .min(1, 'At least one ingredient is required'),
  days: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        image: z.string(),
        day_number: z.coerce.number().optional(),
        dishes: z.array(dishFormSchema).optional().default([]),
      })
    )
    .min(1, 'At least one day is required'),
  is_public: z.boolean().default(false),
  is_free: z.boolean().default(false),
  free_days: z.coerce.number().optional(),
  chef_name: z.string().optional(),
  goal: z.string().optional(),
})

type FormMealPlanValues = z.infer<typeof formSchema>

//Function to fetch days and dishes
const fetchMealPlanFormDefaults = async (mealPlanId: string, rawData: any): Promise<Partial<FormMealPlanValues>> => {
  const daysRes = await getMealPlanDays(mealPlanId)

  const days = daysRes?.data || []
  const daysWithDishes = await Promise.all(
    days.map(async (day: any) => ({
      ...day,
      dishes: (await getMealPlanDishes(mealPlanId, day.id))?.data || [],
    }))
  )

  const { calories, ...rest } = rawData
  return {
    ...rest,
    calorie_id: calories?.id,
    days: daysWithDishes,
  }
}

export default function CreateMealPlanForm({ isEdit = false, data }: { isEdit: boolean; data?: any }) {
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const [dietList, setDietList] = useState<Diet[]>([])
  const [calorieList, setCalorieList] = useState<Calorie[]>([])
  const [deletedDayIds, setDeletedDayIds] = useState<number[]>([])
  const [deletedDishes, setDeletedDishes] = useState<{ dayId: number; dishId: number }[]>([])
  const router = useRouter()

  const AVAILABLE_DIETS = useMemo(
    () => dietList.map((diet) => ({ value: diet.id.toString(), label: diet.name })),
    [dietList]
  )
  const AVAILABLE_CALORIES = useMemo(
    () =>
      calorieList.map((calorie) => ({
        value: calorie.id.toString(),
        label: `${calorie.name} (${calorie.min_calorie}-${calorie.max_calorie})`,
      })),
    [calorieList]
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dietRes, calorieRes] = await Promise.all([getDiets(), getCalories()])
        setDietList(dietRes.data ?? [])
        setCalorieList(calorieRes.data ?? [])
      } catch (error) {
        console.error('Failed to fetch diets or calories', error)
      }
    }
    fetchData()
  }, [])

  const initialDefaults: Partial<FormMealPlanValues> = {
    title: '',
    subtitle: '',
    description: '',
    image: '',
    days: [{ day_number: 1, image: '', dishes: [] }],
    meal_ingredients: [{ name: '', image: '' }],
    is_public: false,
    is_free: false,
    free_days: 0,
    chef_name: '',
    goal: '',
  }

  const form = useForm<FormMealPlanValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialDefaults,
  })

  const isFree = form.watch('is_free')

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: 'days',
  })

  const addDay = () => {
    appendDay({
      image: '',
      dishes: [],
    })
  }

  const handleRemoveDay = (dayIndex: number) => {
    // Get the day that's being removed
    const dayToRemove = form.getValues(`days.${dayIndex}`)

    // If in edit mode and the day has an ID, track it for deletion
    if (isEdit && dayToRemove?.id) {
      setDeletedDayIds((prev) => [...prev, Number(dayToRemove.id)])
    }

    // Remove the day from the form
    removeDay(dayIndex)
  }

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: 'meal_ingredients',
    control: form.control,
  })

  const addIngredient = () => {
    appendIngredient({
      name: '',
      image: '',
    })
  }

  const addDish = (dayIndex: number) => {
    const newDish = {
      name: '',
      description: '',
      diet_id: 1,
      image:
        'https://images.unsplash.com/photo-1523218345414-cd47aea19ba6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lYWx8ZW58MHx8MHx8fDA%3D',
      calories: 0,
      protein: 0,
      carb: 0,
      fat: 0,
      fiber: 0,
      protein_source: [],
      vegetable: [],
      starch: [],
      spices: [],
      others: [],
      meal_time: 'breakfast',
    }

    const currentDishes = form.getValues(`days.${dayIndex}.dishes`) || []
    form.setValue(`days.${dayIndex}.dishes`, [...currentDishes, newDish])
  }

  const removeDish = (dayIndex: number, dishIndex: number) => {
    const day = form.getValues(`days.${dayIndex}`)
    const dish = form.getValues(`days.${dayIndex}.dishes.${dishIndex}`)

    // Track the dish for deletion
    if (isEdit && day?.id && dish?.id) {
      setDeletedDishes((prev) => [...prev, { dayId: Number(day.id), dishId: Number(dish.id) }])
    }

    // Remove the dish from the form
    const currentDishes = form.getValues(`days.${dayIndex}.dishes`) || []
    const updatedDishes = currentDishes.filter((_, i) => i !== dishIndex)
    form.setValue(`days.${dayIndex}.dishes`, updatedDishes)
  }

  useEffect(() => {
    if (!isEdit || !data?.id) return
    setLoading(true)
    fetchMealPlanFormDefaults(data.id, data)
      .then((defaults) => {
        form.reset(defaults)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isEdit, data])

  if (isEdit && loading) {
    return <div className="py-10 text-center text-muted-foreground">Đang tải dữ liệu thực đơn...</div>
  }

  const handleSubmit = (values: FormMealPlanValues) => {
    startTransition(() => {
      ;(async () => {
        try {
          if (isEdit && data?.id) {
            await handleEditMealPlan(values)
          } else {
            await handleCreateMealPlan(values)
            router.push('/admin/meal-plans')
          }
        } catch (error) {
          console.error('Error:', error)
          toast.error(isEdit ? 'Cập nhật thực đơn thất bại' : 'Tạo thực đơn thất bại')
        }
      })()
    })
  }

  const handleEditMealPlan = async (values: FormMealPlanValues) => {
    const { days, ...rest } = values
    const mealPlanId = data.id
    // Update the meal plan basic info
    const mealPlanResult = await updateMealPlan(mealPlanId.toString(), rest)

    if (!mealPlanResult?.data) {
      throw new Error('Failed to update meal plan')
    }

    // Update the meal plan days and dishes
    const existingDaysResult = await getMealPlanDays(mealPlanId.toString())
    const existingDays = existingDaysResult?.data || []
    const existingDayIds = existingDays.map((day: any) => day.id)

    if (Array.isArray(days)) {
      const newDays = days.filter((day) => !day.id || !existingDayIds.includes(day.id))
      const existingFormDays = days.filter((day) => day.id && existingDayIds.includes(day.id))

      const updateDayPromises: Promise<any>[] = []
      existingFormDays.forEach((day) => {
        if (day.id) {
          updateDayPromises.push(
            updateMealPlanDays(Number(mealPlanId), Number(day.id), { day_number: day.day_number, image: day.image })
          )
        }
      })
      if (updateDayPromises.length > 0) {
        await Promise.all(updateDayPromises)
      }

      let newCreatedDays: any[] = []
      if (newDays.length > 0) {
        const highestDayNumber =
          existingDays.length > 0 ? Math.max(...existingDays.map((day: any) => day.day_number || 1)) : 1
        // Create day numbers for new days
        const daysPayload = newDays.map(({ image }, index) => ({ day: highestDayNumber + index + 1, image }))
        const daysResult = await createMealPlanDays(Number(mealPlanId), daysPayload)
        newCreatedDays = daysResult?.data || []
      }

      // Handle dishes
      const dishPromises: Promise<any>[] = []

      // Handle dishes for existing days
      existingFormDays.forEach((day) => {
        if (day.id && Array.isArray(day.dishes) && day.dishes.length > 0) {
          day.dishes.forEach((dish) => {
            if (dish.id) {
              // Update existing dish
              dishPromises.push(updateMealPlanDish(mealPlanId.toString(), Number(day.id), Number(dish.id), dish))
            } else {
              // Create new dish for existing day
              dishPromises.push(createMealPlanDaysDishes(Number(mealPlanId), Number(day.id), dish))
            }
          })
        }
      })

      // Handle dishes for newly created days
      newDays.forEach((formDay, idx) => {
        if (idx < newCreatedDays.length && Array.isArray(formDay.dishes) && formDay.dishes.length > 0) {
          const newDay = newCreatedDays[idx]
          formDay.dishes.forEach((dish) => {
            dishPromises.push(createMealPlanDaysDishes(Number(mealPlanId), newDay.id, dish))
          })
        }
      })

      if (dishPromises.length > 0) {
        await Promise.all(dishPromises)
      }
    }

    // Delete days first
    let deletedDayIdsFromServer: number[] = []
    if (deletedDayIds.length > 0) {
      const deleteResult = await deleteMealPlanDay(mealPlanId, deletedDayIds)

      deletedDayIdsFromServer = deleteResult?.data?.deleted_day_ids || []
    }

    // Delete dishes
    if (deletedDishes.length > 0) {
      const dishesToDelete = deletedDishes.filter(({ dayId }) => !deletedDayIdsFromServer.includes(dayId))
      if (dishesToDelete.length > 0) {
        const deletePromises = dishesToDelete.map(({ dayId, dishId }) => deleteMealPlanDish(mealPlanId, dayId, dishId))
        await Promise.all(deletePromises)
      }
    }

    setDeletedDayIds([])
    setDeletedDishes([])

    toast.success('Cập nhật thực đơn thành công')
  }

  const handleCreateMealPlan = async (values: FormMealPlanValues) => {
    const { days, ...rest } = values
    const mealPlanResult = await createMealPlan(rest)
    const mealPlanId = mealPlanResult?.data?.id

    if (!mealPlanId) {
      throw new Error('Failed to get meal plan ID')
    }

    if (days.length) {
      const daysPayload = days.map(({ image }, index) => ({ day: index + 1, image }))
      const daysResult = await createMealPlanDays(Number(mealPlanId), daysPayload)
      const createdDays = daysResult?.data

      if (Array.isArray(createdDays)) {
        const dishesResults = await Promise.all(
          createdDays.map((day_item, idx) => {
            const formDay = days[idx]
            if (formDay && Array.isArray(formDay.dishes) && formDay.dishes.length > 0) {
              return Promise.all(
                formDay.dishes.map((dish) => {
                  const dishResult = createMealPlanDaysDishes(Number(mealPlanId), day_item.id, dish)
                  return dishResult
                })
              )
            }
            return Promise.resolve()
          })
        )
      }
    }
    toast.success('Tạo thực đơn thành công')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="days">Days & Dishes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Nhập thông tin cơ bản cho thực đơn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormInputField
                  form={form}
                  name="title"
                  label="Tên thực đơn"
                  required
                  placeholder="Nhập tên thực đơn"
                />

                <FormTextareaField
                  form={form}
                  name="subtitle"
                  label="Thông tin tóm tắt"
                  placeholder="Nhập thông tin tóm tắt"
                />

                <FormTextareaField
                  form={form}
                  name="description"
                  label="Thông tin chi tiết"
                  placeholder="Nhập thông tin chi tiết"
                />

                {/* <FormField
                  control={form.control}
                  name="image"
                  render={({ field: imageField }) => (
                    <FormItem>
                      <FormLabel>Hình đại diện</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={imageField.value as File[]}
                          onValueChange={imageField.onChange}
                          maxFileCount={1}
                          accept={{
                            'image/*': [],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormImageInputField form={form} name="image" label="Hình đại diện" placeholder="Nhập hình đại diện" />

                <FormSelectField
                  form={form}
                  name="calorie_id"
                  label="Calorie"
                  data={AVAILABLE_CALORIES}
                  placeholder="Chọn calory"
                />

                <FormSelectField
                  form={form}
                  name="diet_id"
                  label="Chế độ ăn"
                  data={AVAILABLE_DIETS}
                  placeholder="Chọn chế độ ăn"
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Thành phần</h3>
                    <Button type="button" variant="outline" onClick={addIngredient}>
                      <Plus className="h-4 w-4 mr-2" /> Thêm thành phần
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {ingredientFields.length === 0 ? (
                      <p className="text-muted-foreground italic">Chưa có thành phần</p>
                    ) : (
                      <div className="space-y-4">
                        {ingredientFields.map((ingredient, index) => (
                          <div key={ingredient.id}>
                            <FormItem className="p-4 border rounded-md">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">Thành phần {index + 1}</h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeIngredient(index)}
                                  disabled={ingredientFields.length === 1}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-4">
                                <FormInputField
                                  form={form}
                                  name={`meal_ingredients.${index}.name`}
                                  label="Tên thành phần"
                                  placeholder="Nhập tên thành phần"
                                />
                                <FormImageInputField
                                  form={form}
                                  name={`meal_ingredients.${index}.image`}
                                  label="Ảnh thành phần"
                                  placeholder="Nhập ảnh thành phần"
                                />

                                {/* <div>
                                    {field.value.image &&
                                    Array.isArray(field.value.image) &&
                                    field.value.image.length > 0 ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={URL.createObjectURL(field.value.image[0])}
                                            alt="Ingredient preview"
                                            className="w-24 h-24 object-cover rounded"
                                          />
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeIngredient(index)}
                                            disabled={field.value.image.length === 0}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ) : null}
                                    <FormField
                                      control={form.control}
                                      name={`meal_ingredients.${index}.image`}
                                      render={({ field: imageField }) => (
                                        <FormItem>
                                          <FormLabel>Ảnh thành phần</FormLabel>
                                          <FormControl>
                                            <FileUploader
                                              value={imageField.value as File[]}
                                              onValueChange={imageField.onChange}
                                              maxFileCount={1}
                                              accept={{
                                                'image/*': [],
                                              }}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div> */}
                              </div>
                            </FormItem>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormSwitchField
                    form={form}
                    name="is_public"
                    label="Public"
                    description="Make this meal plan visible to everyone"
                  />
                  <div className="flex items-start gap-4">
                    <FormSwitchField
                      form={form}
                      name="is_free"
                      label="Free"
                      description="Make this meal plan free for all users"
                    />
                    {isFree && (
                      <FormInputField
                        form={form}
                        name="free_days"
                        label="Số ngày miễn phí"
                        placeholder="Nhập số ngày miễn phí"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="days" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Days & Dishes</CardTitle>
                <CardDescription>Thiết lập các ngày và các món ăn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Danh sách ngày</h3>
                  <Button type="button" variant="outline" onClick={addDay}>
                    <Plus className="h-4 w-4 mr-2" /> Thêm ngày
                  </Button>
                </div>

                <div className="space-y-4">
                  {dayFields.length === 0 ? (
                    <p className="text-muted-foreground italic">Chưa có ngày nào</p>
                  ) : (
                    <div className="space-y-6">
                      {dayFields.map((day, dayIndex) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name={`days.${dayIndex}`}
                          render={({ field }) => {
                            const dishes = form.watch(`days.${dayIndex}.dishes`) || []
                            return (
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="border rounded-md w-full"
                                    defaultValue="day"
                                  >
                                    <AccordionItem value="day" className="border-none">
                                      <AccordionTrigger className="p-4 hover:no-underline">
                                        <div className="w-full">
                                          <h4 className="font-medium text-left">Ngày {dayIndex + 1}</h4>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="p-4 pt-0">
                                        <div className="space-y-6 mt-6">
                                          <FormImageInputField
                                            form={form}
                                            name={`days.${dayIndex}.image`}
                                            label="Hình đại diện"
                                            placeholder="Nhập hình đại diện"
                                          />
                                          <h5 className="font-medium">Danh sách món ăn</h5>
                                          {dishes.length === 0 ? (
                                            <p className="text-muted-foreground text-sm italic">Chưa có món ăn nào</p>
                                          ) : (
                                            <div className="space-y-8">
                                              {dishes.map((dish, dishIndex) => (
                                                <div key={dishIndex} className="border rounded-md p-4 relative">
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeDish(dayIndex, dishIndex)}
                                                    className="absolute top-2 right-2 text-destructive hover:text-destructive"
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>

                                                  <h6 className="font-medium mb-4">Món ăn {dishIndex + 1}</h6>

                                                  <div className="space-y-8">
                                                    <DishFormFields
                                                      form={form}
                                                      namePrefix={`days.${dayIndex}.dishes.${dishIndex}`}
                                                      isShowImage={false}
                                                    />
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addDish(dayIndex)}
                                            className="mt-4 w-full"
                                          >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Thêm món ăn
                                          </Button>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveDay(dayIndex)}
                                  disabled={dayFields.length === 1}
                                  className="text-destructive hover:text-destructive mt-3"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <MainButton text={isEdit ? 'Cập nhật thực đơn' : 'Tạo thực đơn'} type="submit" loading={isPending} />
      </form>
    </Form>
  )
}
