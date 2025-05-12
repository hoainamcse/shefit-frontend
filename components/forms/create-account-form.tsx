'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormInputField, FormMultiSelectField } from '@/components/forms/fields'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { AddButton } from '@/components/buttons/add-button'
import { useTransition } from 'react'
import { MainButton } from '../buttons/main-button'
import { z } from 'zod'
import { Account } from '@/models/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState, useEffect, useCallback, useMemo } from 'react'
// import { memberships } from '@/data'
import { User } from '@/models/user'
import { calculateMonthsFromDates, generatePassword } from '@/helper/user'
import { getUsers, updatePassword } from '@/network/server/user'
import { getSubscriptions } from '@/network/server/subcriptions-admin'
import { Subscription } from '@/models/subscription-admin'
import { UserSubscription } from '@/models/user-subscriptions'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { Course } from '@/models/course'
import { getCoursesBySubscriptionId } from '@/network/server/courses'
import { getListMealPlans } from '@/network/server/meal-plans'
import { getListDishes } from '@/network/server/dish'
import { MealPlan } from '@/models/meal-plans'
import { Dish } from '@/models/dish'

const accountSchema = z.object({
  id: z.coerce.number().optional(),
  fullname: z.string().min(1, { message: 'Account name is required' }),
  phone_number: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .regex(/^0[0-9]{9,10}$/, { message: 'Invalid phone number format' }),
  username: z.string().min(1, { message: 'Username is required' }),
  new_password: z.string().min(8, { message: 'New password must be at least 8 characters' }).optional(),
})

type AccountFormData = z.infer<typeof accountSchema>
interface CreateAccountFormProps {
  data?: User
}

// Exercises
export const exercises = [
  {
    value: '1',
    label: 'Squats',
  },
  {
    value: '2',
    label: 'Push-ups',
  },
]

type selectOption = {
  value: string
  label: string
}

export default function CreateAccountForm({ data }: CreateAccountFormProps) {
  const [isPending, startTransition] = useTransition()
  const [membershipList, setMembershipList] = useState<Subscription[]>([])
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([])
  const [courses, setCourses] = useState<selectOption[]>([])
  const [mealPlans, setMealPlans] = useState<selectOption[]>([])
  const [dishes, setDishes] = useState<selectOption[]>([])
  // const [exercises, setExercises] = useState<selectOption[]>([])

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: data || {
      fullname: '',
      phone_number: '',
      username: '',
    },
  })

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
    setUserSubscriptions(subscriptionsWithPlanId)
  }

  useEffect(() => {
    fetchMembershipList()

    fetchMealPlans()
    fetchDishes()
  }, [])

  useEffect(() => {
    if (data?.id) {
      fetchUserSubscriptions(data.id.toString())
    }
    fetchAllCourses()
  }, [membershipList])

  function onSubmit(data: AccountFormData) {
    startTransition(async () => {
      toast.success('Cập nhật tài khoản thành công')
    })
  }

  const updateSub = useCallback(
    (id: number, field: string, value: any) => {
      setUserSubscriptions((prev) =>
        prev.map((sub) => {
          if (sub.id !== id) return sub
          const updated: any = { ...sub, [field]: value }
          return updated
        })
      )
    },
    [membershipList]
  )

  const accountMembershipColumns: ColumnDef<UserSubscription>[] = useMemo(
    () => [
      {
        accessorKey: 'subscription_id',
        header: 'Tên gói membership',
        render: ({ row }) => (
          <Select
            value={row.subscription_id?.toString() || ''}
            onValueChange={(value: string) => {
              updateSub(row.id, 'subscription_end_at', '')
              updateSub(row.id, 'subscription_id', Number(value))
              updateSub(row.id, 'plan_id', null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn gói membership" />
            </SelectTrigger>
            <SelectContent>
              {membershipList.map((m) => (
                <SelectItem key={m.id} value={m.id.toString()}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
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
                  setUserSubscriptions((prev) =>
                    prev.map((sub) => {
                      if (sub.id === row.id) {
                        return {
                          ...sub,
                          plan_id: planId,
                          subscription_end_at: formatDate(endDate),
                        }
                      }

                      return sub
                    })
                  )
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
                setUserSubscriptions((prev) =>
                  prev.map((sub) => {
                    if (sub.id === row.id) {
                      const updatedSub = { ...sub, subscription_start_at: newStartDate }

                      // Recalculate end date if we have a plan selected
                      if (sub.plan_id) {
                        const membership = membershipList.find((m) => m.id === sub.subscription_id)
                        const selectedPlan = membership?.prices.find((p) => p.id === sub.plan_id)
                        if (selectedPlan) {
                          const endDate = addDaysForMonths(new Date(newStartDate), selectedPlan.duration)
                          updatedSub.subscription_end_at = formatDate(endDate)
                        }
                      }

                      return updatedSub
                    }
                    return sub
                  })
                )
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
              onValueChange={(value: string) => updateSub(row.id, 'gift_id', value ? Number(value) : 0)}
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
            onClick={() => setUserSubscriptions((prev) => prev.filter((s) => s.id !== row.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [membershipList, updateSub]
  )

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

  const handleAddMembershipPackage = () => {
    // Find the highest existing ID and increment by 1
    const highestId = userSubscriptions.reduce((max, pkg) => {
      const id = pkg.id
      return id > max ? id : max
    }, 0)

    // Create new ID
    const newId = (highestId + 1).toString()

    // Create new package with empty values
    const newPackage: UserSubscription = {
      id: Number(newId),
      user_id: data?.id || 0,
      // subscription_id: 0,
      // plan_id: 0,
      course_format: 'video',
      coupon_code: '',
      status: 'active',
      subscription_start_at: formatDate(new Date()),
      subscription_end_at: '',
      // gift_id: 0,
      order_number: '',
      total_price: 0,
    }

    // Add to state
    setUserSubscriptions([...userSubscriptions, newPackage])
  }

  const membershipHeaderExtraContent = (
    <AddButton type="button" text="Thêm gói membership" onClick={handleAddMembershipPackage} />
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
                <FormInputField form={form} name="new_password" label="Mật khẩu" placeholder="Nhập mật khẩu" />
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
            data={userSubscriptions}
            columns={accountMembershipColumns}
            searchPlaceholder="Tìm kiếm gói membership"
            headerExtraContent={membershipHeaderExtraContent}
          />
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
              name="menu_ids"
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
