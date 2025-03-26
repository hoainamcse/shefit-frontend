'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Trash2 } from 'lucide-react'

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  features: z.array(z.object({
    name: z.string(),
    image: z.string()
  })).optional(),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
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

export default function CreateProduct() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      images: [],
      features: [],
      sizes: [],
      colors: [],
    },
  })

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
    form.setValue('features', currentFeatures.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên sản phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả sản phẩm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập giá"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(urls: string[]) => field.onChange(urls)}
                        onRemove={(url: string) => field.onChange(field.value.filter((current) => current !== url))}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload multiple product images
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FileUploader multiple maxSize={1024 * 1024 * 10} maxFileCount={10} />

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
                    {/* <FormField
                      control={form.control}
                      name={`features.${index}.image`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <ImageUpload
                              value={field.value ? [field.value] : []}
                              onChange={(urls: string[]) => field.onChange(urls[0])}
                              onRemove={() => field.onChange('')}
                              maxFiles={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <FileUploader />
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

              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <MultiSelectTrigger>
                          <MultiSelectValue placeholder="Select sizes" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                          <MultiSelectSearch placeholder="Search sizes..." />
                          <MultiSelectList>
                            {AVAILABLE_SIZES.map((size) => (
                              <MultiSelectItem
                                key={size.value}
                                value={size.value}
                              >
                                {size.label}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectList>
                        </MultiSelectContent>
                      </MultiSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <MultiSelectTrigger>
                          <MultiSelectValue placeholder="Select colors" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                          <MultiSelectSearch placeholder="Search colors..." />
                          <MultiSelectList>
                            {AVAILABLE_COLORS.map((color) => (
                              <MultiSelectItem
                                key={color.value}
                                value={color.value}
                              >
                                {color.label}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectList>
                        </MultiSelectContent>
                      </MultiSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <MainButton text="Tạo sản phẩm" type="submit" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
