'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { useState, useTransition } from 'react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { MainButton } from '@/components/buttons/main-button'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '../ui/card'
import { Subscription } from '@/models/subscription'
import { FormInputField, FormSelectField, FormRichTextField, FormNumberField, FormImageSelectField } from './fields'
import { useRouter } from 'next/navigation'
import { createSubscription, updateSubscription, updateSubscriptionPrices } from '@/network/client/subscriptions'
import { createGift, updateGift } from '@/network/client/subscriptions'
import { giftTypeOptions } from '@/lib/label'
import { Label } from '../ui/label'
import { DialogEdit } from '../dialogs/dialog-edit'
import { CoursesTable } from '../data-table/courses-table'
import { MealPlansTable } from '../data-table/meal-plans-table'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { SheetEdit } from '../dialogs/sheet-edit'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Tên gói phải có ít nhất 3 ký tự.',
  }),
  course_format: z.enum(['video', 'live', 'both'], {
    required_error: 'Vui lòng chọn loại hình.',
  }),
  course_ids: z.array(z.string()).optional(),
  meal_plan_description: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  meal_plan_ids: z.array(z.string()).optional(),
  description_homepage: z.string(),
  description_1: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  description_2: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  result_checkup: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự.',
  }),
  assets: z.object({
    thumbnail: z.union([z.string().url(), z.string().max(0)]),
    mobile_cover: z.union([z.string().url(), z.string().max(0)]),
    desktop_cover: z.union([z.string().url(), z.string().max(0)]),
    youtube_cover: z.union([z.string().url(), z.string().max(0)]),
    homepage_thumbnail: z.union([z.string().url(), z.string().max(0)]),
  }),
  gifts: z
    .array(
      z.discriminatedUnion('type', [
        z.object({
          id: z.number().optional(),
          type: z.literal('membership_plan'),
          duration: z.coerce.number().min(1, { message: 'Số tháng phải lớn hơn 0' }),
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
  display_order: z.number(),
})

type FormValue = z.infer<typeof formSchema>

type CreateSubscriptionFormProps = {
  isEdit: boolean
  data?: Subscription
}

const AVAILABLE_COURSE_FORMATS = [
  { value: 'video', label: 'Video' },
  { value: 'live', label: 'Zoom' },
  { value: 'both', label: 'Video & Zoom' },
]

const DEFAULT_IMAGE_URL = 'https://placehold.co/400?text=shefit.vn&font=Oswald'

export function CreateSubscriptionForm({ isEdit, data }: CreateSubscriptionFormProps) {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const [openCoursesTable, setOpenCoursesTable] = useState(false)
  const [openMealPlansTable, setOpenMealPlansTable] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState(data?.relationships?.courses || [])
  const [selectedMealPlans, setSelectedMealPlans] = useState(data?.relationships?.meal_plans || [])
  const [isFreeSubscription, setIsFreeSubscription] = useState(
    data ? data.prices.length > 0 && data.prices.every((price) => price.price === 0) : false
  )

  // Initialize the form with default values
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          ...data,
          meal_plan_ids: data.relationships?.meal_plans?.map((mp) => mp.id.toString()) || [],
          course_ids: data.relationships?.courses?.map((c) => c.id.toString()) || [],
          assets: data.assets,
          course_format: data.course_format as 'video' | 'live' | 'both',
          gifts: data.relationships?.gifts || [],
          description_homepage: data.description_homepage || '',
          display_order: data.display_order || 0,
        }
      : {
          name: '',
          course_format: 'video',
          course_ids: [],
          prices: [],
          gifts: [],
          assets: {
            thumbnail: DEFAULT_IMAGE_URL,
            mobile_cover: DEFAULT_IMAGE_URL,
            desktop_cover: '',
            youtube_cover: '',
            homepage_thumbnail: '',
          },
          result_checkup: '',
          description_1: '',
          description_2: '',
          meal_plan_ids: [],
          meal_plan_description: '',
          description_homepage: '',
          display_order: 0,
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

    if (value === 'membership_plan') {
      updatedGifts[index] = {
        type: 'membership_plan',
        duration: 1,
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

  async function onSubmit(values: FormValue) {
    startTransition(async () => {
      try {
        const submitValues = values

        if (isEdit) {
          await handleEditSubscription(submitValues, data)
        } else {
          await handleCreateSubscription(submitValues)
          router.push('/admin/subscriptions')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error(isEdit ? 'Cập nhật gói thành viên thất bại' : 'Tạo gói thành viên thất bại')
      }
    })
  }

  const handleCreateSubscription = async (values: FormValue) => {
    let giftIds: number[] = []
    if (values.gifts && values.gifts.length > 0) {
      const createdGifts = await Promise.all(values.gifts.map((gift) => createGift(gift as any)))
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

  const handleEditSubscription = async (values: FormValue, data?: Subscription) => {
    const giftsWithId = (values.gifts ?? []).filter((gift) => gift.id)
    const giftsWithoutId = (values.gifts ?? []).filter((gift) => !gift.id)

    const updatePromises = giftsWithId.map((gift) => updateGift(gift.id!, gift as any))
    const createPromises = giftsWithoutId.map((gift) => createGift(gift as any))

    const updatedGifts = await Promise.all(updatePromises)
    const createdGifts = await Promise.all(createPromises)

    const updatedGiftIds = giftsWithId.map((gift) => gift.id)
    const createdGiftIds = createdGifts
      .filter((gift) => gift.status === 'success' && gift.data)
      .map((gift) => gift.data.id)
    const giftIds = [...updatedGiftIds, ...createdGiftIds]

    await updateSubscriptionPrices(data!.id!, values.prices)

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
              <div className="grid grid-cols-3 gap-4">
                <FormInputField
                  form={form}
                  name="name"
                  label="Tên gói"
                  placeholder="Nhập tên gói thành viên"
                  withAsterisk
                />

                <FormNumberField form={form} name="display_order" label="Thứ tự hiển thị" placeholder="e.g., 10" />

                <FormSelectField
                  form={form}
                  name="course_format"
                  label="Loại hình"
                  data={AVAILABLE_COURSE_FORMATS}
                  placeholder="Chọn loại hình"
                  withAsterisk
                />
              </div>

              <FormRichTextField
                form={form}
                name="description_1"
                label="Thông tin tóm tắt gói"
                placeholder="Nhập thông tin tóm tắt gói"
              />

              <FormRichTextField
                form={form}
                name="description_2"
                label="Thông tin chi tiết gói"
                placeholder="Nhập thông tin chi tiết gói"
              />

              <FormRichTextField
                form={form}
                name="description_homepage"
                label="Thông tin mô tả homepage"
                placeholder="Nhập thông tin mô tả homepage"
              />

              <FormRichTextField
                form={form}
                name="meal_plan_description"
                label="Thông tin chi tiết thực đơn"
                placeholder="Nhập thông tin chi tiết thực đơn"
              />

              <FormRichTextField
                form={form}
                name="result_checkup"
                label="Theo dõi kết quả"
                placeholder="Nhập thông tin theo dõi kết quả"
              />

              <div className="space-y-4 border p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormImageSelectField control={form.control} name="assets.thumbnail" label="Hình ảnh đại diện" />
                  <FormImageSelectField
                    control={form.control}
                    name="assets.homepage_thumbnail"
                    label="Hình ảnh đại diện (Homepage)"
                    description="Ảnh đại diện (mặc định) sẽ được sử dụng nếu không đặt"
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormImageSelectField
                    control={form.control}
                    name="assets.mobile_cover"
                    label="Hình ảnh bìa (Mobile)"
                  />
                  <FormImageSelectField
                    control={form.control}
                    name="assets.desktop_cover"
                    label="Hình ảnh bìa (Desktop)"
                    description="Ảnh bìa mobile sẽ được sử dụng nếu không đặt"
                  />
                </div>
                <FormInputField
                  form={form}
                  name="assets.youtube_cover"
                  label="Video bìa (YouTube)"
                  placeholder="Nhập URL video YouTube"
                  description="Ảnh bìa mobile sẽ được sử dụng nếu không đặt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Khoá tập</Label>
                  <Input
                    value={selectedCourses.map((c) => c.course_name).join(', ')}
                    onFocus={() => setOpenCoursesTable(true)}
                    placeholder="Chọn khoá tập"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thực đơn</Label>
                  <Input
                    value={selectedMealPlans.map((mp) => mp.title).join(', ')}
                    onFocus={() => setOpenMealPlansTable(true)}
                    placeholder="Chọn thực đơn"
                    readOnly
                  />
                </div>
              </div>

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

                                    <FormImageSelectField
                                      control={form.control}
                                      name={`gifts.${index}.image`}
                                      label="Hình ảnh quà tặng"
                                    />
                                  </>
                                )}

                                {field.value.type === 'membership_plan' && (
                                  <FormField
                                    control={form.control}
                                    name={`gifts.${index}.duration`}
                                    render={({ field: durationField }) => {
                                      const initialIsMonthMode =
                                        durationField.value % 35 === 0 && durationField.value !== 0
                                      const [isMonthMode, setIsMonthMode] = useState(initialIsMonthMode)

                                      const displayedValue =
                                        durationField.value === undefined || durationField.value === null
                                          ? ''
                                          : isMonthMode
                                          ? durationField.value / 35
                                          : durationField.value

                                      return (
                                        <FormItem>
                                          <div className="flex items-center">
                                            <FormLabel>Thời gian</FormLabel>
                                            <div className="flex items-center space-x-2">
                                              <ToggleGroup
                                                type="single"
                                                value={isMonthMode ? 'month' : 'day'}
                                                onValueChange={(value) => {
                                                  if (value === 'month') {
                                                    setIsMonthMode(true)
                                                  } else if (value === 'day') {
                                                    setIsMonthMode(false)
                                                  }
                                                }}
                                                aria-label="Chọn đơn vị thời gian"
                                              >
                                                <ToggleGroupItem value="day" aria-label="Chọn Ngày">
                                                  Ngày
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="month" aria-label="Chọn Tháng">
                                                  Tháng
                                                </ToggleGroupItem>
                                              </ToggleGroup>
                                            </div>
                                          </div>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min="1"
                                              value={displayedValue}
                                              onChange={(e) => {
                                                const value = parseInt(e.target.value)
                                                if (isNaN(value)) {
                                                  durationField.onChange(0)
                                                  return
                                                }
                                                if (isMonthMode) {
                                                  durationField.onChange(value * 35)
                                                } else {
                                                  durationField.onChange(value)
                                                }
                                              }}
                                              placeholder={isMonthMode ? 'Nhập số tháng' : 'Nhập số ngày'}
                                              className="mt-1"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )
                                    }}
                                  />
                                )}
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
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Label className="text-sm">Miễn phí</Label>
                      <Switch
                        checked={isFreeSubscription}
                        onCheckedChange={(checked) => {
                          setIsFreeSubscription(checked)
                          if (checked) {
                            form.setValue('prices', [
                              {
                                price: 0,
                                duration: 7, // Default to 7 days for free subscription
                              },
                            ])
                          } else {
                            removePrice(0) // Remove the free price if switching to paid
                            form.setValue('prices', [])
                          }
                        }}
                        className="ml-2"
                      />
                    </div>
                    {!isFreeSubscription && (
                      <Button type="button" onClick={addPrice}>
                        <Plus className="h-4 w-4 mr-2" /> Thêm giá tiền
                      </Button>
                    )}
                  </div>
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
                                <h4 className="font-medium">
                                  {isFreeSubscription ? 'Gói miễn phí' : `Giá tiền ${index + 1}`}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePrice(index)}
                                  className="text-destructive hover:text-destructive"
                                  disabled={isFreeSubscription}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.duration`}
                                  render={({ field: durationField }) => {
                                    const initialIsMonthMode = price.duration % 35 === 0 && price.duration !== 0
                                    const [isMonthMode, setIsMonthMode] = useState(initialIsMonthMode)

                                    const displayedValue =
                                      durationField.value === undefined || durationField.value === null
                                        ? ''
                                        : isMonthMode
                                        ? durationField.value / 35
                                        : durationField.value

                                    return (
                                      <FormItem>
                                        <div className="flex items-center">
                                          <FormLabel>Thời gian</FormLabel>
                                          <div className="flex items-center space-x-2">
                                            <ToggleGroup
                                              type="single"
                                              value={isMonthMode ? 'month' : 'day'}
                                              onValueChange={(value) => {
                                                if (value === 'month') {
                                                  setIsMonthMode(true)
                                                } else if (value === 'day') {
                                                  setIsMonthMode(false)
                                                }
                                              }}
                                              aria-label="Chọn đơn vị thời gian"
                                            >
                                              <ToggleGroupItem value="day" aria-label="Chọn Ngày">
                                                Ngày
                                              </ToggleGroupItem>
                                              <ToggleGroupItem value="month" aria-label="Chọn Tháng">
                                                Tháng
                                              </ToggleGroupItem>
                                            </ToggleGroup>
                                          </div>
                                        </div>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min="1"
                                            value={displayedValue}
                                            onChange={(e) => {
                                              const value = parseInt(e.target.value)
                                              if (isNaN(value)) {
                                                durationField.onChange(0)
                                                return
                                              }
                                              if (isMonthMode) {
                                                durationField.onChange(value * 35)
                                              } else {
                                                durationField.onChange(value)
                                              }
                                            }}
                                            placeholder={isMonthMode ? 'Nhập số tháng' : 'Nhập số ngày'}
                                            className="mt-1"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )
                                  }}
                                />

                                {!isFreeSubscription && (
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
                                )}
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
      <DialogEdit
        title="Chọn Khoá tập"
        description="Chọn một hoặc nhiều khoá tập đã có hoặc tạo mới để liên kết với gói tập này."
        open={openCoursesTable}
        onOpenChange={setOpenCoursesTable}
      >
        <CoursesTable
          courseFormat={courseFormat === 'video' ? 'video' : courseFormat === 'live' ? 'live' : undefined}
          onConfirmRowSelection={(row) => {
            setSelectedCourses(row)
            form.setValue(
              'course_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('course_ids')
            setOpenCoursesTable(false)
          }}
        />
      </DialogEdit>
      <DialogEdit
        title="Chọn Bữa ăn"
        description="Chọn một hoặc nhiều bữa ăn đã có hoặc tạo mới để liên kết với gói thành viên này."
        open={openMealPlansTable}
        onOpenChange={setOpenMealPlansTable}
      >
        <MealPlansTable
          onConfirmRowSelection={(row) => {
            setSelectedMealPlans(row)
            form.setValue(
              'meal_plan_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('meal_plan_ids')
            setOpenMealPlansTable(false)
          }}
        />
      </DialogEdit>
    </div>
  )
}
