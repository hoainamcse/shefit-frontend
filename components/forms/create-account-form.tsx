'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FormInputField, FormMultiSelectField } from '@/components/forms/fields'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { AddButton } from '@/components/buttons/add-button'
import { useTransition } from 'react'
import { MainButton } from '../buttons/main-button'
import { z } from 'zod'
import { Account } from '@/models/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState, useEffect, useMemo } from 'react'
// import { memberships } from '@/data'
import { User } from '@/models/user'
import { calculateMonthsFromDates, generatePassword, generateUsername } from '@/helper/user'
import { getUsers, updatePassword, updateUser } from '@/network/server/user'
import { getSubscriptions } from '@/network/server/subcriptions-admin'
import { Subscription } from '@/models/subscription-admin'
import { UserSubscription } from '@/models/user-subscriptions'
import {
  getUserSubscriptions,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
} from '@/network/server/user-subscriptions'
import { Course } from '@/models/course'
import { getCoursesBySubscriptionId } from '@/network/server/courses'
import { getListMealPlans } from '@/network/server/meal-plans'
import { getListDishes } from '@/network/server/dish'
import { MealPlan } from '@/models/meal-plans'
import { Dish } from '@/models/dish'
import { Exercise } from '@/models/exercies'
import { getExercises } from '@/network/server/exercise'

const accountSchema = z.object({
  id: z.coerce.number().optional(),
  fullname: z.string().min(1, { message: 'Account name is required' }),
  phone_number: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .regex(/^0[0-9]{9,10}$/, { message: 'Invalid phone number format' }),
  username: z.string().min(1, { message: 'Username is required' }),
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
        plan_id: z.coerce.number().optional(),
        order_number: z.string(),
        total_price: z.coerce.number(),
      })
    )
    .optional(),
  course_ids: z.array(z.coerce.number()).optional(),
  meal_plan_ids: z.array(z.coerce.number()).optional(),
  dish_ids: z.array(z.coerce.number()).optional(),
  exercise_ids: z.array(z.coerce.number()).optional(),
})

type AccountFormData = z.infer<typeof accountSchema>
interface CreateAccountFormProps {
  data?: User
}

type selectOption = {
  value: string
  label: string
}
type UserSubscriptionField = UserSubscription & { fieldId: string }

