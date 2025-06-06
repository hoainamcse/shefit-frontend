'use client'

import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FormInputField, FormMultiSelectField, FormSelectField } from '@/components/forms/fields'
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
import { getSubscriptions } from '@/network/server/subscriptions-admin'
import { Subscription } from '@/models/subscription-admin'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'
import {
  getUserSubscriptions,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
} from '@/network/server/user-subscriptions'
import { getCoursesBySubscriptionId } from '@/network/server/courses'
import { getMealPlans } from '@/network/server/meal-plans'
import { getDishes } from '@/network/server/dishes'
import { MealPlan } from '@/models/meal-plan'
import { Dish } from '@/models/dish'
import { Exercise } from '@/models/exercise'
import { getExercises } from '@/network/server/exercises'
import { PROVINCES } from '@/lib/label'
import { useAuth } from '../providers/auth-context'
import { roleOptions } from '@/lib/label'
import { getSubAdminSubscriptions } from '@/network/server/sub-admin'

const accountSchema = z.object({
  id: z.coerce.number().optional(),
  fullname: z.string().min(3, { message: 'Họ và tên phải có ít nhất 3 ký tự.' }),
  phone_number: z
    .string()
    .min(10, { message: 'Số điện thoại phải có ít nhất 10 ký tự.' })
    .regex(/^0[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ.' }),
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
  new_password: z.string().min(8, { message: 'New password must be at least 8 characters' }).optional(),
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
        course_ids: z.array(z.coerce.string()).default([]),
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

type selectOption = {
  value: string
  label: string
}

export default function CreateAccountForm({ data }: CreateAccountFormProps) {
  // const [isPending, startTransition] = useTransition()
  const { role, accessToken } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [membershipList, setMembershipList] = useState<Subscription[]>([])

  const [courses, setCourses] = useState<selectOption[]>([])
  const [mealPlans, setMealPlans] = useState<selectOption[]>([])
  const [dishes, setDishes] = useState<selectOption[]>([])
  const [exercises, setExercises] = useState<selectOption[]>([])

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: data
      ? {
          fullname: data.fullname,
          phone_number: data.phone_number,
          username: data.username,
          province: data.province,
          address: data.address,
          role: data.role,
          subscriptions: [],
        }
      : {
          fullname: '',
          phone_number: '',
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

  const watchedSubscriptions = form.watch('subscriptions')

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      if (!watchedSubscriptions || watchedSubscriptions.length === 0) {
        setCourses([]) // Clear courses if no subscriptions are selected
        return
      }

      const selectedSubscriptionIds = watchedSubscriptions
        .map((sub) => sub.subscription_id)
        .filter((id): id is number => id !== undefined && id !== null) // Ensure valid IDs

      if (selectedSubscriptionIds.length === 0) {
        setCourses([])
        return
      }

      try {
        const coursePromises = selectedSubscriptionIds.map((id) => getCoursesBySubscriptionId(id.toString()))
        const courseResponses = await Promise.all(coursePromises)

        const allCourses = courseResponses.flatMap((res) => (Array.isArray(res.data) ? res.data : []))

        const uniqueCourses = Array.from(
          new Map(
            allCourses.map((course) => [course.id, { value: String(course.id), label: course.course_name }])
          ).values()
        )
        setCourses(uniqueCourses)
      } catch (error) {
        console.error('Error fetching filtered courses:', error)
        toast.error('Failed to load courses for selected subscriptions.')
        setCourses([]) // Clear courses on error
      }
    }

    fetchFilteredCourses()
  }, [watchedSubscriptions, setCourses])

  /**
   * Fetch all data needed for the form
   */
  const fetchAllData = async () => {
    setIsLoading(true)
    // Guard against missing accessToken when fetching sub-admin subscriptions
    if (role === 'sub_admin' && !accessToken) {
      toast.error('Missing access token for sub-admin')
      setIsLoading(false)
      return
    }
    try {
      // Fetch subscriptions based on role, ensuring accessToken is non-null
      const subscriptionsPromise = role === 'sub_admin' ? getSubAdminSubscriptions(accessToken!) : getSubscriptions()
      const [subscriptionsResponse, mealPlansResponse, dishesResponse, exercisesResponse] = await Promise.all([
        subscriptionsPromise,
        getMealPlans(),
        getDishes(),
        getExercises(),
      ])

      const memberships = subscriptionsResponse.data
      setMembershipList(memberships)

      const formattedMealPlans = mealPlansResponse.data.map((mealPlan: MealPlan) => ({
        value: String(mealPlan.id),
        label: mealPlan.title,
      }))
      setMealPlans(formattedMealPlans)

      const formattedDishes = dishesResponse.data.map((dish: Dish) => ({
        value: String(dish.id),
        label: dish.name,
      }))
      setDishes(formattedDishes)

      const formattedExercises = exercisesResponse.data.map((exercise: Exercise) => ({
        value: String(exercise.id),
        label: exercise.name,
      }))
      setExercises(formattedExercises)

      // Fetch user-courses, user-dishes, user-meal-plans, user-exercises
      if (data?.id) {
        const userId = data.id.toString()

        const userSubscriptionsResponse = await getUserSubscriptions(userId)

        const subscriptionsWithPlanId = userSubscriptionsResponse.data.map((sub: UserSubscriptionDetail) => {
          // Format API dates
          const formattedSub = {
            ...sub,
            gift_id: sub.gifts?.id,
            course_ids: sub.courses.map((course) => course.id.toString()),
            meal_plan_ids: sub.meal_plans.map((mealPlan) => mealPlan.id.toString()),
            dish_ids: sub.dishes.map((dish) => dish.id.toString()),
            exercise_ids: sub.exercises.map((exercise) => exercise.id.toString()),
            subscription_start_at: sub.subscription_start_at ? formatDate(sub.subscription_start_at) : '',
            subscription_end_at: sub.subscription_end_at ? formatDate(sub.subscription_end_at) : '',
          }

          // if (formattedSub.subscription_start_at && formattedSub.subscription_end_at) {
          //   // Total duration including gift extension
          //   const totalDuration = calculateMonthsFromDays(
          //     formattedSub.subscription_start_at,
          //     formattedSub.subscription_end_at
          //   )
          //   // Subtract gift months for accurate plan duration
          //   let giftMonths = 0
          //   if (sub.gifts) {
          //     const membership = memberships.find((m) => m.id === sub.subscription_id)
          //     const gift = membership?.gifts.find((g) => g.id === sub.gifts.id)
          //     if (gift && gift.type === 'membership_month') {
          //       giftMonths = gift.month_count
          //     }
          //   }
          //   console.log('totalDuration', totalDuration)
          //   console.log('giftMonths', giftMonths)
          //   const planDuration = totalDuration - giftMonths
          //   const membership = memberships.find((m) => m.id === sub.subscription_id)
          //   const plan = membership?.prices.find((p) => p.duration === planDuration)
          //   if (plan) {
          //     return { ...formattedSub, plan_id: plan.id }
          //   }
          // }
          return formattedSub
        })
        setValue('subscriptions', subscriptionsWithPlanId)

        console.log('subscriptionsWithPlanId', subscriptionsWithPlanId)

        // // Set user courses
        // if (userCoursesResponse?.data?.length > 0) {
        //   const courseIds = userCoursesResponse.data.map((course: UserCourse) => course.course_id.toString())
        //   form.setValue("course_ids", courseIds)
        // }

        // // Set user meal plans
        // if (userMealPlansResponse?.data?.length > 0) {
        //   const mealPlanIds = userMealPlansResponse.data.map((mealPlan: UserMealPlan) =>
        //     mealPlan.meal_plan_id.toString()
        //   )
        //   form.setValue("meal_plan_ids", mealPlanIds)
        // }
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

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'fullname' && value.fullname) {
        const username = generateUsername(value.fullname)
        form.setValue('username', username)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(values: AccountFormData) {
    if (values.subscriptions?.some((sub) => !sub.subscription_id || !sub.subscription_start_at)) {
      form.setError('subscriptions', {
        type: 'custom',
        message: 'Vui lòng điền đầy đủ thông tin cho tất cả các gói membership',
      })
      return
    }

    console.log('values', values)

    try {
      const toastId = toast.loading('Updating course structure...')
      if (!data?.id) {
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
        province: values.province,
        address: values.address,
      }

      await updateUser(userId, userUpdateData)

      // 2. Handle subscriptions
      if (values.subscriptions && values.subscriptions.length > 0 && accessToken) {
        const currentSubscriptions = await getUserSubscriptions(userId)
        const formSubIds = values.subscriptions.filter((sub) => sub.id).map((sub) => sub.id)
        const deletedSubscriptions = currentSubscriptions.data.filter((sub) => !formSubIds.includes(sub.id))

        if (deletedSubscriptions.length > 0) {
          await Promise.all(
            deletedSubscriptions
              .filter((sub) => sub.id)
              .map((sub) => deleteUserSubscription(userId, sub.subscription_id.toString(), accessToken))
          )
          await handleCreateUpdateUserSubscription(values.subscriptions, userId, accessToken)
        } else {
          await handleCreateUpdateUserSubscription(values.subscriptions, userId, accessToken)
        }
      }

      toast.dismiss(toastId)
      toast.success('Cập nhật tài khoản thành công')
    } catch (error) {
      toast.error('Cập nhật tài khoản thất bại')
    }
  }

  const handleCreateUpdateUserSubscription = async (subscriptionData: any, userId: string, accessToken: string) => {
    for (const subscription of subscriptionData) {
      const { id, plan_id, ...subscriptionData } = subscription
      // If gift_id is zero, convert to null
      if (subscriptionData.gift_id === 0) {
        subscriptionData.gift_id = null
      }
      if (subscription.id && subscription.subscription_id) {
        await updateUserSubscription(userId, subscription.subscription_id?.toString(), subscriptionData, accessToken)
      } else {
        await createUserSubscription(subscriptionData, userId)
      }
    }
  }

  const getAvailableSubscriptions = () =>
    membershipList.filter((membership) => !subscriptions.some((sub) => sub.subscription_id === membership.id))

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
        username: formData.username,
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

  // const calculateMonthsFromDays = (startDateStr: string, endDateStr: string): number => {
  //   if (!startDateStr || !endDateStr) return 0
  //   const start = new Date(startDateStr)
  //   const end = new Date(endDateStr)
  //   const diffTime = Math.abs(end.getTime() - start.getTime())
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  //   return Math.round((diffDays + 1) / 35) // 35 days per month
  // }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading account data...</p>
        </div>
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
              <FormSelectField
                form={form}
                name="province"
                label="Tỉnh / thành phố"
                placeholder="Chọn tỉnh/thành phố của bạn đang sống"
                data={PROVINCES}
              />
              {role === 'admin' && (
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
                  const isExistingRecord = Boolean(subscription.id) && subscription.id! > 0
                  const membership = membershipList.find((m) => m.id === subscription.subscription_id)
                  const gifts = membership?.gifts || []

                  // const computeEndDate = (startAt?: string, planId?: number, giftId?: number): string => {
                  //   if (!startAt || !planId) return ''
                  //   const startDate = new Date(startAt)
                  //   const plan = plans.find((p) => p.id === planId)
                  //   if (!plan) return ''
                  //   let date = addDaysForMonths(startDate, plan.duration)
                  //   const gift = gifts.find((g) => g.id === giftId)
                  //   if (gift && gift.type === 'membership_month' && gift.month_count) {
                  //     date = addDaysForMonths(date, gift.month_count)
                  //   }
                  //   return formatDate(date)
                  // }

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
                              const courseFormat = membershipList.find((m) => m.id === Number(value))?.course_format
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
                                  (sub, subIdx) => subIdx !== idx && sub.subscription_id === m.id
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

                        {/* Plan Select */}
                        {/* <div className="space-y-2">
                          <label className="text-sm font-medium">Thời gian (tháng)</label>
                          <Select
                            value={subscription.plan_id?.toString() || ""}
                            disabled={!subscription.subscription_id || !subscription.subscription_start_at}
                            onValueChange={(value: string) => {
                              const planId = value ? Number(value) : undefined
                              const newEnd = computeEndDate(
                                subscription.subscription_start_at,
                                planId,
                                subscription.gift_id
                              )
                              updateSubscription(idx, {
                                ...subscription,
                                plan_id: planId,
                                subscription_end_at: newEnd,
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thời gian gói" />
                            </SelectTrigger>
                            <SelectContent>
                              {plans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                  {plan.duration} tháng - {plan.price.toLocaleString("vi-VN")}đ
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div> */}

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
                            onChange={(e) => {
                              const newEnd = e.target.value
                              updateSubscription(idx, {
                                ...subscription,
                                subscription_end_at: newEnd,
                                gift_id: undefined,
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
                              let newEndAt = subscription.subscription_end_at || ''
                              const selectedGift = gifts.find((g) => g.id === newGiftId)
                              if (
                                selectedGift &&
                                selectedGift.type === 'membership_month' &&
                                selectedGift.month_count &&
                                subscription.subscription_end_at
                              ) {
                                const endDate = new Date(subscription.subscription_end_at)
                                newEndAt = formatDate(addDaysForMonths(endDate, selectedGift.month_count))
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
                                <SelectLabel>Quà tặng</SelectLabel>
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
                                <SelectLabel>Tháng thành viên</SelectLabel>
                                {gifts
                                  .filter((g) => g.type === 'membership_month')
                                  .map((g) => (
                                    <SelectItem key={g.id} value={g.id.toString()}>
                                      {g.month_count} tháng
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
                                    <h5 className="text-sm font-medium">Khóa học</h5>
                                    <FormField
                                      control={form.control}
                                      name={`subscriptions.${idx}.course_ids`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <FormMultiSelectField
                                              form={form}
                                              name={`subscriptions.${idx}.course_ids`}
                                              label=""
                                              data={[]}
                                              placeholder="Chọn khóa học để gán cho gói membership này"
                                              key={`course-select-${idx}-${
                                                (field.value as string[] | undefined)?.length || 0
                                              }`}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium">Thực đơn</h5>
                                    <FormField
                                      control={form.control}
                                      name={`subscriptions.${idx}.meal_plan_ids`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <FormMultiSelectField
                                              form={form}
                                              name={`subscriptions.${idx}.meal_plan_ids`}
                                              label=""
                                              data={[]}
                                              placeholder="Chọn thực đơn để gán cho gói membership này"
                                              key={`meal-plan-select-${idx}-${
                                                (field.value as string[] | undefined)?.length || 0
                                              }`}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium">Bài tập</h5>
                                    <FormField
                                      control={form.control}
                                      name={`subscriptions.${idx}.exercise_ids`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <FormMultiSelectField
                                              form={form}
                                              name={`subscriptions.${idx}.exercise_ids`}
                                              label=""
                                              data={[]}
                                              placeholder="Chọn bài tập để gán cho gói membership này"
                                              key={`exercise-select-${idx}-${
                                                (field.value as string[] | undefined)?.length || 0
                                              }`}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium">Món ăn</h5>
                                    <FormField
                                      control={form.control}
                                      name={`subscriptions.${idx}.dish_ids`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <FormMultiSelectField
                                              form={form}
                                              name={`subscriptions.${idx}.dish_ids`}
                                              label=""
                                              data={[]}
                                              placeholder="Chọn món ăn để gán cho gói membership này"
                                              key={`dish-select-${idx}-${
                                                (field.value as string[] | undefined)?.length || 0
                                              }`}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
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
