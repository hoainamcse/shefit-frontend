'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainButton } from '@/components/buttons/main-button'
import { Plus, Trash2 } from 'lucide-react'
import { useTransition, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Check, X } from 'lucide-react'
import { FormInputField, FormMultiSelectField, FormNumberField, FormSelectField, FormTextareaField } from './fields'
import { ImageUploader } from '@/components/image-uploader'
import { Product, ProductCategory, ProductColor, ProductSize } from '@/models/product'
import { createProduct, getCategories, getColors, getSizes, updateProduct } from '@/network/client/products'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string(),
  price: z.coerce.number().min(1, 'Price must be at least 1'),
  weight: z.coerce.number().min(1, 'Weight must be at least 1'),
  category_id: z.coerce.number().nullable(),
  image_urls: z.array(z.string()),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  variants: z.array(
    z.object({
      id: z.number().optional(),
      size_id: z.coerce.number().nullable().optional(),
      color_id: z.coerce.number().nullable().optional(),
      in_stock: z.boolean(),
    })
  ),
  features: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        image_url: z.string(),
      })
    )
    .optional(),
  muscle_group_ids: z.array(z.coerce.number()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  isEdit?: boolean
  data?: Product
}

export default function CreateProductForm({ isEdit = false, data }: ProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Fetch available sizes with React Query
  const { data: sizesData, isLoading: isLoadingSizes } = useQuery({
    queryKey: ['product-sizes'],
    queryFn: getSizes,
    select: (response) =>
      (response.data || []).map((size: ProductSize) => ({
        value: size.id.toString(),
        label: size.size,
      })),
    placeholderData: keepPreviousData,
  })

  // Fetch available colors with React Query
  const { data: colorsData, isLoading: isLoadingColors } = useQuery({
    queryKey: ['product-colors'],
    queryFn: getColors,
    select: (response) =>
      (response.data || []).map((color: ProductColor) => ({
        value: color.id.toString(),
        label: color.name,
      })),
    placeholderData: keepPreviousData,
  })

  // Fetch available categories with React Query
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: getCategories,
    select: (response) =>
      (response.data || []).map((category: ProductCategory) => ({
        value: category.id.toString(),
        label: category.name,
      })),
    placeholderData: keepPreviousData,
  })

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          ...data,
          sizes: Array.from(
            new Set((data.variants || []).map((v) => v.size_id).filter((id) => id !== undefined && id !== null))
          ).map((id) => id.toString()),
          colors: Array.from(
            new Set((data.variants || []).map((v) => v.color_id).filter((id) => id !== undefined && id !== null))
          ).map((id) => id.toString()),
        }
      : {
          name: '',
          description: '',
          price: 0,
          weight: 0,
          category_id: null,
          image_urls: ['https://placehold.co/400/ffaeb0/white?text=shefit.vn&font=Oswald'],
          features: [],
          variants: [],
          sizes: [],
          colors: [],
          muscle_group_ids: [],
        },
  })

  const sizes = form.watch('sizes') ?? []
  const colors = form.watch('colors') ?? []

  useEffect(() => {
    const currentVariants = form.getValues('variants') || []

    const sizesList = (sizes ?? []).map(Number)
    const colorsList = (colors ?? []).map(Number)

    const findVariant = (sizeId: number | null, colorId: number | null) =>
      currentVariants.find((v) => v.size_id === sizeId && v.color_id === colorId)

    let newVariants: typeof currentVariants = []

    if (sizesList.length === 0 && colorsList.length === 0) {
      const existing = currentVariants.find((v) => v.size_id === null && v.color_id === null)

      newVariants = existing ? [{ ...existing }] : [{ size_id: null, color_id: null, in_stock: true }]
    } else if (sizesList.length && colorsList.length) {
      for (const sizeId of sizesList) {
        for (const colorId of colorsList) {
          const existing = findVariant(sizeId, colorId)
          newVariants.push(existing ?? { size_id: sizeId, color_id: colorId, in_stock: true })
        }
      }
    } else if (sizesList.length) {
      for (const sizeId of sizesList) {
        const existing = findVariant(sizeId, null)
        newVariants.push(existing ?? { size_id: sizeId, color_id: null, in_stock: true })
      }
    } else if (colorsList.length) {
      for (const colorId of colorsList) {
        const existing = findVariant(null, colorId)
        newVariants.push(existing ?? { size_id: null, color_id: colorId, in_stock: true })
      }
    }

    const isSame = JSON.stringify(currentVariants) === JSON.stringify(newVariants)

    if (!isSame) {
      form.setValue('variants', newVariants)
    }
  }, [sizes, colors, isEdit, form])

  const variants = form.watch('variants')

  const addFeature = () => {
    const currentFeatures = form.getValues('features') || []
    form.setValue('features', [...currentFeatures, { name: '', image_url: '' }])
  }

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || []
    form.setValue(
      'features',
      currentFeatures.filter((_, i) => i !== index)
    )
  }

  function onSubmit(values: ProductFormValues) {
    startTransition(() => {
      ;(async () => {
        try {
          const productData = {
            name: values.name,
            description: values.description,
            price: values.price,
            weight: values.weight,
            category_id: values.category_id,
            image_urls: values.image_urls,
            variants: values.variants,
            features: values.features,
            muscle_group_ids: values.muscle_group_ids || [],
          }

          if (isEdit) {
            await handleEditProduct(productData, data)
          } else {
            await handleCreateProduct(productData)
          }
        } catch (error) {
          console.error('Error creating product:', error)
        }
      })()
    })
    // TODO: Implement your submit logic here
  }

  const handleCreateProduct = async (values: any) => {
    const result = await createProduct(values)
    if (result.status === 'success') {
      toast.success('Product created successfully!')
      router.push(`/admin/products/${result.data.id}`)
    }
  }

  const handleEditProduct = async (values: any, data?: Product) => {
    if (!data?.id) return
    const result = await updateProduct(data.id.toString(), values)
    if (result.status === 'success') {
      toast.success('Product updated successfully!')
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormInputField form={form} name="name" label="Tên sản phẩm" required placeholder="Nhập tên sản phẩm" />
              <FormTextareaField
                form={form}
                name="description"
                label="Mô tả"
                required
                placeholder="Nhập mô tả sản phẩm"
              />
              <FormNumberField form={form} name="price" label="Giá (đ)" required placeholder="Nhập giá" />
              <FormNumberField
                form={form}
                name="weight"
                label="Khối lượng (kg)"
                required
                placeholder="Nhập khối lượng"
              />

              {!isLoadingCategories && (
                <FormSelectField
                  form={form}
                  name="category_id"
                  label="Phân loại"
                  data={categoriesData}
                  placeholder="Chọn loại sản phẩm"
                  withAsterisk
                />
              )}

              <ImageUploader form={form} name="image_urls" accept={{ 'image/*': [] }} maxFileCount={10} />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Tính năng</FormLabel>
                  <MainButton
                    type="button"
                    size="sm"
                    onClick={addFeature}
                    icon={Plus}
                    variant="outline"
                    text="Thêm tính năng"
                  />
                </div>

                {form.watch('features')?.map((feature, index) => (
                  <div key={index}>
                    <FormItem className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Tính năng {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <FormInputField
                          form={form}
                          name={`features.${index}.name`}
                          label="Tên tính năng"
                          placeholder="Nhập tên tính năng"
                        />

                        <ImageUploader
                          form={form}
                          name={`features.${index}.image_url`}
                          label="Hình ảnh tính năng"
                          accept={{ 'image/*': [] }}
                          maxFileCount={1}
                        />
                      </div>
                    </FormItem>
                  </div>
                ))}
              </div>

              {!isLoadingSizes && (
                <FormMultiSelectField
                  form={form}
                  name="sizes"
                  data={sizesData}
                  label="Kích cỡ"
                  placeholder="Chọn kích cỡ"
                />
              )}
              {!isLoadingColors && (
                <FormMultiSelectField
                  form={form}
                  name="colors"
                  data={colorsData}
                  label="Màu sắc"
                  placeholder="Chọn màu sắc"
                />
              )}

              {/* Stock Management Section */}
              <FormField
                control={form.control}
                name="variants"
                render={() => (
                  <FormItem>
                    <FormLabel>Quản lý tồn kho</FormLabel>
                    <FormControl>
                      {sizes?.length === 0 && colors?.length === 0 ? (
                        <div className="flex items-center space-x-2 w-fit rounded-lg border px-3 py-2">
                          <Switch
                            checked={!variants[0]?.in_stock}
                            onCheckedChange={(checked) => {
                              form.setValue('variants', [{ ...variants[0], in_stock: !checked }])
                            }}
                          />
                          <span className={variants[0]?.in_stock ? 'text-green-600' : 'text-destructive'}>
                            {variants[0]?.in_stock ? 'Còn hàng' : 'Hết hàng'}
                          </span>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <div className="relative p-3 border-b">
                            <span className="font-medium">Trạng thái tồn kho</span>
                            <div className="absolute inset-0 flex items-center">
                              <div className="flex w-full">
                                {sizes?.length > 0 && <div className="flex-1"></div>}
                                {colors?.length > 0 && <div className="flex-1"></div>}
                                <div className="flex justify-center items-center" style={{ width: '200px' }}>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className={
                                      variants.some((v) => !v.in_stock) ? 'text-green-600' : 'text-destructive'
                                    }
                                    onClick={() => {
                                      const shouldSetAllInStock = variants.some((v) => !v.in_stock)
                                      const newInStockStatus = shouldSetAllInStock ? true : false
                                      const newVariants = variants.map((variant) => ({
                                        ...variant,
                                        in_stock: newInStockStatus,
                                      }))

                                      form.setValue('variants', newVariants)
                                    }}
                                  >
                                    {variants.some((v) => !v.in_stock) ? (
                                      <>
                                        <Check className="w-4 h-4 mr-1" />
                                        Còn hàng tất cả
                                      </>
                                    ) : (
                                      <>
                                        <X className="w-4 h-4 mr-1" />
                                        Hết hàng tất cả
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full overflow-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {sizes.length > 0 && <TableHead className="px-3">Kích cỡ</TableHead>}
                                  {colors.length > 0 && <TableHead className="px-3">Màu sắc</TableHead>}
                                  <TableHead className="px-3 text-center w-[200px]">Hết hàng</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {variants.map((variant, index) => (
                                  <TableRow key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                    {sizes.length > 0 && sizesData && (
                                      <TableCell className="p-3">
                                        {sizesData.find((s) => s.value === variant.size_id?.toString())?.label}
                                      </TableCell>
                                    )}
                                    {colors?.length > 0 && colorsData && (
                                      <TableCell className="p-3">
                                        {colorsData.find((c) => c.value === variant.color_id?.toString())?.label}
                                      </TableCell>
                                    )}
                                    <TableCell className="p-3 text-center">
                                      <Checkbox
                                        checked={!variant.in_stock}
                                        onCheckedChange={(checked) => {
                                          const newVariants = [...variants]
                                          newVariants[index] = { ...variant, in_stock: !checked }
                                          form.setValue('variants', newVariants)
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
              <MainButton text={isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'} type="submit" loading={isPending} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
