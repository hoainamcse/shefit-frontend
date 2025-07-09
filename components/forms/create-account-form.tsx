'use client'

import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FormInputField, FormSelectField, FormMultiSelectPaginatedField } from '@/components/forms/fields'

import { Course } from '@/models/course'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '../buttons/main-button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
// import { memberships } from '@/data'
import { User } from '@/models/user'
import { generatePassword, generateUsername } from '@/lib/helpers'
import { updatePassword, updateUser } from '@/network/client/users'
import { getSubAdminSubscriptions, getSubscriptions } from '@/network/client/subscriptions'
import { Subscription } from '@/models/subscription'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'
import {
  getUserSubscriptions,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
} from '@/network/client/users'

import { MealPlan } from '@/models/meal-plan'
import { Exercise } from '@/models/exercise'

import { PROVINCES } from '@/lib/label'
import { useSession } from '@/hooks/use-session'
import { roleOptions } from '@/lib/label'
import { getCourses } from '@/network/client/courses'
import { getDishes } from '@/network/client/dishes'
import { Dish } from '@/models/dish'
import { getExercises } from '@/network/client/exercises'
import { getMealPlans } from '@/network/client/meal-plans'
import { MultiSelectOptionItem } from '../nyxb-ui/multi-select'
import { Spinner } from '../spinner'

const accountSchema = z.object({
  id: z.coerce.number().optional(),
  fullname: z.string().min(3, { message: 'Họ và tên phải có ít nhất 3 ký tự.' }),
  phone_number: z
    .string()
    .min(10, { message: 'Số điện thoại phải có ít nhất 10 ký tự.' })
    .regex(/^0[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ.' }),
  email: z.string().email().nullable(),
  username: z.string().min(3, { message: 'Username phải có ít nhất 3 ký tự.' }),
  province: z.enum([...PROVINCES.map((province) => province.value)] as [string, ...string[]], {
    message: 'Bạn phải chọn tỉnh/thành phố',
  }),
  address: z.string().min(6, {
    message: 'Địa chỉ phải có ít nhất 6 ký tự.',
  }),
  role: z
    .enum([...roleOptions.map((role) => role.value)] as [string, ...string[]], {
      message: 'Bạn phải chọn role',
    })
    .default('normal_user'),
  new_password: z.string().min(1, { message: 'New password must be at least 1 characters' }).optional(),
  subscriptions: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        user_id: z.coerce.number().min(1, { message: 'User is required' }),
        subscription_id: z.coerce.number().optional(),
        course_format: z.string(),
        coupon_code: z.string(),
        status: z.string(),
        subscription_start_at: z.string(),
        subscription_end_at: z.string(),
        gift_id: z.coerce.number().optional(),
        order_number: z.string(),
        total_price: z.coerce.number(),
        meal_plan_ids: z.array(z.coerce.string()).default([]),
        dish_ids: z.array(z.coerce.string()).default([]),
        exercise_ids: z.array(z.coerce.string()).default([]),
      })
    )
    .optional(),
})

type AccountFormData = z.infer<typeof accountSchema>
interface CreateAccountFormProps {
  data: User
}

