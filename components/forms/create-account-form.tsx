'use client'

import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
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
import { updatePassword, updateUser } from '@/network/server/user'
import { getSubAdminSubscriptions, getSubscriptions } from '@/network/client/subscriptions'
import { Subscription } from '@/models/subscription'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'
import {
  getUserSubscriptions,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
} from '@/network/server/user-subscriptions'

import { MealPlan } from '@/models/meal-plan'
import { Exercise } from '@/models/exercise'

import { PROVINCES } from '@/lib/label'
import { useSession } from '../providers/session-provider'
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
  email: z.string().email().optional().nullable(),
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
      if (values.subscriptions && values.subscriptions.length > 0) {
        const currentSubscriptions = await getUserSubscriptions(userId)
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
                disabled={subscriptions.some((sub) => !sub.subscription_id)}
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
                {subscriptions.map((subscription, idx) => {
                  const initialSelection =
                    subscription.subscription_id && initialSelections[subscription.subscription_id]
                      ? initialSelections[subscription.subscription_id]
                      : { mealPlans: [], exercises: [], dishes: [] }

                  const isExistingRecord = Boolean(subscription.id) && subscription.id! > 0
                  const membership = membershipList.find((m) => Number(m.id) === subscription.subscription_id)
                  const gifts = membership?.gifts || []

                  return (
                    <div
                      key={subscription.fieldId}
                      className="rounded-md border p-4 bg-muted/10 flex flex-col isolate overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">{membership?.name || `Gói membership #${idx + 1}`}</h3>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSubscription(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Membership Details Section */}
                      <div className="flex flex-col space-y-4 flex-grow">
                        {/* Subscription Select */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tên gói membership</label>
                          <Select
                            value={subscription.subscription_id?.toString() || ''}
                            disabled={isExistingRecord}
                            onValueChange={(value: string) => {
                              const courseFormat = membershipList.find((m) => m.id == value)?.course_format
                              updateSubscription(idx, {
                                ...subscription,
                                subscription_id: Number(value),
                                subscription_end_at: '',
                                course_format: courseFormat || '',
                              })
                            }}
                          >
                            <SelectTrigger className={isExistingRecord ? 'cursor-not-allowed opacity-70' : ''}>
                              <SelectValue placeholder="Chọn gói membership" />
                            </SelectTrigger>
                            <SelectContent>
                              {membershipList.map((m) => {
                                // Check if this membership is already selected in another row
                                const isAlreadySelected = subscriptions.some(
                                  (sub, subIdx) => subIdx !== idx && sub.subscription_id === Number(m.id)
                                )

                                return (
                                  <SelectItem key={m.id} value={m.id.toString()} disabled={isAlreadySelected}>
                                    {m.name}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ngày bắt đầu</label>
                          <input
                            type="date"
                            value={subscription.subscription_start_at ? subscription.subscription_start_at : ''}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                            onChange={(e) => {
                              const newStart = e.target.value
                              updateSubscription(idx, {
                                ...subscription,
                                subscription_start_at: newStart,
                                // If end date exists and is now invalid, clear it
                                subscription_end_at:
                                  subscription.subscription_end_at &&
                                  new Date(subscription.subscription_end_at) <= new Date(newStart)
                                    ? ''
                                    : subscription.subscription_end_at,
                              })
                            }}
                          />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ngày kết thúc</label>
                          <input
                            type="date"
                            value={subscription.subscription_end_at || ''}
                            min={
                              subscription.subscription_start_at
                                ? new Date(new Date(subscription.subscription_start_at).getTime() + 86400000)
                                    .toISOString()
                                    .split('T')[0]
                                : undefined
                            }
                            onChange={(e) => {
                              const newEnd = e.target.value
                              const startDate = new Date(subscription.subscription_start_at || '')
                              const endDate = new Date(newEnd)

                              if (startDate && endDate <= startDate) {
                                toast.error('Ngày kết thúc phải sau ngày bắt đầu')
                                return
                              }

                              updateSubscription(idx, {
                                ...subscription,
                                subscription_end_at: newEnd,
                                gift_id: undefined,
                              })
                            }}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                          />
                        </div>

                        {/* Coupon Code Input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Code khuyến mãi</label>
                          <input
                            type="text"
                            placeholder="Nhập code"
                            value={subscription.coupon_code || ''}
                            onChange={(e) => {
                              const newCouponCode = e.target.value
                              updateSubscription(idx, {
                                ...subscription,
                                coupon_code: newCouponCode,
                              })
                            }}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                          />
                        </div>

                        {/* Gift Select */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quà tặng</label>
                          <Select
                            value={subscription.gift_id?.toString() || ''}
                            disabled={!subscription.subscription_id}
                            onValueChange={(value: string) => {
                              const newGiftId = value ? Number(value) : undefined

                              const previousGift = gifts.find((g) => g.id === subscription.gift_id)
                              const selectedGift = gifts.find((g) => g.id === newGiftId)

                              let baseEndDate: Date | null = subscription.subscription_end_at
                                ? new Date(subscription.subscription_end_at)
                                : null

                              if (
                                baseEndDate &&
                                previousGift &&
                                previousGift.type === 'membership_plan' &&
                                previousGift.duration
                              ) {
                                baseEndDate.setDate(baseEndDate.getDate() - previousGift.duration)
                              }

                              let newEndAt = baseEndDate ? formatDate(baseEndDate) : ''

                              if (
                                baseEndDate &&
                                selectedGift &&
                                selectedGift.type === 'membership_plan' &&
                                selectedGift.duration
                              ) {
                                const adjustedDate = new Date(baseEndDate)
                                adjustedDate.setDate(adjustedDate.getDate() + selectedGift.duration)
                                newEndAt = formatDate(adjustedDate)
                              }

                              updateSubscription(idx, {
                                ...subscription,
                                gift_id: newGiftId,
                                subscription_end_at: newEndAt,
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn quà tặng" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Group for item type gifts */}
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

                              {/* Group for membership_month type gifts */}
                              <SelectGroup>
                                <SelectLabel>Thời gian</SelectLabel>
                                {gifts
                                  .filter((g) => g.type === 'membership_plan')
                                  .map((g) => (
                                    <SelectItem key={g.id} value={g.id.toString()}>
                                      {g.duration !== 0 && g.duration % 35 === 0
                                        ? `${g.duration / 35} tháng`
                                        : `${g.duration} ngày`}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Assigned Items Section as Accordion */}
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
