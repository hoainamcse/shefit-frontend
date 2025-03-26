'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUploader } from '@/components/file-uploader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { Trash2 } from 'lucide-react'

const formSchema = z.object({
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
  ingredients: z.array(
    z.object({
      name: z.string().min(1, 'Ingredient name is required'),
      quantity: z.string().min(1, 'Quantity is required'),
      unit: z.string().min(1, 'Unit is required'),
    })
  ).min(1, 'At least one ingredient is required'),
  nutrition: z.object({
    calories: z.string().min(1, 'Calories value is required'),
    protein: z.string().min(1, 'Protein value is required'),
    carbs: z.string().min(1, 'Carbs value is required'),
    fat: z.string().min(1, 'Fat value is required'),
    fiber: z.string().min(1, 'Fiber value is required'),
  }),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  ingredients: [{ name: '', quantity: '', unit: '' }],
  nutrition: {
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
  },
}

export default function CreateDishPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    name: 'ingredients',
    control: form.control,
  })

  async function onSubmit(values: FormValues) {
    try {
      // TODO: Implement your API call here
      console.log(values)
      toast.success('Dish created successfully!')
    } catch (error) {
      toast.error('Failed to create dish')
    }
  }

  return (
    <ContentLayout title="Tạo món ăn">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
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
            name="preparation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hướng dẫn chế biến</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập hướng dẫn chế biến"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại chế độ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại chế độ" />
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh món ăn</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFileCount={1}
                    accept={{
                      'image/*': [],
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Tải lên ảnh rõ nét của món ăn đã chế biến
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <FormLabel>Nguyên liệu</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', quantity: '', unit: '' })}
              >
                Thêm nguyên liệu
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nguyên liệu</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead className="w-[100px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Tomatoes" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 2" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="e.g., pcs" />
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
                      name="nutrition.calories"
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
                      name="nutrition.protein"
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
                      name="nutrition.carbs"
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
                      name="nutrition.fat"
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
                      name="nutrition.fiber"
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

          <MainButton text="Tạo món ăn" type="submit" />
        </form>
      </Form>
    </ContentLayout>
  )
}
