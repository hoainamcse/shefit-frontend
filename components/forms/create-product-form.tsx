'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/multi-select'
import { FileUploader } from '@/components/file-uploader'
import { MainButton } from '@/components/buttons/main-button'
import { ChevronsLeftRightEllipsisIcon, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Check, X } from 'lucide-react'
import { FormInputField, FormMultiSelectField, FormTextareaField } from './fields'

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  features: z
    .array(
      z.object({
        name: z.string(),
        image: z.string(),
      })
    )
    .optional(),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  outOfStock: z.array(
    z.object({
      size: z.string().optional(),
      color: z.string().optional(),
      isOutOfStock: z.boolean(),
    })
  ),
})

type ProductFormValues = z.infer<typeof formSchema>

// Available sizes and colors for selection
const AVAILABLE_SIZES = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: '2XL' },
]

const AVAILABLE_COLORS = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'gray', label: 'Gray' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
]

interface ProductFormProps {
  isEdit?: boolean
  data?: ProductFormValues
}

// Helper function to determine if a string is a URL
const isUrl = (str: string) => {
  return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('blob:')
}

// Helper function to create file values based on mode (edit or create)
const useFileValues = (isEdit: boolean, fieldValue: string[], fileObjects: File[]) => {
  if (isEdit && fieldValue && fieldValue.length > 0) {
    return fieldValue.map((url) => {
      if (isUrl(url) && !url.startsWith('blob:')) {
        return Object.assign(new File([], url.split('/').pop() || 'image.jpg', { type: 'image/jpeg' }), {
          preview: url,
        })
      } else if (url.startsWith('blob:')) {
        const matchingFile = fileObjects.find((file) => 'preview' in file && file.preview === url)

        if (matchingFile) {
          return matchingFile //
          //  Use the original file with its name
        }

        return Object.assign(new File([], 'uploaded-image.jpg', { type: 'image/jpeg' }), {
          preview: url,
        })
      }
      return Object.assign(new File([], 'image.jpg', { type: 'image/jpeg' }), {
        preview: url,
      })
    })
  }
  return fileObjects
}

// Helper function to extract preview URLs from File objects
const extractPreviewUrls = (files: File[]): string[] => {
  return files
    .map((file) => {
      if ('preview' in file && typeof file.preview === 'string') {
        return file.preview
      }
      return ''
    })
    .filter((url) => url !== '')
}

