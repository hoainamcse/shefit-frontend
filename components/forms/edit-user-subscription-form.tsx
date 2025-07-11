'use client'

import type { Course, LiveDay } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createLiveDay, updateLiveDay } from '@/network/client/courses'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FormMultiSelectPaginatedField, FormSelectField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { TimePicker } from '../time-picker'
import { User } from '@/models/user'
import { UserSubscription, UserSubscriptionDetail } from '@/models/user-subscriptions'
import { createUserSubscription, updateUserSubscription } from '@/network/client/users'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { MultiSelectOptionItem } from '../nyxb-ui/multi-select'
import { Subscription } from '@/models/subscription'
import { getMealPlans } from '@/network/client/meal-plans'
import { MealPlan } from '@/models/meal-plan'
import { getExercises } from '@/network/client/exercises'
import { Exercise } from '@/models/exercise'
import { getDishes } from '@/network/client/dishes'
import { Dish } from '@/models/dish'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { EditDialog } from '../data-table/edit-dialog'
import { useState } from 'react'
import { MealPlansTable } from '../data-table/meal-plans-table'
import { ExercisesTable } from '../data-table/exercises-table'
import { DishesTable } from '../data-table/dishes-table'

// ! Follow UserSubscriptionPayload model in models/user-subscriptions.ts
const formSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().min(1, { message: 'User is required' }),
  subscription_id: z.coerce.number().min(1, { message: 'Subscription is required' }),
  course_format: z.string(),
  coupon_code: z.string(),
  status: z.string(),
  subscription_start_at: z.string().nonempty({ message: 'Start date is required' }),
  subscription_end_at: z.string().nonempty({ message: 'End date is required' }),
  gift_id: z.coerce.number().optional(),
  order_number: z.string(),
  total_price: z.coerce.number(),
  meal_plan_ids: z.array(z.coerce.number()).default([]),
  dish_ids: z.array(z.coerce.number()).default([]),
  exercise_ids: z.array(z.coerce.number()).default([]),
})

type FormValue = z.infer<typeof formSchema>

interface EditUserSubscriptionFormProps {
  data: UserSubscriptionDetail | null
  userID: User['id']
  userRole: User['role']
  subscriptions: Subscription[]
  userSubscriptions: UserSubscriptionDetail[]
  onSuccess?: () => void
}

const formatDate = (date: Date | string): string => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().split('T')[0]
}

