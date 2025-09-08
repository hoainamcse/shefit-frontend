'use client'

import type { User } from '@/models/user'
import type { Subscription } from '@/models/subscription'
import type { UserSubscription } from '@/models/user-subscriptions'

import { z } from 'zod'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createUserSubscription, updateUserSubscription } from '@/network/client/users'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { MainButton } from '../buttons/main-button'
import { DialogEdit } from '../dialogs/dialog-edit'
import { DishesTable } from '../data-table/dishes-table'
import { ExercisesTable } from '../data-table/exercises-table'
import { MealPlansTable } from '../data-table/meal-plans-table'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { FormDatePickerField, FormSelectField } from './fields'

// ! Follow UserSubscriptionPayload model in models/user-subscriptions.ts
const formSchema = z.object({
  user_id: z.number().min(1),
  course_format: z.enum(['both', 'video', 'live']),
  status: z.enum(['active', 'expired', 'canceled', 'pending']),
  subscription_start_at: z.string().min(1, 'Ngày bắt đầu không được để trống'),
  subscription_end_at: z.string().min(1, 'Ngày kết thúc không được để trống'),
  order_number: z.string(),
  total_price: z.number().min(0, 'Tổng tiền không được nhỏ hơn 0'),
  coupon_id: z.number().nullable(),
  gift_id: z.number().nullable(),
  subscription_id: z.string().min(1, 'Gói tập không được để trống'),
  exercise_ids: z.array(z.number()),
  meal_plan_ids: z.array(z.number()),
  dish_ids: z.array(z.number()),
})

type FormValue = z.infer<typeof formSchema>

interface EditUserSubscriptionFormProps {
  data: UserSubscription | null
  userID: User['id']
  userRole: User['role']
  subscriptions: Subscription[]
  userSubscriptions: UserSubscription[]
  onSuccess?: () => void
}

