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
import { useState, useEffect, useCallback } from 'react'
import { memberships } from '@/data'

const accountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Account name is required' }),
  phone_number: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .regex(/^0[0-9]{9,10}$/, { message: 'Invalid phone number format' }),
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .regex(/^[a-zA-Z0-9_]{3,30}$/, {
      message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
})

type AccountFormData = z.infer<typeof accountSchema>
interface CreateAccountFormProps {
  data?: Account
}

type AccountMembershipPackage = {
  id: string
  membership_id: string
  start_date: string
  end_date: string
  plan_id: string
  gift_id: string
}

// Courses
export const courses = [
  {
    value: '1',
    label: 'Dumbbell',
  },
  {
    value: '2',
    label: 'Barbell',
  },
]

// Menu Items
export const menuItems = [
  {
    value: '1',
    label: 'Breakfast',
  },
  {
    value: '2',
    label: 'Lunch',
  },
]

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

// Dishes
export const dishes = [
  {
    value: '1',
    label: 'Grilled Chicken Breast',
  },
  {
    value: '2',
    label: 'Quinoa Salad',
  },
  {
    value: '3',
    label: 'Salmon with Asparagus',
  },
]

export default function CreateAccountForm({ data }: CreateAccountFormProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: data || {
      name: '',
      phone_number: '',
      username: '',
      password: '',
    },
  })

  function onSubmit(data: AccountFormData) {
    // startTransition(async () => {
    //   toast.success('Cập nhật tài khoản thành công')
    // })
  }

  const [membershipPackages, setMembershipPackages] = useState<AccountMembershipPackage[]>([
    {
      id: '1',
      membership_id: '1', // Basic
      start_date: '2025-01-15',
      end_date: '2025-02-15', // 1 month duration
      plan_id: '1',
      gift_id: '1', // Mũ tập gym
    },
    {
      id: '2',
      membership_id: '2', // Premium
      start_date: '2025-03-01',
      end_date: '2025-06-01', // 3 months duration
      plan_id: '1',
      gift_id: '1', // Mũ tập gym
    },
    {
      id: '3',
      membership_id: '3', // VIP
      start_date: '2024-11-01',
      end_date: '2025-05-01', // 6 months duration
      plan_id: '1',
      gift_id: '4', // Giày tập gym
    },
  ])

  const format = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + months)
    return newDate
  }

  // Create cell components that can safely use hooks
  const MembershipCell = ({
    row,
    setMembershipPackages,
  }: {
    row: AccountMembershipPackage
    setMembershipPackages: React.Dispatch<React.SetStateAction<AccountMembershipPackage[]>>
  }) => {
    const currentMembershipName = memberships.find((m) => m.id === row.membership_id)?.name || ''

    const handleMembershipChange = useCallback(
      (value: string) => {
        setMembershipPackages((prev) => prev.map((pkg) => (pkg.id === row.id ? { ...pkg, membership_id: value } : pkg)))
      },
      [row.id, setMembershipPackages]
    )

    return (
      <Select defaultValue={row.membership_id} onValueChange={handleMembershipChange}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn gói membership">{currentMembershipName}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {memberships.map((membership) => (
            <SelectItem key={membership.id} value={membership.id}>
              {membership.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const PlanCell = ({
    row,
    setMembershipPackages,
  }: {
    row: AccountMembershipPackage
    setMembershipPackages: React.Dispatch<React.SetStateAction<AccountMembershipPackage[]>>
  }) => {
    // Get available plans directly from current membership_id in row
    const availablePlans = memberships.find((m) => m.id === row.membership_id)?.plans || []

    const currentDuration = availablePlans.find((p) => p.id === row.plan_id)?.duration || ''

    // Handler to update plan selection and recalculate end date
    const handlePlanChange = useCallback(
      (value: string) => {
        setMembershipPackages((prev) =>
          prev.map((pkg) => {
            if (pkg.id === row.id) {
              // Find selected plan to get duration
              const selectedPlan = availablePlans.find((p) => p.id === value)
              const duration = selectedPlan?.duration || 0

              // Calculate new end date
              const endDate = pkg.start_date ? format(addMonths(new Date(pkg.start_date), duration)) : ''

              return { ...pkg, plan_id: value, end_date: endDate }
            }
            return pkg
          })
        )
      },
      [availablePlans, row.id, setMembershipPackages]
    )

    return (
      <Select defaultValue={row.plan_id} onValueChange={handlePlanChange}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn thời gian">{currentDuration ? `${currentDuration} tháng` : ''}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availablePlans.map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.duration} tháng
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const StartDateCell = ({
    row,
    setMembershipPackages,
  }: {
    row: AccountMembershipPackage
    setMembershipPackages: React.Dispatch<React.SetStateAction<AccountMembershipPackage[]>>
  }) => {
    const today = format(new Date())
    // We still need this state because we need to track user input before submitting
    const [startDate, setStartDate] = useState(row.start_date || today)

    // Compute duration from current row data
    const getDuration = () => {
      const selectedMembership = memberships.find((m) => m.id === row.membership_id)
      const selectedPlan = selectedMembership?.plans.find((p) => p.id === row.plan_id)
      return selectedPlan?.duration || 0
    }

    // Initialize end date when component mounts with default date
    useEffect(() => {
      if (!row.start_date) {
        const duration = getDuration()
        const endDate = format(addMonths(new Date(today), duration))

        setMembershipPackages((prev) =>
          prev.map((pkg) => (pkg.id === row.id ? { ...pkg, start_date: today, end_date: endDate } : pkg))
        )
      }
    }, []) // Empty dependency array ensures it only runs once

    // Handle date change
    const handleDateChange = useCallback(
      (newStartDate: string) => {
        setStartDate(newStartDate)

        const duration = getDuration()
        const endDate = newStartDate ? format(addMonths(new Date(newStartDate), duration)) : ''

        setMembershipPackages((prev) =>
          prev.map((pkg) => (pkg.id === row.id ? { ...pkg, start_date: newStartDate, end_date: endDate } : pkg))
        )
      },
      [getDuration, row.id, setMembershipPackages]
    )

    return (
      <input
        type="date"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
        value={startDate}
        min={today}
        onChange={(e) => handleDateChange(e.target.value)}
      />
    )
  }

  const EndDateCell = ({ row }: { row: AccountMembershipPackage }) => {
    return (
      <input
        type="date"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors read-only:bg-gray-100 read-only:cursor-not-allowed"
        value={row.end_date}
        readOnly
      />
    )
  }

  const GiftCell = ({
    row,
    setMembershipPackages,
  }: {
    row: AccountMembershipPackage
    setMembershipPackages: React.Dispatch<React.SetStateAction<AccountMembershipPackage[]>>
  }) => {
    const [selectedGiftId, setSelectedGiftId] = useState(row.gift_id)

    // Get available gifts for the selected membership
    const availableGifts = memberships.find((m) => m.id === row.membership_id)?.gifts || []

    const currentGiftName = availableGifts.find((g) => g.id === row.gift_id)?.name || ''

    const handleGiftChange = useCallback(
      (value: string) => {
        setMembershipPackages((prev) => prev.map((pkg) => (pkg.id === row.id ? { ...pkg, gift_id: value } : pkg)))
      },
      [row.id, setMembershipPackages]
    )

    return (
      <Select defaultValue={row.gift_id} onValueChange={handleGiftChange}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn quà tặng">{currentGiftName}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableGifts.map((gift) => (
            <SelectItem key={gift.id} value={gift.id}>
              {gift.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const accountMembershipColumns: ColumnDef<AccountMembershipPackage>[] = [
    {
      accessorKey: 'membership_id',
      header: 'Tên gói membership',
      render: ({ row }) => <MembershipCell row={row} setMembershipPackages={setMembershipPackages} />,
    },
    {
      accessorKey: 'plan_id',
      header: 'Thời gian gói (tháng)',
      render: ({ row }) => <PlanCell row={row} setMembershipPackages={setMembershipPackages} />,
    },
    {
      accessorKey: 'start_date',
      header: 'Ngày bắt đầu',
      render: ({ row }) => <StartDateCell row={row} setMembershipPackages={setMembershipPackages} />,
    },
    {
      accessorKey: 'end_date',
      header: 'Ngày kết thúc',
      render: ({ row }) => <EndDateCell row={row} />,
    },
    {
      accessorKey: 'gift_id',
      header: 'Quà tặng',
      render: ({ row }) => <GiftCell row={row} setMembershipPackages={setMembershipPackages} />,
    },
    {
      accessorKey: 'actions',
      header: '',
      render: ({ row }) => {
        // Function to handle deleting this row
        const handleDelete = () => {
          // Filter out the row with this ID
          setMembershipPackages(membershipPackages.filter((pkg) => pkg.id !== row.id))
        }

        return (
          <Button type="button" variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  // Function to add a new empty membership package
  const handleAddMembershipPackage = () => {
    // Find the highest existing ID and increment by 1
    const highestId = membershipPackages.reduce((max, pkg) => {
      const id = parseInt(pkg.id)
      return id > max ? id : max
    }, 0)

    // Create new ID
    const newId = (highestId + 1).toString()

    // Create new package with empty values
    const newPackage: AccountMembershipPackage = {
      id: newId,
      membership_id: '',
      start_date: '',
      end_date: '',
      plan_id: '',
      gift_id: '',
    }

    // Add to state
    setMembershipPackages([...membershipPackages, newPackage])
  }

  const membershipHeaderExtraContent = (
    <AddButton type="button" text="Thêm gói membership" onClick={handleAddMembershipPackage} />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Account Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account - STT</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên" />
            <FormInputField
              form={form}
              name="phone_number"
              label="Số điện thoại"
              required
              placeholder="Nhập số điện thoại"
            />
            <FormInputField form={form} name="username" label="Username" required placeholder="Nhập username" />
            <FormInputField
              form={form}
              name="password"
              type="password"
              label="Mật khẩu"
              required
              placeholder="Nhập mật khẩu"
            />
          </div>
        </div>

        {/* Membership Packages */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Gói membership</h2>
          <DataTable
            data={membershipPackages}
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
              data={menuItems}
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
