'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { useTransition } from 'react'

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
import { FileUploader } from '@/components/file-uploader'
import { toast } from 'sonner'
import { MainButton } from '@/components/buttons/main-button'
import { AddButton } from '@/components/buttons/add-button'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '../ui/card'

// Define the Gift interface
export interface Gift {
  id: string
  name: string
  image?: string | File[]
}

// Define the Price interface
export interface Price {
  id: string
  months: number
  amount: number
}

// Define the Membership interface
export interface Membership {
  id?: string
  name: string
  type: 'Video' | 'Zoom' | 'Video & Zoom'
  firstDescription: string
  secondDescription: string
  image?: string | File[] 
  gifts: Gift[]
  prices: Price[]
  createdAt?: Date
  updatedAt?: Date
}

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Tên gói phải có ít nhất 3 ký tự.',
  }),
  type: z.enum(['Video', 'Zoom', 'Video & Zoom'], {
    required_error: 'Vui lòng chọn loại hình.',
  }),
  firstDescription: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  secondDescription: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  image: z.array(z.instanceof(File)).optional(),
  gifts: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Tên quà tặng không được để trống' }),
    image: z.union([z.string(), z.array(z.instanceof(File))]).optional()
  })),
  prices: z.array(z.object({
    id: z.string(),
    months: z.number().min(1, { message: 'Số tháng phải lớn hơn 0' }),
    amount: z.number().min(0, { message: 'Giá tiền không được âm' })
  }))
})

type FormValues = z.infer<typeof formSchema>

type MembershipFormProps = {
  typeForm: 'create' | 'edit' | 'view'
  data?: Membership
  onSuccess?: () => void
}

