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
import { Trash2 } from 'lucide-react'
import { FormSelectField } from './fields'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { Diet } from '@/models/diets'
import { getDiets } from '@/network/server/diets'
import { FormImageInputField } from './fields/form-image-input-field'
import { useRouter } from 'next/navigation'
import { createDish, updateDish } from '@/network/server/dish'

export const formSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, {
    message: 'Dish name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Preparation instructions must be at least 10 characters.',
  }),
  diet_id: z.coerce.number({
    message: 'Please select a diet type.',
  }),
  image: z.string().optional(),
  // ingredients: z
  //   .array(
  //     z.object({
  //       name: z.string().min(1, 'Ingredient name is required'),
  //       quantity: z.string().min(1, 'Quantity is required'),
  //       unit: z.string().min(1, 'Unit is required'),
  //     })
  //   )
  //   .min(1, 'At least one ingredient is required'),
  calories: z.coerce.number().min(0, 'Calories value is required'),
  protein: z.coerce.number().min(0, 'Protein value is required'),
  carb: z.coerce.number().min(0, 'Carbs value is required'),
  fat: z.coerce.number().min(0, 'Fat value is required'),
  fiber: z.coerce.number().min(0, 'Fiber value is required'),
  protein_source: z.array(z.string()).optional(),
  vegetable: z.array(z.string()).optional(),
  starch: z.array(z.string()).optional(),
  spices: z.array(z.string()).optional(),
  others: z.array(z.string()).optional(),
  meal_time: z.string().optional(),
})

export type FormDishValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormDishValues> = {
  name: '',
  description: '',
  diet_id: undefined,
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

type CreateDishFormProps = {
  isEdit: boolean
  data?: FormDishValues
  namePrefix?: string
}

export default function CreateDishForm({ isEdit, data, namePrefix = '' }: CreateDishFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<FormDishValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || defaultValues,
  })

  async function onSubmit(values: FormDishValues) {
    startTransition(async () => {
      try {
        if (!isEdit) {
          const dishResult = await createDish(values)
          if (dishResult.status === 'success') {
            toast.success('Tạo món ăn thành công')
            router.push('/admin/dishes')
          }
        } else {
          if (data?.id) {
            const dishResult = await updateDish(data.id.toString(), values)
            if (dishResult.status === 'success') {
              toast.success('Cập nhật món ăn thành công')
            }
          }
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error(isEdit ? 'Cập nhật món ăn thất bại' : 'Tạo món ăn thất bại')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DishFormFields form={form} namePrefix={namePrefix} />
        <MainButton text={isEdit ? 'Cập nhật món ăn' : 'Tạo món ăn'} type="submit" loading={isPending} />
      </form>
    </Form>
  )
}

// Component to export the dish form fields for reuse
type DishFormFieldsProps = {
  form: any
  namePrefix?: string
  isDishMealPlan?: boolean
}

export const DishFormFields = ({ form, namePrefix = '', isDishMealPlan = false }: DishFormFieldsProps) => {
  const prefixedName = (name: string) => (namePrefix ? `${namePrefix}.${name}` : name)

  // // Get field array for ingredients
  // const { fields, append, remove } = useFieldArray({
  //   name: prefixedName('ingredients'),
  //   control: form.control,
  // })

  // const addIngredient = React.useCallback(() => {
  //   append({ name: '', quantity: '', unit: '' })
  // }, [append])

  const [dietList, setDietList] = useState<Diet[]>([])

  const AVAILABLE_DIETS = useMemo(
    () => dietList.map((diet) => ({ value: diet.id.toString(), label: diet.name })),
    [dietList]
  )

  useEffect(() => {
    const fetchMealPlans = async () => {
      const dietResponse = await getDiets()
      setDietList(dietResponse.data || [])
    }
    fetchMealPlans()
  }, [])

  return (
    <>
      <FormField
        control={form.control}
        name={prefixedName('name')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên món ăn</FormLabel>
            <FormControl>
              <Input placeholder="Nhập tên món ăn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={prefixedName('description')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hướng dẫn chế biến</FormLabel>
            <FormControl>
              <Textarea placeholder="Nhập hướng dẫn chế biến" className="min-h-[150px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!isDishMealPlan && (
        <FormSelectField
          form={form}
          name={prefixedName('diet_id')}
          label="Chế độ ăn"
          data={AVAILABLE_DIETS}
          placeholder="Chọn chế độ ăn"
        />
      )}

      {/* <FormField
        control={form.control}
        name={prefixedName('image')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh món ăn</FormLabel>
            <FormControl>
              <FileUploader
                value={field.value || undefined}
                onChange={field.onChange}
                accept={{ 'image/*': [] }}
                maxFileCount={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      {!isDishMealPlan && (
        <FormImageInputField
          form={form}
          name={prefixedName('image')}
          label="Hình đại diện"
          placeholder="Nhập hình đại diện"
        />
      )}

      {/* <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Nguyên liệu</FormLabel>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            Thêm nguyên liệu
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên nguyên liệu</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${prefixedName('ingredients')}.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Rice" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${prefixedName('ingredients')}.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${prefixedName('ingredients')}.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="e.g., cup" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <MainButton
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-destructive"
                    icon={Trash2}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}

      <div>
        <FormLabel className="block mb-4">Thông tin dinh dưỡng (cho 1 phần)</FormLabel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Calories (kcal)</TableHead>
              <TableHead>Protein (g)</TableHead>
              <TableHead>Carbs (g)</TableHead>
              <TableHead>Fat (g)</TableHead>
              <TableHead>Fiber (g)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <FormField
                  control={form.control}
                  name={prefixedName('calories')}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="number" min="0" placeholder="e.g., 250" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={prefixedName('protein')}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="number" min="0" step="0.1" placeholder="e.g., 20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={prefixedName('carb')}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="number" min="0" step="0.1" placeholder="e.g., 30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={prefixedName('fat')}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="number" min="0" step="0.1" placeholder="e.g., 10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={prefixedName('fiber')}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="number" min="0" step="0.1" placeholder="e.g., 5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
}
