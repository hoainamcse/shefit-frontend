'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { useEffect, useMemo, useState, useTransition } from 'react'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUploader } from '@/components/file-uploader'
import { toast } from 'sonner'
import { MainButton } from '@/components/buttons/main-button'
import { AddButton } from '@/components/buttons/add-button'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '../ui/card'
import { Subscription } from '@/models/subscription-admin'
import { FormInputField, FormMultiSelectField, FormSelectField, FormRichTextField } from './fields'
import { useRouter } from 'next/navigation'
import { createSubscription, updateSubscription } from '@/network/server/subscriptions-admin'
import { createGift } from '@/network/server/gifts'
import { updateGift } from '@/network/server/gifts'
import { updateSubscriptionPrice } from '@/network/server/subscriptions-admin'
import { getCourses } from '@/network/server/courses-admin'
import { giftTypeOptions } from '@/lib/label'
import { ImageUploader } from '../image-uploader'
// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Tên gói phải có ít nhất 3 ký tự.',
  }),
  course_format: z.enum(['video', 'live', 'both'], {
    required_error: 'Vui lòng chọn loại hình.',
  }),
  course_ids: z.array(z.string()).optional(),
  meal_plan_ids: z.array(z.string()).optional(),
  description_1: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  description_2: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  result_checkup: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  cover_image: z.string().optional(),
  thumbnail_image: z.string().optional(),
  gifts: z
    .array(
      z.discriminatedUnion('type', [
        z.object({
          id: z.number().optional(),
          type: z.literal('membership_month'),
          month_count: z.coerce.number().min(1, { message: 'Số tháng phải lớn hơn 0' }),
        }),
        z.object({
          id: z.number().optional(),
          type: z.literal('item'),
          name: z.string().min(1, { message: 'Tên quà tặng không được để trống' }),
          image: z.string().optional(),
        }),
      ])
    )
    .optional(),
  prices: z
    .array(
      z.object({
        id: z.number().optional(),
        price: z.number().min(0, { message: 'Giá tiền không được âm' }),
        duration: z.number().min(1, { message: 'Thời gian phải lớn hơn 0' }),
      })
    )
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

type MembershipFormProps = {
  isEdit: boolean
  data?: Subscription
}

const AVAILABLE_COURSE_FORMATS = [
  { value: 'video', label: 'Video' },
  { value: 'live', label: 'Zoom' },
  { value: 'both', label: 'Video & Zoom' },
]

