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

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Dish name must be at least 2 characters.',
  }),
  preparation: z.string().min(10, {
    message: 'Preparation instructions must be at least 10 characters.',
  }),
  diet: z.string({
    required_error: 'Please select a diet type.',
  }),
  image: z.array(z.instanceof(File)).optional(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, 'Ingredient name is required'),
        quantity: z.string().min(1, 'Quantity is required'),
        unit: z.string().min(1, 'Unit is required'),
      })
    )
    .min(1, 'At least one ingredient is required'),
  nutrition: z.object({
    calories: z.string().min(1, 'Calories value is required'),
    protein: z.string().min(1, 'Protein value is required'),
    carbs: z.string().min(1, 'Carbs value is required'),
    fat: z.string().min(1, 'Fat value is required'),
    fiber: z.string().min(1, 'Fiber value is required'),
  }),
})

export type FormDishValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormDishValues> = {
  ingredients: [{ name: '', quantity: '', unit: '' }],
  nutrition: {
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
  },
}

type CreateDishFormProps = {
  isEdit: boolean
  data?: FormDishValues
  namePrefix?: string
}

export default function CreateDishForm({ isEdit, data, namePrefix = '' }: CreateDishFormProps) {
  const form = useForm<FormDishValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit && data ? { ...data } : defaultValues,
  })

  async function onSubmit(values: FormDishValues) {
    try {
      // TODO: Implement your API call here
      console.log(values)
      toast.success('Dish created successfully!')
    } catch (error) {
      toast.error('Failed to create dish')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DishFormFields form={form} namePrefix={namePrefix} />
        <MainButton text={isEdit ? 'Cập nhật món ăn' : 'Tạo món ăn'} type="submit" />
      </form>
    </Form>
  )
}

// Component to export the dish form fields for reuse
type DishFormFieldsProps = {
  form: any
  namePrefix?: string
}

export const DishFormFields = ({ form, namePrefix = '' }: DishFormFieldsProps) => {
  const prefixedName = (name: string) => (namePrefix ? `${namePrefix}.${name}` : name)

  // Get field array for ingredients
  const { fields, append, remove } = useFieldArray({
    name: prefixedName('ingredients'),
    control: form.control,
  })

  const addIngredient = React.useCallback(() => {
    append({ name: '', quantity: '', unit: '' })
  }, [append])

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
        name={prefixedName('preparation')}
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

      <FormField
        control={form.control}
        name={prefixedName('diet')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại chế độ</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn một chế độ ăn" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={prefixedName('image')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh món ăn</FormLabel>
            <FormControl>
              <FileUploader
                value={field.value || []}
                onChange={field.onChange}
                accept={{ 'image/*': [] }}
                maxFileCount={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
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
      </div>

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
                  name={`${prefixedName('nutrition')}.calories`}
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
                  name={`${prefixedName('nutrition')}.protein`}
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
                  name={`${prefixedName('nutrition')}.carbs`}
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
                  name={`${prefixedName('nutrition')}.fat`}
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
                  name={`${prefixedName('nutrition')}.fiber`}
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