export default function CreateProductForm({ isEdit = false, data }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: '',
      description: '',
      price: '',
      images: [],
      features: [],
      sizes: [],
      colors: [],
      outOfStock: [],
    },
  })

  const selectedSizes = form.watch('sizes')
  const selectedColors = form.watch('colors')

  // Initialize outOfStock when sizes or colors change
  useEffect(() => {
    const currentOutOfStock = form.getValues('outOfStock') || []
    let variants: { size?: string; color?: string; isOutOfStock: boolean }[] = []

    // Helper function to find an existing variant and preserve its status
    const findExistingVariant = (size?: string, color?: string) => {
      return currentOutOfStock.find((v) => (size ? v.size === size : !v.size) && (color ? v.color === color : !v.color))
    }

    // Helper function to add a variant (existing or new)
    const addVariant = (size?: string, color?: string) => {
      const existingVariant = findExistingVariant(size, color)
      if (existingVariant) {
        variants.push(existingVariant)
      } else {
        variants.push({ size, color, isOutOfStock: false })
      }
    }

    // Case 1: No variants (simple product)
    if (selectedSizes.length === 0 && selectedColors.length === 0) {
      variants = currentOutOfStock.length ? [...currentOutOfStock] : [{ isOutOfStock: false }]
    }
    // Case 2: Both size and color variants
    else if (selectedSizes.length > 0 && selectedColors.length > 0) {
      selectedSizes.forEach((size) => {
        selectedColors.forEach((color) => {
          addVariant(size, color)
        })
      })
    }
    // Case 3: Size variants only
    else if (selectedSizes.length > 0) {
      selectedSizes.forEach((size) => {
        addVariant(size)
      })
    }
    // Case 4: Color variants only
    else if (selectedColors.length > 0) {
      selectedColors.forEach((color) => {
        addVariant(undefined, color)
      })
    }

    form.setValue('outOfStock', variants)
  }, [selectedSizes, selectedColors, form])

  const outOfStock = form.watch('outOfStock')

  function onSubmit(values: ProductFormValues) {
    console.log(values)
    // TODO: Implement your submit logic here
  }

  const addFeature = () => {
    const currentFeatures = form.getValues('features') || []
    form.setValue('features', [...currentFeatures, { name: '', image: '' }])
  }

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || []
    form.setValue(
      'features',
      currentFeatures.filter((_, i) => i !== index)
    )
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
              <FormInputField form={form} name="price" label="Giá" required type="number" placeholder="Nhập giá" />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => {
                  // State to track the actual File objects for display
                  const [fileObjects, setFileObjects] = useState<File[]>([])

                  // Create file values based on mode (edit or create)
                  const fileValues = useFileValues(isEdit, field.value, fileObjects)

                  return (
                    <FormItem>
                      <FormLabel>Hình ảnh sản phẩm</FormLabel>
                      <FormControl>
                        <FileUploader
                          multiple
                          maxSize={1024 * 1024 * 10}
                          maxFileCount={10}
                          value={fileValues}
                          onValueChange={(files) => {
                            // Save the File objects for display
                            setFileObjects(files)
                            // Extract preview URLs and update form
                            const urls = extractPreviewUrls(files)
                            field.onChange(urls)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
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
                  <div key={index} className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`features.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Tên tính năng" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.image`}
                      render={({ field }) => {
                        // State to track the actual File objects for display
                        const [fileObjects, setFileObjects] = useState<File[]>([])

                        // Create file values based on mode (edit or create)
                        const fileValue = useFileValues(isEdit, field.value ? [field.value] : [], fileObjects)

                        return (
                          <FormItem className="flex-1">
                            <FormControl>
                              <FileUploader
                                value={fileValue}
                                onValueChange={(files) => {
                                  // Save the File objects for display
                                  setFileObjects(files)

                                  // Extract preview URL from File object and update form
                                  const urls = extractPreviewUrls(files)
                                  field.onChange(urls.length > 0 ? urls[0] : '')
                                }}
                                maxFileCount={1}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    <MainButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={Trash2}
                      className="text-destructive"
                      onClick={() => removeFeature(index)}
                    />
                  </div>
                ))}
              </div>

              <FormMultiSelectField
                form={form}
                name="sizes"
                data={AVAILABLE_SIZES}
                label="Kích cỡ"
                placeholder="Chọn kích cỡ"
              />

              <FormMultiSelectField
                form={form}
                name="colors"
                data={AVAILABLE_COLORS}
                label="Màu sắc"
                placeholder="Chọn màu sắc"
              />

              {/* Stock Management Section */}
              <FormField
                control={form.control}
                name="outOfStock"
                render={() => (
                  <FormItem>
                    <FormLabel>Quản lý tồn kho</FormLabel>
                    <FormControl>
                      {selectedSizes.length === 0 && selectedColors.length === 0 ? (
                        // Single toggle for no variants with dynamic text
                        <div className="flex items-center space-x-2 w-fit rounded-lg border px-3 py-2">
                          <Switch
                            checked={outOfStock[0]?.isOutOfStock || false}
                            onCheckedChange={(checked) => {
                              form.setValue('outOfStock', [{ isOutOfStock: checked }])
                            }}
                          />
                          <span className={outOfStock[0]?.isOutOfStock ? 'text-destructive' : 'text-green-600'}>
                            {outOfStock[0]?.isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
                          </span>
                        </div>
                      ) : (
                        // Variant table with improved UI
                        <div className="rounded-md border">
                          <div className="relative p-3 border-b">
                            <span className="font-medium">Trạng thái tồn kho</span>
                            {/* Create a flex container that mirrors the table layout */}
                            <div className="absolute inset-0 flex items-center">
                              <div className="flex w-full">
                                {/* Create empty flex items to push the button to the right position */}
                                {selectedSizes.length > 0 && <div className="flex-1"></div>}
                                {selectedColors.length > 0 && <div className="flex-1"></div>}
                                {/* The last flex item contains the button and has the same width as the "Hết hàng" column */}
                                <div className="flex justify-center items-center" style={{ width: '200px' }}>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className={
                                      outOfStock.every((v) => v.isOutOfStock) ? 'text-destructive' : 'text-green-600'
                                    }
                                    onClick={(e) => {
                                      e.preventDefault() // Prevent form submission
                                      e.stopPropagation() // Stop event propagation
                                      const willBeOutOfStock = !outOfStock.every((v) => v.isOutOfStock)
                                      const newOutOfStock = outOfStock.map((variant) => ({
                                        ...variant,
                                        isOutOfStock: willBeOutOfStock,
                                      }))
                                      form.setValue('outOfStock', newOutOfStock)
                                    }}
                                  >
                                    {outOfStock.every((v) => v.isOutOfStock) ? (
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
                                  {selectedSizes.length > 0 && <TableHead className="px-3">Kích cỡ</TableHead>}
                                  {selectedColors.length > 0 && <TableHead className="px-3">Màu sắc</TableHead>}
                                  <TableHead className="px-3 text-center w-[200px]">Hết hàng</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {outOfStock.map((variant, index) => (
                                  <TableRow key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                    {selectedSizes.length > 0 && (
                                      <TableCell className="p-3">
                                        {AVAILABLE_SIZES.find((s) => s.value === variant.size)?.label}
                                      </TableCell>
                                    )}
                                    {selectedColors.length > 0 && (
                                      <TableCell className="p-3">
                                        {AVAILABLE_COLORS.find((c) => c.value === variant.color)?.label}
                                      </TableCell>
                                    )}
                                    <TableCell className="p-3 text-center">
                                      <Checkbox
                                        checked={variant.isOutOfStock}
                                        onCheckedChange={(checked) => {
                                          const newOutOfStock = [...outOfStock]
                                          newOutOfStock[index] = { ...variant, isOutOfStock: checked === true }
                                          form.setValue('outOfStock', newOutOfStock)
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
              <MainButton text={isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'} type="submit" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