export function CreateMembershipForm({ isEdit, data }: MembershipFormProps) {
  const [isPending, startTransition] = useTransition()
  const [courseList, setCourseList] = useState<any[]>([])

  const router = useRouter()

  const AVAILABLE_COURSES = useMemo(
    () => courseList.map((course) => ({ value: course.id.toString(), label: course.course_name })),
    [courseList]
  )

  const fetchCourses = async (format?: 'video' | 'live' | 'both') => {
    if (format === 'both') {
      const response = await getCourses()
      setCourseList(response.data || [])
    } else {
      const response = await getCourses(format)
      setCourseList(response.data || [])
    }
  }

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          ...data,
          meal_plan_ids: data.meal_plan_ids.map((mealPlanId) => mealPlanId.toString()),
          course_ids: data.course_ids.map((courseId) => courseId.toString()),
        }
      : {
          name: '',
          course_format: 'video',
          course_ids: [],
          prices: [],
          gifts: [],
          cover_image: '',
          thumbnail_image: '',
          description_1: '',
          description_2: '',
        },
  })

  // Setup field arrays for gifts and prices
  const {
    fields: giftFields,
    append: appendGift,
    remove: removeGift,
  } = useFieldArray({
    control: form.control,
    name: 'gifts',
  })

  const {
    fields: priceFields,
    append: appendPrice,
    remove: removePrice,
  } = useFieldArray({
    control: form.control,
    name: 'prices',
  })

  // Add a new gift
  const addGift = () => {
    appendGift({
      type: 'item',
      name: '',
      image: '',
    })
  }

  // Handle gift type change
  const handleGiftTypeChange = (value: string, index: number) => {
    const currentGifts = form.getValues('gifts') || []
    const updatedGifts = [...currentGifts]

    if (value === 'membership_month') {
      updatedGifts[index] = {
        type: 'membership_month',
        month_count: 1,
        id: updatedGifts[index].id,
      }
    } else {
      updatedGifts[index] = {
        type: 'item',
        name: '',
        image: '',
        id: updatedGifts[index].id,
      }
    }

    form.setValue('gifts', updatedGifts, { shouldValidate: true })
  }

  // Add a new price
  const addPrice = () => {
    appendPrice({
      price: 0,
      duration: 1,
    })
  }

  const courseFormat = form.watch('course_format')

  useEffect(() => {
    fetchCourses(courseFormat)
  }, [courseFormat])

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        console.log('values', values)
        if (isEdit) {
          await handleEditMembership(values, data)
        } else {
          await handleCreateMembership(values)
          router.push('/admin/membership')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error(isEdit ? 'Cập nhật gói thành viên thất bại' : 'Tạo gói thành viên thất bại')
      }
    })
  }

  const handleCreateMembership = async (values: FormValues) => {
    let giftIds: number[] = []
    if (values.gifts && values.gifts.length > 0) {
      const createdGifts = await Promise.all(values.gifts.map((gift) => createGift(gift)))
      giftIds = createdGifts.filter((gift) => gift.status === 'success' && gift.data).map((gift) => gift.data.id)
    }
    const { gifts, ...rest } = values
    const subscriptionData = {
      ...rest,
      gift_ids: giftIds,
    }

    await createSubscription(subscriptionData)
    toast.success('Tạo gói thành viên thành công')
  }

  const handleEditMembership = async (values: FormValues, data?: Subscription) => {
    const giftsWithId = (values.gifts ?? []).filter((gift) => gift.id)
    const giftsWithoutId = (values.gifts ?? []).filter((gift) => !gift.id)

    const updatePromises = giftsWithId.map((gift) => updateGift(String(gift.id), gift))
    const createPromises = giftsWithoutId.map((gift) => createGift(gift))

    const updatedGifts = await Promise.all(updatePromises)
    const createdGifts = await Promise.all(createPromises)

    const updatedGiftIds = giftsWithId.map((gift) => gift.id)
    const createdGiftIds = createdGifts
      .filter((gift) => gift.status === 'success' && gift.data)
      .map((gift) => gift.data.id)
    const giftIds = [...updatedGiftIds, ...createdGiftIds]

    await updateSubscriptionPrice(data!.id!, values.prices)

    const { gifts, prices, ...rest } = values
    const subscriptionData = {
      ...rest,
      gift_ids: giftIds,
    }

    await updateSubscription(data!.id!, subscriptionData)
    toast.success('Cập nhật gói thành viên thành công')
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormInputField
                form={form}
                name="name"
                label="Tên gói"
                placeholder="Nhập tên gói thành viên"
                withAsterisk
              />

              <FormSelectField
                form={form}
                name="course_format"
                label="Loại hình"
                data={AVAILABLE_COURSE_FORMATS}
                placeholder="Chọn loại hình"
                withAsterisk
              />

              <FormRichTextField
                form={form}
                name="description_1"
                label="Thông tin tóm tắt gói"
                placeholder="Nhập thông tin tóm tắt gói"
                withAsterisk
              />

              <FormRichTextField
                form={form}
                name="description_2"
                label="Thông tin chi tiết gói"
                placeholder="Nhập thông tin chi tiết gói"
                withAsterisk
              />

              <FormMultiSelectField
                form={form}
                name="course_ids"
                label="Khoá tập IDs"
                data={[]}
                placeholder="Khoá tập"
                withAsterisk
              />

              <FormMultiSelectField
                form={form}
                name="meal_plan_ids"
                label="Thực đơn IDs"
                data={[]}
                placeholder="Thực đơn"
                withAsterisk
              />

              <FormRichTextField
                form={form}
                name="result_checkup"
                label="Theo dõi kết quả"
                placeholder="Nhập thông tin theo dõi kết quả"
                withAsterisk
              />

              {/* {data?.cover_image && (
                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh</FormLabel>
                      <FormControl>
                        {typeof data?.cover_image === 'string' ? (
                          <div className="relative w-full h-48 overflow-hidden rounded-md">
                            <img src={data.cover_image} alt={data.name} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <FileUploader
                            value={field.value}
                            onValueChange={field.onChange}
                            maxFileCount={1}
                            accept={{
                              'image/*': [],
                            }}
                          />
                        )}
                      </FormControl>
                      <FormDescription>{'Tải lên hình ảnh minh họa cho gói thành viên'}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )} */}

              <ImageUploader
                form={form}
                name="cover_image"
                label="Hình ảnh minh họa"
                accept={{ 'image/*': [] }}
                maxFileCount={1}
              />

              {/* Gifts section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Quà tặng</h3>
                  <Button type="button" onClick={addGift}>
                    <Plus className="h-4 w-4 mr-2" /> Tạo quà tặng
                  </Button>
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
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeGift(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name={`gifts.${index}.type`}
                                  render={({ field: giftTypeField }) => (
                                    <FormItem>
                                      <FormLabel>Loại quà tặng</FormLabel>
                                      <Select
                                        onValueChange={(value) => {
                                          giftTypeField.onChange(value)
                                          handleGiftTypeChange(value, index)
                                        }}
                                        defaultValue={giftTypeField.value?.toString()}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Chọn loại quà tặng" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectGroup>
                                            {giftTypeOptions.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {field.value.type === 'item' && (
                                  <>
                                    <FormInputField form={form} name={`gifts.${index}.name`} label="Tên quà tặng" />

                                    <ImageUploader
                                      form={form}
                                      name={`gifts.${index}.image`}
                                      label="Hình ảnh quà tặng"
                                      accept={{ 'image/*': [] }}
                                      maxFileCount={1}
                                    />
                                  </>
                                )}

                                {field.value.type === 'membership_month' && (
                                  <FormInputField
                                    form={form}
                                    name={`gifts.${index}.month_count`}
                                    label="Số tháng"
                                    type="number"
                                  />
                                )}

                                {/* <div>
                                  {field.value.image &&
                                  Array.isArray(field.value.image) &&
                                  field.value.image.length > 0 ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={URL.createObjectURL(field.value.image[0])}
                                          alt="Gift preview"
                                          className="w-24 h-24 object-cover rounded"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            const newGifts = [...form.getValues('gifts')]
                                            newGifts[index].image = []
                                            form.setValue('gifts', newGifts, { shouldValidate: true })
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
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
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div> */}
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
                  <Button type="button" onClick={addPrice}>
                    <Plus className="h-4 w-4 mr-2" /> Tạo giá tiền gói
                  </Button>
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
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePrice(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.duration`}
                                  render={({ field: monthsField }) => (
                                    <FormItem>
                                      <FormLabel>Số tháng</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min="1"
                                          {...monthsField}
                                          onChange={(e) => {
                                            monthsField.onChange(parseInt(e.target.value) || 1)
                                          }}
                                          placeholder="Nhập số tháng"
                                          className="mt-1"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.price`}
                                  render={({ field: amountField }) => (
                                    <FormItem>
                                      <FormLabel>Giá tiền (VNĐ)</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          value={
                                            amountField.value
                                              ? new Intl.NumberFormat('vi-VN').format(amountField.value)
                                              : ''
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d]/g, '')
                                            const formattedValue = value
                                              ? new Intl.NumberFormat('vi-VN').format(parseInt(value))
                                              : ''
                                            e.target.value = formattedValue
                                            amountField.onChange(parseInt(value) || 0)
                                          }}
                                          placeholder="Nhập giá tiền"
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

              <MainButton
                text={isEdit ? 'Cập nhật gói thành viên' : 'Tạo gói thành viên'}
                type="submit"
                loading={isPending}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