export function CreateMembershipForm({ typeForm, data, onSuccess }: MembershipFormProps) {
  const [isPending, startTransition] = useTransition()
  
  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || '',
      type: data?.type || 'Video',
      firstDescription: data?.firstDescription || '',
      secondDescription: data?.secondDescription || '',
      image: Array.isArray(data?.image) ? data.image : [],
      gifts: data?.gifts || [],
      prices: data?.prices || []
    }
  })

  // Setup field arrays for gifts and prices
  const { 
    fields: giftFields, 
    append: appendGift, 
    remove: removeGift 
  } = useFieldArray({
    control: form.control,
    name: "gifts"
  });

  const {
    fields: priceFields,
    append: appendPrice,
    remove: removePrice
  } = useFieldArray({
    control: form.control,
    name: "prices"
  });

  // Determine if the form should be read-only
  const isReadOnly = typeForm === 'view'

  // Add a new gift
  const addGift = () => {
    appendGift({
      id: Date.now().toString(),
      name: '',
      image: [],
    });
  }

  // Add a new price
  const addPrice = () => {
    appendPrice({
      id: Date.now().toString(),
      months: 1,
      amount: 0,
    });
  }

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        // For demonstration purposes, just log the values
        console.log(values)
        
        if (typeForm === 'create') {
          // TODO: Implement API call to create membership
          toast.success('Gói thành viên đã được tạo thành công!')
        } else if (typeForm === 'edit') {
          // TODO: Implement API call to update membership
          toast.success('Gói thành viên đã được cập nhật thành công!')
        }
        
        onSuccess?.()
      } catch (error) {
        toast.error(`Không thể ${typeForm === 'create' ? 'tạo' : 'cập nhật'} gói thành viên`)
      }
    })
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
              <FormLabel>Tên gói</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nhập tên gói thành viên" 
                  {...field} 
                  disabled={isReadOnly || isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại hình</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isReadOnly || isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                  <SelectItem value="Video & Zoom">Video & Zoom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả 1</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả đầu tiên"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isReadOnly || isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />    

        <FormField
          control={form.control}
          name="secondDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả 2</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả thứ hai"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isReadOnly || isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />    

        {(!isReadOnly || data?.image) && (
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  {isReadOnly && typeof data?.image === 'string' ? (
                    <div className="relative w-full h-48 overflow-hidden rounded-md">
                      <img 
                        src={data.image} 
                        alt={data.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFileCount={1}
                      accept={{
                        'image/*': [],
                      }}
                      disabled={isReadOnly || isPending}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  {!isReadOnly && 'Tải lên hình ảnh minh họa cho gói thành viên'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {/* Gifts section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Quà tặng</h3>
            {!isReadOnly && (
              <Button 
                type="button" 
                onClick={addGift}
                disabled={isPending}
              >
                <Plus className="h-4 w-4 mr-2" /> Tạo quà tặng
              </Button>
            )}
          </div>
          
          {/* Gift list */}
          <div className="space-y-4">
            {giftFields.length === 0 ? (
              <p className="text-muted-foreground italic">Chưa có quà tặng nào</p>
            ) : (
              <div className="space-y-4">
                {giftFields.map((gift, index) => (
                  <FormField
                    key={gift.id}
                    control={form.control}
                    name={`gifts.${index}`}
                    render={({ field }) => (
                      <FormItem className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Quà tặng {index + 1}</h4>
                          {!isReadOnly && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGift(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`gifts.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel>Tên quà tặng</FormLabel>
                                <FormControl>
                                  <Input
                                    {...nameField}
                                    disabled={isReadOnly || isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div>
                            {field.value.image && Array.isArray(field.value.image) && field.value.image.length > 0 ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={URL.createObjectURL(field.value.image[0])}
                                    alt="Gift preview"
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                  {!isReadOnly && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const newGifts = [...form.getValues('gifts')];
                                        newGifts[index].image = [];
                                        form.setValue('gifts', newGifts, { shouldValidate: true });
                                      }}
                                      disabled={isReadOnly || isPending}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : null}
                            <FormField
                              control={form.control}
                              name={`gifts.${index}.image`}
                              render={({ field: imageField }) => (
                                <FormItem>
                                  <FormLabel>Hình ảnh quà tặng</FormLabel>
                                  <FormControl>
                                    <FileUploader
                                      value={imageField.value as File[]}
                                      onValueChange={imageField.onChange}
                                      maxFileCount={1}
                                      accept={{
                                        'image/*': [],
                                      }}
                                      disabled={isReadOnly || isPending}
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
        
        {/* Prices section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Bảng giá</h3>
            {!isReadOnly && (
              <Button 
                type="button" 
                onClick={addPrice}
                disabled={isPending}
              >
                <Plus className="h-4 w-4 mr-2" /> Tạo giá tiền gói
              </Button>
            )}
          </div>
          
          {/* Price list */}
          <div className="space-y-4">
            {priceFields.length === 0 ? (
              <p className="text-muted-foreground italic">Chưa có giá tiền nào</p>
            ) : (
              <div className="space-y-4">
                {priceFields.map((price, index) => (
                  <FormField
                    key={price.id}
                    control={form.control}
                    name={`prices.${index}`}
                    render={({ field }) => (
                      <FormItem className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Giá tiền {index + 1}</h4>
                          {!isReadOnly && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePrice(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`prices.${index}.months`}
                            render={({ field: monthsField }) => (
                              <FormItem>
                                <FormLabel>Số tháng</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    {...monthsField}
                                    onChange={(e) => {
                                      monthsField.onChange(parseInt(e.target.value) || 1);
                                    }}
                                    placeholder="Nhập số tháng"
                                    disabled={isReadOnly || isPending}
                                    className="mt-1"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`prices.${index}.amount`}
                            render={({ field: amountField }) => (
                              <FormItem>
                                <FormLabel>Giá tiền (VNĐ)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    value={amountField.value ? new Intl.NumberFormat('vi-VN').format(amountField.value) : ''}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^\d]/g, '');
                                      const formattedValue = value ? new Intl.NumberFormat('vi-VN').format(parseInt(value)) : '';
                                      e.target.value = formattedValue;
                                      amountField.onChange(parseInt(value) || 0);
                                    }}
                                    placeholder="Nhập giá tiền"
                                    disabled={isReadOnly || isPending}
                                    className="mt-1"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {!isReadOnly && (
          <MainButton 
            text={typeForm === 'create' ? 'Tạo gói thành viên' : 'Cập nhật gói thành viên'} 
            type="submit" 
            disabled={isPending}
          />
        )}
      </form>
    </Form>
    </CardContent>
    </Card>
    </div>
  )
}