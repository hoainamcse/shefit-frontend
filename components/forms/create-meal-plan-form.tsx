'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUploader } from '@/components/file-uploader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { Trash2, Plus, Search } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FormMultiSelectField } from './fields/form-multi-select-field'
import { FormInputField, FormSwitchField, FormTextareaField } from './fields'
import CreateDishForm, { formSchema as dishFormSchema, DishFormFields, FormDishValues } from './create-dish-form'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal plan name must be at least 2 characters.',
  }),
  summary: z.string().min(10, {
    message: 'Summary must be at least 10 characters.',
  }),
  information: z.string().min(10, {
    message: 'Information must be at least 10 characters.',
  }),
  calory: z.string().min(1, {
    message: 'Calory value is required.',
  }),
  diet: z.string({
    required_error: 'Please select a diet type.',
  }),

  meal_ingredients: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Ingredient name is required'),
        image: z.union([z.string(), z.array(z.instanceof(File))]).optional(),
      })
    )
    .min(1, 'At least one ingredient is required'),
  days: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, 'Day title is required'),
        dishes: z.array(dishFormSchema).optional().default([]),
      })
    )
    .min(1, 'At least one day is required'),
  is_public: z.boolean().default(false),
  is_free: z.boolean().default(false),
})

type FormMealPlanValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormMealPlanValues> = {
  days: [{ title: 'Day 1', dishes: [] }], // Empty dishes array
  meal_ingredients: [{ name: '' }],
  is_public: false,
  is_free: false,
}

type CreateMealPlanFormProps = {
  isEdit: boolean
  data?: FormMealPlanValues
}

const AVAILABLE_DIETS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'regular', label: 'Regular' },
]

export default function CreateMealPlanForm({ isEdit = false, data }: CreateMealPlanFormProps) {
  const form = useForm<FormMealPlanValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit && data ? { ...data } : defaultValues,
  })

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    name: 'days',
    control: form.control,
  })

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: 'meal_ingredients',
    control: form.control,
  })

  // Add a new ingredient
  const addIngredient = () => {
    appendIngredient({
      id: Date.now().toString(),
      name: '',
      image: [],
    })
  }

  // Add a new day
  const addDay = () => {
    appendDay({
      id: Date.now().toString(),
      title: `Day ${dayFields.length + 1}`,
      dishes: [], // Empty dishes array
    })
  }

  // Add a new dish to a day
  const addDish = (dayIndex: number) => {
    const newDish = {
      name: '',
      preparation: '',
      diet: '',
      image: [],
      ingredients: [{ name: '', quantity: '', unit: '' }],
      nutrition: {
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
      },
    }

    const currentDishes = form.getValues(`days.${dayIndex}.dishes`) || []
    form.setValue(`days.${dayIndex}.dishes`, [...currentDishes, newDish])
  }

  // Remove a dish from a day
  const removeDish = (dayIndex: number, dishIndex: number) => {
    const currentDishes = form.getValues(`days.${dayIndex}.dishes`) || []
    const updatedDishes = currentDishes.filter((_, i) => i !== dishIndex)
    form.setValue(`days.${dayIndex}.dishes`, updatedDishes)
  }

  async function onSubmit(values: FormMealPlanValues) {
    try {
      // TODO: Implement API call
      console.log(values)
      toast.success('Meal plan created successfully!')
    } catch (error) {
      toast.error('Failed to create meal plan')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormInputField form={form} name="name" label="Tên thực đơn" required placeholder="Nhập tên thực đơn" />

                <FormTextareaField
                  form={form}
                  name="summary"
                  label="Thông tin tóm tắt"
                  placeholder="Nhập thông tin tóm tắt"
                />

                <FormTextareaField
                  form={form}
                  name="information"
                  label="Thông tin chi tiết"
                  placeholder="Nhập thông tin chi tiết"
                />

                <FormInputField form={form} name="calory" label="Calories" placeholder="Nhập số lượng calories" />

                <FormMultiSelectField
                  form={form}
                  name="diet"
                  data={AVAILABLE_DIETS}
                  label="Chế độ ăn"
                  placeholder="Chọn chế độ ăn"
                />

                {/* Ingredients section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Thành phần</h3>
                    <Button type="button" variant="outline" onClick={addIngredient}>
                      <Plus className="h-4 w-4 mr-2" /> Thêm thành phần
                    </Button>
                  </div>

                  {/* Ingredients list */}
                  <div className="space-y-4">
                    {ingredientFields.length === 0 ? (
                      <p className="text-muted-foreground italic">Chưa có thành phần</p>
                    ) : (
                      <div className="space-y-4">
                        {ingredientFields.map((ingredient, index) => (
                          <FormField
                            key={ingredient.id}
                            control={form.control}
                            name={`meal_ingredients.${index}`}
                            render={({ field }) => (
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

                                  <div>
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
                                  </div>
                                </div>
                              </FormItem>
                            )}
                          />
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

                  <FormSwitchField
                    form={form}
                    name="is_free"
                    label="Free"
                    description="Make this meal plan free for all users"
                  />
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

                {/* Days list */}
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
                                        {/* Dishes List */}
                                        <div className="space-y-6 mt-6">
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

                                                  {/* Using the DishFormFields component with the appropriate prefix */}
                                                  <div className="space-y-8">
                                                    <DishFormFields
                                                      form={form}
                                                      namePrefix={`days.${dayIndex}.dishes.${dishIndex}`}
                                                    />
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          {/* Add dish button */}
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
                                  onClick={() => removeDay(dayIndex)}
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

        <MainButton text={isEdit ? 'Cập nhật thực đơn' : 'Tạo thực đơn'} type="submit" />
      </form>
    </Form>
  )
}