export default function CreateAccountForm({ data }: CreateAccountFormProps) {
  const [isPending, startTransition] = useTransition()
  const [membershipList, setMembershipList] = useState<Subscription[]>([])
  const [courses, setCourses] = useState<selectOption[]>([])
  const [mealPlans, setMealPlans] = useState<selectOption[]>([])
  const [dishes, setDishes] = useState<selectOption[]>([])
  const [exercises, setExercises] = useState<selectOption[]>([])

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: data || {
      fullname: '',
      phone_number: '',
      username: '',
      subscriptions: [],
    },
  })

  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form
  const {
    fields: subscriptions,
    append: appendSubscription,
    update: updateSubscription,
    remove: removeSubscription,
  } = useFieldArray({ control, name: 'subscriptions', keyName: 'fieldId' })

  const fetchMembershipList = async () => {
    const response = await getSubscriptions()
    setMembershipList(response.data)
  }

  const fetchAllCourses = async () => {
    const responses = await Promise.all(membershipList.map((m) => getCoursesBySubscriptionId(m.id.toString())))

    let allCourses: any[] = []
    for (const res of responses) {
      if (res && Array.isArray(res.data)) {
        for (const course of res.data) {
          allCourses.push(course)
        }
      }
    }

    const seen = new Set()
    const unique: { value: string; label: string }[] = []
    for (const course of allCourses) {
      if (!seen.has(course.id)) {
        seen.add(course.id)
        unique.push({ value: String(course.id), label: course.course_name })
      }
    }

    setCourses(unique)
  }

  const fetchMealPlans = async () => {
    const response = await getListMealPlans()
    const mealPlans = response.data.map((mealPlan: MealPlan) => ({
      value: String(mealPlan.id),
      label: mealPlan.title,
    }))
    setMealPlans(mealPlans)
  }

  const fetchDishes = async () => {
    const response = await getListDishes()
    const dishes = response.data.map((dish: Dish) => ({
      value: String(dish.id),
      label: dish.name,
    }))
    setDishes(dishes)
  }

  const fetchExercises = async () => {
    const response = await getExercises()
    const exercises = response.data.map((exercise: Exercise) => ({
      value: String(exercise.id),
      label: exercise.name,
    }))
    setExercises(exercises)
  }

  const fetchUserSubscriptions = async (userId: string) => {
    const response = await getUserSubscriptions(userId)
    const subscriptionsWithPlanId = response.data.map((sub: UserSubscription) => {
      // Format API dates
      const formattedSub = {
        ...sub,
        subscription_start_at: sub.subscription_start_at ? formatDate(sub.subscription_start_at) : '',
        subscription_end_at: sub.subscription_end_at ? formatDate(sub.subscription_end_at) : '',
      }

      if (formattedSub.subscription_start_at && formattedSub.subscription_end_at) {
        const duration = calculateMonthsFromDays(formattedSub.subscription_start_at, formattedSub.subscription_end_at)
        const membership = membershipList.find((m) => m.id === sub.subscription_id)
        const plan = membership?.prices.find((p) => p.duration === duration)
        if (!plan) return { ...formattedSub }
        return { ...formattedSub, plan_id: plan.id }
      }
      return { ...formattedSub }
    })
    setValue('subscriptions', subscriptionsWithPlanId)
  }

  useEffect(() => {
    fetchMembershipList()
    fetchMealPlans()
    fetchDishes()
    fetchExercises()
  }, [])

  useEffect(() => {
    if (data?.id) {
      fetchUserSubscriptions(data.id.toString())
    }
    fetchAllCourses()
  }, [membershipList])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'fullname' && value.fullname) {
        const username = generateUsername(value.fullname)
        form.setValue('username', username)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  function onSubmit(values: AccountFormData) {
    if (values.subscriptions?.some((sub) => !sub.subscription_id || !sub.subscription_start_at || !sub.plan_id)) {
      form.setError('subscriptions', {
        type: 'custom',
        message: 'Vui lòng điền đầy đủ thông tin cho tất cả các gói membership',
      })
      return
    }

    startTransition(async () => {
      try {
        if (!data?.id) {
          toast.error('Không tìm thấy thông tin người dùng')
          return
        }

        const userId = data.id.toString()

        // 1. Update user basic information
        const userUpdateData = {
          ...data,
          fullname: values.fullname,
          username: values.username,
          phone_number: values.phone_number,
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
                .map((sub) => deleteUserSubscription(userId, sub.subscription_id.toString()))
            )
            await handleCreateUpdateUserSubscription(values.subscriptions, userId)
          } else {
            await handleCreateUpdateUserSubscription(values.subscriptions, userId)
          }
        }

        toast.success('Cập nhật tài khoản thành công')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi cập nhật tài khoản')
      }
    })
  }

  const handleCreateUpdateUserSubscription = async (subscriptionData: any, userId: string) => {
    for (const subscription of subscriptionData) {
      const { id, plan_id, ...subscriptionData } = subscription

      if (subscription.id && subscription.subscription_id) {
        await updateUserSubscription(userId, subscription.subscription_id?.toString(), subscriptionData)
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
    }

    appendSubscription(newPackage)
  }

  const membershipHeaderExtraContent = (
    <AddButton
      type="button"
      disabled={subscriptions.some((sub) => !sub.subscription_id || !sub.plan_id)}
      text="Thêm gói membership"
      onClick={handleAddMembershipPackage}
    />
  )

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

  const calculateMonthsFromDays = (startDateStr: string, endDateStr: string): number => {
    if (!startDateStr || !endDateStr) return 0
    const start = new Date(startDateStr)
    const end = new Date(endDateStr)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.round((diffDays + 1) / 35) // 35 days per month
  }

  const accountMembershipColumns: ColumnDef<UserSubscriptionField>[] = useMemo(
    () => [
      {
        accessorKey: 'subscription_id',
        header: 'Tên gói membership',
        render: ({ row }) => {
          const isExistingRecord = Boolean(row.id) && row.id! > 0

          return (
            <Select
              value={row.subscription_id?.toString() || ''}
              disabled={isExistingRecord}
              onValueChange={(value: string) => {
                const idx = subscriptions.findIndex((s) => s.fieldId === row.fieldId)
                const courseFormat = membershipList.find((m) => m.id === Number(value))?.course_format
                if (idx !== -1)
                  updateSubscription(idx, {
                    ...row,
                    subscription_id: Number(value),
                    subscription_end_at: '',
                    plan_id: undefined,
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
                  const isAlreadySelected = subscriptions.some((sub) => sub.subscription_id === m.id)

                  return (
                    <SelectItem key={m.id} value={m.id.toString()} disabled={isAlreadySelected}>
                      {m.name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        },
      },

      {
        accessorKey: 'plan_id',
        header: 'Thời gian (tháng)',
        render: ({ row }) => {
          const membership = membershipList.find((m) => m.id === row.subscription_id)
          const plans = membership?.prices || []

          return (
            <Select
              value={row.plan_id?.toString() || ''}
              disabled={!row.subscription_id || !row.subscription_start_at}
              onValueChange={(value: string) => {
                const planId = value ? Number(value) : 0
                const selectedPlan = plans.find((p) => p.id === planId)

                if (selectedPlan && row.subscription_start_at) {
                  const endDate = addDaysForMonths(new Date(row.subscription_start_at), selectedPlan.duration)
                  const idx = subscriptions.findIndex((s) => s.fieldId === row.fieldId)
                  if (idx !== -1)
                    updateSubscription(idx, {
                      ...row,
                      plan_id: planId,
                      subscription_end_at: formatDate(endDate),
                    })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thời gian gói" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.duration} tháng - {plan.price.toLocaleString('vi-VN')}đ
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: 'subscription_start_at',
        header: 'Ngày bắt đầu',
        render: ({ row }) => {
          const startDate = row.subscription_start_at ? formatDate(row.subscription_start_at) : ''

          return (
            <input
              type="date"
              value={startDate}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              onChange={(e) => {
                const newStartDate = e.target.value
                const idx = subscriptions.findIndex((s) => s.fieldId === row.fieldId)
                if (idx !== -1) {
                  const updatedRow: any = { ...row, subscription_start_at: newStartDate }
                  if (row.plan_id) {
                    const membership = membershipList.find((m) => m.id === row.subscription_id)
                    const selectedPlan = membership?.prices.find((p) => p.id === row.plan_id)
                    if (selectedPlan) {
                      updatedRow.subscription_end_at = formatDate(
                        addDaysForMonths(new Date(newStartDate), selectedPlan.duration)
                      )
                    }
                  }
                  updateSubscription(idx, updatedRow)
                }
              }}
            />
          )
        },
      },
      {
        accessorKey: 'subscription_end_at',
        header: 'Ngày kết thúc',
        render: ({ row }) => (
          <input
            type="date"
            value={row.subscription_end_at || ''}
            readOnly
            disabled
            className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm transition-colors cursor-not-allowed"
          />
        ),
      },
      {
        accessorKey: 'gift_id',
        header: 'Quà tặng',
        render: ({ row }) => {
          const gifts = membershipList.find((m) => m.id === row.subscription_id)?.gifts || []

          return (
            <Select
              value={row.gift_id?.toString() || ''}
              disabled={!row.subscription_id}
              onValueChange={(value: string) => {
                const idx = subscriptions.findIndex((s) => s.fieldId === row.fieldId)
                if (idx !== -1) updateSubscription(idx, { ...row, gift_id: value ? Number(value) : 0 })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn quà tặng" />
              </SelectTrigger>
              <SelectContent>
                {gifts.map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: 'actions',
        header: '',
        render: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              const idx = subscriptions.findIndex((s) => s.fieldId === row.fieldId)
              if (idx !== -1) removeSubscription(idx)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [membershipList, subscriptions]
  )

  return (
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
              required
              placeholder="Nhập số điện thoại"
            />
            <FormInputField form={form} name="username" label="Username" required placeholder="Nhập username" />
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <div className="flex-1 w-full">
                <FormInputField form={form} name="new_password" label="Thay đổi mật khẩu" placeholder="Nhập mật khẩu" />
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
          <h2 className="text-lg font-semibold">Gói membership</h2>
          <DataTable
            data={subscriptions}
            columns={accountMembershipColumns}
            searchPlaceholder="Tìm kiếm gói membership"
            headerExtraContent={membershipHeaderExtraContent}
          />
          {errors.subscriptions && (
            <div className="text-sm text-red-500 space-y-1 mt-2 p-2 border border-red-200 rounded bg-red-50">
              {errors.subscriptions?.message && <p className="font-medium"> {errors.subscriptions.message}</p>}
            </div>
          )}
        </div>

        {/* Assigned Items */}
        <div className="space-y-8">
          <h2 className="text-lg font-semibold">Gán khóa học, thực đơn cho học viên</h2>
          <div className="space-y-4">
            <FormMultiSelectField
              form={form}
              name="course_ids"
              label="Khóa học"
              data={courses}
              placeholder="Chọn khóa học"
            />

            <FormMultiSelectField
              form={form}
              name="meal_plan_ids"
              label="Thực đơn"
              data={mealPlans}
              placeholder="Chọn thực đơn"
            />

            <FormMultiSelectField
              form={form}
              name="exercise_ids"
              label="Bài tập"
              data={exercises}
              placeholder="Chọn bài tập"
            />

            <FormMultiSelectField form={form} name="dish_ids" label="Món ăn" data={dishes} placeholder="Chọn món ăn" />
          </div>
        </div>

        <MainButton text="Lưu" className="w-full" loading={isPending} />
      </form>
    </Form>
  )
}