export function EditUserSubscriptionForm({
  data,
  userID,
  userRole,
  subscriptions,
  userSubscriptions,
  onSuccess,
}: EditUserSubscriptionFormProps) {
  const isEdit = !!data
  const defaultValue = {
    user_id: userID,
    subscription_id: 0,
    course_format: 'video',
    coupon_code: '',
    status: 'active',
    subscription_start_at: formatDate(new Date()),
    subscription_end_at: '',
    order_number: '',
    total_price: 0,
    meal_plan_ids: [],
    dish_ids: [],
    exercise_ids: [],
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          user_id: data.user_id,
          subscription_id: data.subscription.id,
          course_format: data.course_format,
          coupon_code: data.coupon_code,
          status: data.status,
          subscription_start_at: data.subscription_start_at ? formatDate(data.subscription_start_at) : '',
          subscription_end_at: data.subscription_end_at ? formatDate(data.subscription_end_at) : '',
          order_number: data.order_number,
          total_price: data.total_price,
          meal_plan_ids: data.meal_plans.map((meal_plan) => meal_plan.id),
          dish_ids: data.dishes.map((dish) => dish.id),
          exercise_ids: data.exercises.map((exercise) => exercise.id),
          gift_id: data.gifts?.id,
        }
      : defaultValue,
  })

  const userSubscriptionMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit && data?.id
        ? updateUserSubscription(userID.toString(), data?.subscription.id.toString(), values)
        : createUserSubscription(values, userID.toString()),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật ngày thành công' : 'Tạo ngày thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    console.log('values', values)
    userSubscriptionMutation.mutate(values)
  }

  const [openMealPlansTable, setOpenMealPlansTable] = useState(false)
  const [openExercisesTable, setOpenExercisesTable] = useState(false)
  const [openDishesTable, setOpenDishesTable] = useState(false)

  const [selectedMealPlans, setSelectedMealPlans] = useState(data?.meal_plans || [])
  const [selectedExercises, setSelectedExercises] = useState(data?.exercises || [])
  const [selectedDishes, setSelectedDishes] = useState(data?.dishes || [])

  const isExistingRecord = Boolean(data?.id) && data?.id! > 0
  const selectedSubscriptionId = form.watch('subscription_id')
  const membership = subscriptions.find((m) => Number(m.id) === selectedSubscriptionId)
  const gifts = membership?.gifts ?? []

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* subscription_id */}
          <FormField
            control={form.control}
            name="subscription_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Tên gói membership</FormLabel>

                <Select
                  disabled={isExistingRecord}
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(value) => {
                    field.onChange(Number(value))
                    const courseFormat = subscriptions.find((m) => m.id == value)?.course_format ?? ''
                    form.setValue('course_format', courseFormat)
                    form.setValue('subscription_end_at', '')
                    form.setValue('gift_id', undefined)
                  }}
                >
                  <FormControl>
                    <SelectTrigger className={isExistingRecord ? 'cursor-not-allowed opacity-70' : ''}>
                      <SelectValue placeholder="Chọn gói membership" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {subscriptions.map((m) => {
                      const taken = userSubscriptions.some((s) => s.subscription.id === Number(m.id))
                      return (
                        <SelectItem key={m.id} value={m.id.toString()} disabled={taken}>
                          {m.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* subscription_start_at */}
          <FormField
            control={form.control}
            name="subscription_start_at"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <input
                    type="date"
                    required
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm"
                    {...field}
                    onChange={(e) => {
                      const newStart = e.target.value
                      field.onChange(newStart)
                      // keep end-date valid

                      const endVal = form.getValues('subscription_end_at')
                      if (endVal && new Date(endVal) <= new Date(newStart)) {
                        form.setValue('subscription_end_at', '')
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* subscription_end_at */}
          <FormField
            control={form.control}
            name="subscription_end_at"
            render={({ field }) => {
              const start = form.watch('subscription_start_at')
              const minDate = start
                ? new Date(new Date(start).getTime() + 86400000).toISOString().split('T')[0]
                : undefined
              return (
                <FormItem className="space-y-2">
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      min={minDate}
                      className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          {/* coupon_code */}
          <FormField
            control={form.control}
            name="coupon_code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Code khuyến mãi</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    placeholder="Nhập code"
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* gift_id */}
          <FormField
            control={form.control}
            name="gift_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Quà tặng</FormLabel>

                <Select
                  disabled={!selectedSubscriptionId}
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => {
                    field.onChange(val ? Number(val) : undefined)

                    // adjust end-date when gift changes
                    const baseEnd = form.getValues('subscription_end_at')
                    const prevGift = gifts.find((g) => g.id === Number(field.value))
                    const newGift = gifts.find((g) => g.id === Number(val))

                    let baseDate = baseEnd ? new Date(baseEnd) : null
                    if (baseDate && prevGift?.type === 'membership_plan')
                      baseDate.setDate(baseDate.getDate() - (prevGift.duration ?? 0))
                    if (baseDate && newGift?.type === 'membership_plan')
                      baseDate.setDate(baseDate.getDate() + (newGift.duration ?? 0))

                    form.setValue('subscription_end_at', baseDate ? baseDate.toISOString().split('T')[0] : '')
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quà tặng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Vật dụng</SelectLabel>
                      {gifts
                        .filter((g) => g.type === 'item')
                        .map((g) => (
                          <SelectItem key={g.id} value={g.id.toString()}>
                            {g.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>

                    <SelectGroup>
                      <SelectLabel>Thời gian</SelectLabel>
                      {gifts
                        .filter((g) => g.type === 'membership_plan')
                        .map((g) => (
                          <SelectItem key={g.id} value={g.id.toString()}>
                            {g.duration % 35 === 0 ? `${g.duration / 35} tháng` : `${g.duration} ngày`}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {userRole !== 'sub_admin' && (
            <div className="mt-6 border-t pt-4 flex-shrink-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="assigned-items">
                  <AccordionTrigger className="font-medium py-2">
                    Gán khóa học, thực đơn cho gói membership này
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="rounded-md bg-muted/20 p-4 space-y-6 mt-2">
                      <div className="space-y-2">
                        <Label>Thực đơn</Label>
                        <Input
                          value={selectedMealPlans.map((mp) => mp.title).join(', ')}
                          onFocus={() => setOpenMealPlansTable(true)}
                          placeholder="Chọn thực đơn"
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Bài tập</Label>
                        <Input
                          value={selectedExercises.map((mp) => mp.name).join(', ')}
                          onFocus={() => setOpenExercisesTable(true)}
                          placeholder="Chọn bài tập"
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Món ăn</Label>
                        <Input
                          value={selectedDishes.map((mp) => mp.name).join(', ')}
                          onFocus={() => setOpenDishesTable(true)}
                          placeholder="Chọn món ăn"
                          readOnly
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          <div className="flex justify-end">
            {(!isEdit || (isEdit && form.formState.isDirty)) && (
              <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={userSubscriptionMutation.isPending} />
            )}
          </div>
        </form>
      </Form>
      <EditDialog
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
              row.map((r) => r.id),
              { shouldDirty: true }
            )
            form.trigger('meal_plan_ids')
            setOpenMealPlansTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Bài tập"
        description="Chọn một hoặc nhiều bài tập đã có hoặc tạo mới để liên kết với gói thành viên này."
        open={openExercisesTable}
        onOpenChange={setOpenExercisesTable}
      >
        <ExercisesTable
          onConfirmRowSelection={(row) => {
            setSelectedExercises(row)
            form.setValue(
              'exercise_ids',
              row.map((r) => r.id),
              { shouldDirty: true }
            )
            form.trigger('exercise_ids')
            setOpenExercisesTable(false)
          }}
        />
      </EditDialog>

      <EditDialog
        title="Chọn Món ăn"
        description="Chọn một hoặc nhiều món ăn đã có hoặc tạo mới để liên kết với gói thành viên này."
        open={openDishesTable}
        onOpenChange={setOpenDishesTable}
      >
        <DishesTable
          onConfirmRowSelection={(row) => {
            setSelectedDishes(row)
            form.setValue(
              'dish_ids',
              row.map((r) => r.id),
              { shouldDirty: true }
            )
            form.trigger('dish_ids')
            setOpenDishesTable(false)
          }}
        />
      </EditDialog>
    </>
  )
}