export default function CreateAccountForm({ data }: CreateAccountFormProps) {
  // const [isPending, startTransition] = useTransition()
  const { session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [membershipList, setMembershipList] = useState<Subscription[]>([])
  const [initialSelections, setInitialSelections] = useState<
    Record<
      number,
      { mealPlans: MultiSelectOptionItem[]; exercises: MultiSelectOptionItem[]; dishes: MultiSelectOptionItem[] }
    >
  >({})

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: data
      ? {
          fullname: data.fullname,
          phone_number: data.phone_number,
          email: data.email || null,
          username: data.username,
          province: data.province,
          address: data.address,
          role: data.role,
          subscriptions: [],
        }
      : {
          fullname: '',
          phone_number: '',
          email: null,
          username: '',
          province: '',
          address: '',
          role: 'normal_user',
          subscriptions: [],
        },
  })

  const userRole = form.watch('role')
  const watchedSubscriptions = form.watch('subscriptions')

  const {
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = form
  const {
    fields: subscriptions,
    append: appendSubscription,
    update: updateSubscription,
    remove: removeSubscription,
  } = useFieldArray({ control, name: 'subscriptions', keyName: 'fieldId' })

  /**
   * Fetch all data needed for the form
   */
  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      // Fetch subscriptions based on role, ensuring accessToken is non-null
      const subscriptionsPromise = session?.role === 'sub_admin' ? getSubAdminSubscriptions() : getSubscriptions()
      const [subscriptionsResponse] = await Promise.all([subscriptionsPromise])

      const memberships = subscriptionsResponse.data
      setMembershipList(memberships)

      // Fetch user-courses, user-dishes, user-meal-plans, user-exercises
      if (data?.id) {
        const userId = data.id.toString()

        const userSubscriptionsResponse = await getUserSubscriptions(userId)

        const subscriptionsWithPlanId = userSubscriptionsResponse.data.map((sub: UserSubscriptionDetail) => {
          const mealPlans = sub.meal_plans.map((mealPlan) => ({
            value: String(mealPlan.id),
            label: mealPlan.title,
          }))
          const exercises = sub.exercises.map((exercise) => ({
            value: String(exercise.id),
            label: exercise.name,
          }))
          const dishes = sub.dishes.map((dish) => ({
            value: String(dish.id),
            label: dish.name,
          }))

          // Save initial selections for this subscription
          if (sub.subscription.id) {
            setInitialSelections((prev) => ({
              ...prev,
              [sub.subscription.id]: { mealPlans, exercises, dishes },
            }))
          }

          return {
            ...sub,
            subscription_id: sub.subscription.id,
            gift_id: sub.gifts?.id,
            meal_plan_ids: mealPlans.map((mealPlan) => mealPlan.value),
            dish_ids: dishes.map((dish) => dish.value),
            exercise_ids: exercises.map((exercise) => exercise.value),
            subscription_start_at: sub.subscription_start_at ? formatDate(sub.subscription_start_at) : '',
            subscription_end_at: sub.subscription_end_at ? formatDate(sub.subscription_end_at) : '',
          }
        })

        setValue('subscriptions', subscriptionsWithPlanId)
      }
    } catch (error) {
      console.error('Error fetching account data:', error)
      toast.error('Failed to load account data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [data?.id])

  // useEffect(() => {
  //   const subscription = form.watch((value, { name }) => {
  //     if (name === 'fullname' && value.fullname) {
  //       const username = generateUsername(value.fullname)
  //       form.setValue('username', username)
  //     }
  //   })

  //   return () => subscription.unsubscribe()
  // }, [form])

  async function onSubmit(values: AccountFormData) {
    if (
      values.subscriptions?.some(
        (sub) => !sub.subscription_id || !sub.subscription_start_at || !sub.subscription_end_at
      )
    ) {
      form.setError('subscriptions', {
        type: 'custom',
        message: 'Vui lòng điền đầy đủ thông tin cho tất cả các gói membership',
      })
      return
    }

    const toastId = toast.loading('Updating course structure...')
    try {
      if (!data?.id) {
        toast.dismiss(toastId)
        toast.error('Không tìm thấy thông tin người dùng')
        return
      }

      const userId = data.id.toString()

      // 1. Update user basic information
      const userUpdateData = {
        ...data,
        role: values.role,
        fullname: values.fullname,
        username: values.username,
        phone_number: values.phone_number,
        email: values.email,
        province: values.province,
        address: values.address,
      }

      await updateUser(userId, userUpdateData)

      // 2. Handle subscriptions
      const currentSubscriptions = await getUserSubscriptions(userId)
      if (values.subscriptions && values.subscriptions.length > 0) {
        const formSubIds = values.subscriptions.filter((sub) => sub.id).map((sub) => sub.id)
        const deletedSubscriptions = currentSubscriptions.data.filter((sub) => !formSubIds.includes(sub.id))

        if (deletedSubscriptions.length > 0) {
          await Promise.all(
            deletedSubscriptions
              .filter((sub) => sub.id)
              .map((sub) => deleteUserSubscription(userId, sub.subscription.id.toString()))
          )
          await handleCreateUpdateUserSubscription(values.subscriptions, userId)
        } else {
          await handleCreateUpdateUserSubscription(values.subscriptions, userId)
        }
      } else if (values.subscriptions?.length === 0) {
        await Promise.all(
          currentSubscriptions.data
            .filter((sub) => sub.id)
            .map((sub) => deleteUserSubscription(userId, sub.subscription.id.toString()))
        )
      }

      toast.dismiss(toastId)
      toast.success('Cập nhật tài khoản thành công')
    } catch (error) {
      toast.dismiss(toastId)
      toast.error('Cập nhật tài khoản thất bại')
    }
  }

  const handleCreateUpdateUserSubscription = async (subscriptionData: any, userId: string) => {
    for (const subscription of subscriptionData) {
      const { id, plan_id, ...subscriptionData } = subscription
      // If gift_id is zero, convert to null
      if (subscriptionData.gift_id === 0) {
        subscriptionData.gift_id = null
      }
      if (subscription.id && subscription.subscription_id) {
        await updateUserSubscription(userId, subscription.subscription_id?.toString(), subscriptionData)
      } else {
        await createUserSubscription(subscriptionData, userId)
      }
    }
  }

  const getAvailableSubscriptions = () =>
    membershipList.filter((membership) => !subscriptions.some((sub) => sub.subscription_id === Number(membership.id)))

  const handleAddMembershipPackage = () => {
    const availableSubscriptions = getAvailableSubscriptions()

    if (availableSubscriptions.length === 0) {
      toast.error('Tất cả gói membership đã được chọn')
      return
    }

    // Create new package with empty values
    const newPackage: any = {
      user_id: data?.id || 0,
      course_format: 'video',
      coupon_code: '',
      status: 'active',
      subscription_start_at: formatDate(new Date()),
      subscription_end_at: '',
      order_number: '',
      total_price: 0,
      // Initialize assigned items arrays
      course_ids: [],
      meal_plan_ids: [],
      dish_ids: [],
      exercise_ids: [],
    }

    appendSubscription(newPackage)
  }

  const [isApplyingPassword, setIsApplyingPassword] = useState(false)

  const handleApplyPassword = async () => {
    setIsApplyingPassword(true)
    try {
      const formData = form.getValues()
      const updateData = {
        role: 'admin',
        username: data.username,
        new_password: formData.new_password,
      }

      await updatePassword(updateData)
      toast.success('Mật khẩu đã được cập nhật thành công')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật mật khẩu')
    } finally {
      setIsApplyingPassword(false)
    }
  }

  const formatDate = (date: Date | string): string => {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    return d.toISOString().split('T')[0]
  }

  const addDaysForMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 1 + months * 35) // 35 days per month
    return newDate
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  return (
    <>
      {isSubmitting && <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50" />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Account Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Account - STT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInputField form={form} name="fullname" label="Tên" required placeholder="Nhập tên" />
              <FormInputField
                form={form}
                name="phone_number"
                label="Số điện thoại"
                type="tel"
                pattern="^0[0-9]{9,10}$"
                required
                placeholder="Nhập số điện thoại"
              />

              <FormInputField form={form} name="email" label="Email" type="email" placeholder="Nhập email" />

              <FormSelectField
                form={form}
                name="province"
                label="Tỉnh / thành phố"
                placeholder="Chọn tỉnh/thành phố của bạn đang sống"
                data={PROVINCES}
              />
              {session?.role === 'admin' && (
                <FormSelectField form={form} name="role" label="Role" placeholder="Chọn role" data={roleOptions} />
              )}
              <FormInputField form={form} name="address" label="Địa chỉ chi tiết" placeholder="Nhập địa chỉ của bạn" />
              <FormInputField form={form} name="username" label="Username" required placeholder="Nhập username" />
              <div className="flex flex-col sm:flex-row w-full gap-2">
                <div className="flex-1 w-full">
                  <FormInputField
                    form={form}
                    name="new_password"
                    label="Thay đổi mật khẩu"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
                <div className="flex items-end w-full sm:w-auto">
                  <Button
                    type="button"
                    className="w-full sm:w-auto flex-1"
                    onClick={() => {
                      const pwd = generatePassword()
                      form.setValue('new_password', pwd)
                    }}
                  >
                    Tạo mật khẩu
                  </Button>
                </div>
                <div className="flex items-end w-full sm:w-auto">
                  <MainButton
                    type="button"
                    className="w-full sm:w-auto flex-1"
                    onClick={handleApplyPassword}
                    text="Apply"
                    loading={isApplyingPassword}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Membership Packages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Gói membership</h2>
              <AddButton
                type="button"
                disabled={watchedSubscriptions?.some((sub) => !sub.subscription_id)}
                text="Thêm gói membership"
                onClick={handleAddMembershipPackage}
              />
            </div>

            {subscriptions.length === 0 ? (
              <div className="rounded-md border flex flex-col items-center justify-center h-32 text-center p-4 text-muted-foreground">
                <p>Chưa có gói membership nào được thêm</p>
                <Button type="button" variant="outline" className="mt-2" onClick={handleAddMembershipPackage}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm gói membership
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {subscriptions.map((sub, idx) => {
                  const initialSelection =
                    sub.subscription_id && initialSelections[sub.subscription_id]
                      ? initialSelections[sub.subscription_id]
                      : { mealPlans: [], exercises: [], dishes: [] }

                  const isExistingRecord = Boolean(sub.id) && sub.id! > 0
                  const selectedSubscriptionId = watchedSubscriptions?.[idx]?.subscription_id ?? sub.subscription_id
                  const membership = membershipList.find((m) => Number(m.id) === selectedSubscriptionId)
                  const gifts = membership?.gifts ?? []

                  return (
                    <div key={sub.fieldId} className="rounded-md border p-4 space-y-4 isolate overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">{membership?.name || `Gói membership #${idx + 1}`}</h3>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSubscription(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* subscription_id */}
                      <FormField
                        control={form.control}
                        name={`subscriptions.${idx}.subscription_id`}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Tên gói membership</FormLabel>

                            <Select
                              disabled={isExistingRecord}
                              value={field.value ? String(field.value) : ''}
                              onValueChange={(value) => {
                                field.onChange(Number(value))
                                const courseFormat = membershipList.find((m) => m.id == value)?.course_format ?? ''
                                form.setValue(`subscriptions.${idx}.course_format`, courseFormat)
                                form.setValue(`subscriptions.${idx}.subscription_end_at`, '')
                                form.setValue(`subscriptions.${idx}.gift_id`, undefined)
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className={isExistingRecord ? 'cursor-not-allowed opacity-70' : ''}>
                                  <SelectValue placeholder="Chọn gói membership" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {membershipList.map((m) => {
                                  const taken = subscriptions.some(
                                    (s, i) => i !== idx && s.subscription_id === Number(m.id)
                                  )
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
                        name={`subscriptions.${idx}.subscription_start_at`}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Ngày bắt đầu</FormLabel>
                            <FormControl>
                              <input
                                type="date"
                                className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm"
                                {...field}
                                onChange={(e) => {
                                  const newStart = e.target.value
                                  field.onChange(newStart)
                                  // keep end-date valid
                                  const endPath = `subscriptions.${idx}.subscription_end_at` as const
                                  const endVal = form.getValues(endPath)
                                  if (endVal && new Date(endVal) <= new Date(newStart)) {
                                    form.setValue(endPath, '')
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
                        name={`subscriptions.${idx}.subscription_end_at`}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Ngày kết thúc</FormLabel>
                            <FormControl>
                              <input
                                type="date"
                                min={
                                  sub.subscription_start_at
                                    ? new Date(new Date(sub.subscription_start_at).getTime() + 86_400_000)
                                        .toISOString()
                                        .split('T')[0]
                                    : undefined
                                }
                                className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* coupon_code */}
                      <FormField
                        control={form.control}
                        name={`subscriptions.${idx}.coupon_code`}
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
                        name={`subscriptions.${idx}.gift_id`}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Quà tặng</FormLabel>

                            <Select
                              disabled={!selectedSubscriptionId}
                              value={field.value ? String(field.value) : ''}
                              onValueChange={(val) => {
                                field.onChange(val ? Number(val) : undefined)

                                // adjust end-date when gift changes
                                const baseEnd = form.getValues(`subscriptions.${idx}.subscription_end_at`)
                                const prevGift = gifts.find((g) => g.id === Number(field.value))
                                const newGift = gifts.find((g) => g.id === Number(val))

                                let baseDate = baseEnd ? new Date(baseEnd) : null
                                if (baseDate && prevGift?.type === 'membership_plan')
                                  baseDate.setDate(baseDate.getDate() - (prevGift.duration ?? 0))
                                if (baseDate && newGift?.type === 'membership_plan')
                                  baseDate.setDate(baseDate.getDate() + (newGift.duration ?? 0))

                                form.setValue(
                                  `subscriptions.${idx}.subscription_end_at`,
                                  baseDate ? baseDate.toISOString().split('T')[0] : ''
                                )
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
                                    <h5 className="text-sm font-medium">Thực đơn</h5>
                                    <FormMultiSelectPaginatedField
                                      form={form}
                                      name={`subscriptions.${idx}.meal_plan_ids`}
                                      initialSelectedOptions={initialSelection.mealPlans}
                                      getData={async ({ page, per_page, keyword }) => {
                                        const response = await getMealPlans({ page, per_page, keyword })

                                        return {
                                          data: response.data.map((mealPlan: MealPlan) => ({
                                            value: String(mealPlan.id),
                                            label: mealPlan.title,
                                          })),
                                          total: response.paging.total,
                                        }
                                      }}
                                      placeholder="Chọn thực đơn để gán cho gói membership này"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium">Bài tập</h5>
                                    <FormMultiSelectPaginatedField
                                      form={form}
                                      name={`subscriptions.${idx}.exercise_ids`}
                                      initialSelectedOptions={initialSelection.exercises}
                                      getData={async ({ page, per_page, keyword }) => {
                                        const response = await getExercises({ page, per_page, keyword })

                                        return {
                                          data: response.data.map((exercise: Exercise) => ({
                                            value: String(exercise.id),
                                            label: exercise.name,
                                          })),
                                          total: response.paging.total,
                                        }
                                      }}
                                      placeholder="Chọn bài tập để gán cho gói membership này"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium">Món ăn</h5>
                                    <FormMultiSelectPaginatedField
                                      form={form}
                                      name={`subscriptions.${idx}.dish_ids`}
                                      initialSelectedOptions={initialSelection.dishes}
                                      getData={async ({ page, per_page, keyword }) => {
                                        const response = await getDishes({ page, per_page, keyword })

                                        return {
                                          data: response.data.map((dish: Dish) => ({
                                            value: String(dish.id),
                                            label: dish.name,
                                          })),
                                          total: response.paging.total,
                                        }
                                      }}
                                      placeholder="Chọn món ăn để gán cho gói membership này"
                                    />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {errors.subscriptions && (
              <div className="text-sm text-red-500 space-y-1 mt-2 p-2 border border-red-200 rounded bg-red-50">
                {errors.subscriptions?.message && <p className="font-medium"> {errors.subscriptions.message}</p>}
              </div>
            )}
          </div>

          <MainButton text="Lưu" className="w-full" disabled={isSubmitting} />
        </form>
      </Form>
    </>
  )
}