export function EditUserSubscriptionForm({
  data,
  userID,
  userRole,
  subscriptions,
  userSubscriptions,
  onSuccess,
}: EditUserSubscriptionFormProps) {
  const availableSubscriptions = subscriptions.filter((m) => {
    return !userSubscriptions.some((s) => s.subscription.id === m.id) || (data && m.id === data.subscription.id)
  })

  const isEdit = !!data
  const defaultValue = {
    user_id: userID,
    course_format: 'both',
    status: 'active',
    subscription_start_at: new Date().toISOString(),
    subscription_end_at: '',
    order_number: `HD${new Date().getTime()}`,
    total_price: 0,
    coupon_id: null,
    gift_id: null,
    subscription_id: availableSubscriptions.length > 0 ? `${availableSubscriptions[0].id}` : '',
    exercise_ids: [],
    meal_plan_ids: [],
    dish_ids: [],
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          user_id: userID,
          course_format: data.course_format,
          status: data.status,
          subscription_start_at: data.subscription_start_at,
          subscription_end_at: data.subscription_end_at,
          order_number: data.order_number,
          total_price: data.total_price,
          coupon_id: data.coupon?.id || null,
          gift_id: data.gift?.id || null,
          subscription_id: data.subscription.id.toString(),
          exercise_ids: data.exercises?.map((m) => m.id) || [],
          meal_plan_ids: data.meal_plans?.map((m) => m.id) || [],
          dish_ids: data.dishes?.map((m) => m.id) || [],
        }
      : defaultValue,
  })

  const userSubscriptionMutation = useMutation({
    mutationFn: (values: any) =>
      isEdit ? updateUserSubscription(userID, data.subscription.id, values) : createUserSubscription(userID, values),
    onSettled(data, error) {
      if (data) {
        toast.success(isEdit ? 'Cập nhật gói tập người dùng thành công' : 'Tạo gói tập người dùng thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    // console.log('values', values)
    userSubscriptionMutation.mutate({ ...values, subscription_id: Number(values.subscription_id) })
  }

  const [openMealPlansTable, setOpenMealPlansTable] = useState(false)
  const [openExercisesTable, setOpenExercisesTable] = useState(false)
  const [openDishesTable, setOpenDishesTable] = useState(false)

  const [selectedMealPlans, setSelectedMealPlans] = useState(data?.meal_plans || [])
  const [selectedExercises, setSelectedExercises] = useState(data?.exercises || [])
  const [selectedDishes, setSelectedDishes] = useState(data?.dishes || [])

  const subscriptionId = form.watch('subscription_id')
  const subscriptionStartAt = form.watch('subscription_start_at')
  const subs = subscriptions.find((s) => s.id === Number(subscriptionId))
  const isFreeSubscription = subs ? subs.prices.length > 0 && subs.prices.every((price) => price.price === 0) : false
  const gifts = subs ? subs.gifts : []

  useEffect(() => {
    if (!subscriptionId || !subs) return

    // Handle free subscription: set end date based on duration
    if (isFreeSubscription) {
      const startDate = new Date(subscriptionStartAt)
      startDate.setHours(0, 0, 0, 0)
      const duration = subs.prices[0]?.duration || 7
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)
      form.setValue('subscription_end_at', endDate.toISOString())
    }
  }, [subscriptionId, isFreeSubscription, subs, form, subscriptionStartAt])

  useEffect(() => {
    if (!subscriptionStartAt) return

    const startDate = new Date(subscriptionStartAt)
    startDate.setHours(0, 0, 0, 0)

    // Validate end date is after start date
    const endDateStr = form.getValues('subscription_end_at')
    if (endDateStr) {
      const endDate = new Date(endDateStr)
      endDate.setHours(0, 0, 0, 0)

      if (endDate <= startDate) {
        form.setValue('subscription_end_at', '')
      }
    }
  }, [subscriptionStartAt, form])

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* subscription_id */}
          <FormSelectField
            form={form}
            name="subscription_id"
            label="Gói tập"
            data={availableSubscriptions.map((m) => ({ label: m.name, value: m.id.toString() }))}
            placeholder="Chọn gói tập"
            withAsterisk
          />

          {/* subscription_start_at */}
          <FormDatePickerField
            control={form.control}
            name="subscription_start_at"
            label="Ngày bắt đầu"
            required
            disabled={!subscriptionId}
            calendarDisabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
          />

          {/* subscription_end_at */}
          <FormDatePickerField
            control={form.control}
            name="subscription_end_at"
            label="Ngày kết thúc"
            required
            disabled={!subscriptionId || isFreeSubscription}
            calendarDisabled={(date) => {
              const startDate = form.getValues('subscription_start_at')
              if (!startDate) return true
              const start = new Date(startDate)
              start.setHours(0, 0, 0, 0)
              const dateToCompare = new Date(date)
              dateToCompare.setHours(0, 0, 0, 0)
              return dateToCompare <= start
            }}
          />

          {/* gift_id */}
          <FormSelectField
            form={form}
            name="coupon_id"
            label="Mã khuyến mãi"
            data={data?.coupon ? [{ value: data.coupon.id.toString(), label: data.coupon.code }] : []}
            placeholder="Chọn mã khuyến mãi"
            disabled
            description="Mã khuyến mãi chỉ được chọn bởi khách hàng khi mua gói tập"
          />

          {/* gift_id */}
          <FormSelectField
            form={form}
            name="gift_id"
            label="Quà tặng"
            data={
              data?.gift
                ? [
                    {
                      value: data.gift.id.toString(),
                      label:
                        data.gift.type === 'item'
                          ? `Item: ${data.gift.name}`
                          : `Membership Plan: ${data.gift.duration} ngày`,
                    },
                  ]
                : []
            }
            placeholder="Chọn quà tặng"
            disabled
            description="Quà tặng chỉ được chọn bởi khách hàng khi mua gói tập"
          />

          {userRole !== 'sub_admin' && (
            <div className="mt-6 border-t pt-4 flex-shrink-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="assigned-items">
                  <AccordionTrigger className="font-medium py-2">
                    Gán khoá tập, thực đơn cho gói tập này
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
                        <Label>Động tác</Label>
                        <Input
                          value={selectedExercises.map((mp) => mp.name).join(', ')}
                          onFocus={() => setOpenExercisesTable(true)}
                          placeholder="Chọn động tác"
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
              row.map((r) => r.id),
              { shouldDirty: true }
            )
            form.trigger('meal_plan_ids')
            setOpenMealPlansTable(false)
          }}
        />
      </DialogEdit>
      <DialogEdit
        title="Chọn Động tác"
        description="Chọn một hoặc nhiều động tác đã có hoặc tạo mới để liên kết với gói thành viên này."
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
      </DialogEdit>

      <DialogEdit
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
      </DialogEdit>
    </>
  )
}
