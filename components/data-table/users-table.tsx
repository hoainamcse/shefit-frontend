'use client'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Download, X } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { RowActions } from '@/components/data-table/row-actions'
import { DataTable } from '@/components/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

import { MainButton } from '../buttons/main-button'
import {
  deleteBulkUser,
  deleteUser,
  getUser,
  getUsers,
  getUserSubscriptions,
  importUsersExcel,
  queryKeyUsers,
  updateUser,
} from '@/network/client/users'
import { User } from '@/models/user'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { PROVINCES, roleLabel } from '@/lib/label'
import { getUsersBySubAdmin, getSubscription } from '@/network/client/subscriptions'
import { formatDateString, generatePassword, generateUsername, sortByKey } from '@/lib/helpers'
import { AddButton } from '../buttons/add-button'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { register } from '@/network/client/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { FormInputField, FormSelectField } from '../forms/fields'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { useSession } from '@/hooks/use-session'
import { DialogExcelImport } from '../dialogs/dialog-excel-import'
import { FilterableSelect, FilterableSelectOption } from '../ui/filterable-select'

export function UsersTable() {
  const { session, isLoading: isPending } = useSession()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  })

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Add sort states
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<string>('desc')

  // Available sort options
  const sortByOptions: FilterableSelectOption[] = useMemo(
    () => [
      { value: 'username', label: 'Username' },
      { value: 'created_at', label: 'Ngày tạo' },
      { value: 'subscription_end_at', label: 'Ngày kết thúc gói' },
      { value: 'course_clicks_current_month', label: 'Click khoá tập' },
      { value: 'meal_plan_clicks_current_month', label: 'Click thực đơn' },
    ],
    []
  )

  // Sort order options
  const sortOrderOptions: FilterableSelectOption[] = useMemo(
    () => [
      { value: 'asc', label: 'Tăng dần' },
      { value: 'desc', label: 'Giảm dần' },
    ],
    []
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      queryKeyUsers,
      {
        ...pagination,
        ...(debouncedSearchQuery ? { keyword: debouncedSearchQuery } : {}),
        ...(sortBy ? { sort_by: sortBy, sort_order: sortOrder } : {}),
      },
    ],
    queryFn: async () =>
      session?.role === 'sub_admin'
        ? getUsersBySubAdmin({
            page: pagination.pageIndex,
            per_page: pagination.pageSize,
            ...(sortBy ? { sort_by: sortBy, sort_order: sortOrder } : {}),
            ...(debouncedSearchQuery ? { keyword: debouncedSearchQuery } : {}),
          })
        : getUsers({
            page: pagination.pageIndex,
            per_page: pagination.pageSize,
            ...(sortBy ? { sort_by: sortBy, sort_order: sortOrder } : {}),
            ...(debouncedSearchQuery ? { keyword: debouncedSearchQuery } : {}),
          }),
    placeholderData: keepPreviousData,
    enabled: !!session,
  })

  const handleChatbotToggle = useCallback(
    async (bot_config: Partial<Pick<User, 'enable_chatbot' | 'enable_chatbot_actions'>>, user: User) => {
      try {
        const { email, ...rest } = user
        await updateUser(user.id, { ...rest, ...bot_config })
        toast.success('Đã cập nhật trạng thái chatbot')
        refetch()
      } catch (error: any) {
        console.error(error)
        toast.error('Lỗi khi cập nhật trạng thái chatbot')
      }
    },
    [refetch]
  )

  // Helper function for subscription date formatting
  const getFormattedSubscriptionDate = (
    user: User,
    dateField: 'subscription_start_at' | 'subscription_end_at'
  ): string => {
    const sortedSubs = sortByKey(user.subscriptions, 'subscription_start_at', {
      transform: (val) => new Date(val).getTime(),
      direction: 'desc',
    })
    return sortedSubs.length > 0 ? format(sortedSubs[0][dateField], 'dd/MM/yyyy') : '-'
  }

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 28,
      },
      // {
      //   accessorKey: 'id',
      //   header: 'STT',
      //   size: 70,
      // },
      {
        header: 'Tên',
        accessorKey: 'fullname',
        size: 180,
      },
      {
        header: 'Username',
        accessorKey: 'username',
        size: 120,
      },
      {
        header: 'SĐT',
        accessorKey: 'phone_number',
        size: 150,
      },
      // {
      //   header: 'Email',
      //   accessorKey: 'email',
      //   size: 250,
      // },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {roleLabel[row.getValue('role') as keyof typeof roleLabel]}
          </Badge>
        ),
        size: 120,
      },
      {
        header: 'Token Usage',
        accessorKey: 'token_usage',
        size: 120,
      },
      {
        header: 'Bật bot',
        accessorKey: 'enable_chatbot',
        cell: ({ row }) => (
          <Switch
            className="transform scale-75"
            checked={row.getValue('enable_chatbot')}
            onCheckedChange={(checked) => handleChatbotToggle({ enable_chatbot: checked }, row.original)}
          />
        ),
        size: 80,
      },
      {
        header: 'Bật thao tác',
        accessorKey: 'enable_chatbot_actions',
        cell: ({ row }) => (
          <Switch
            className="transform scale-75"
            checked={row.getValue('enable_chatbot_actions')}
            onCheckedChange={(checked) => handleChatbotToggle({ enable_chatbot_actions: checked }, row.original)}
          />
        ),
        size: 80,
      },
      {
        accessorKey: 'created_at',
        header: 'Ngày tạo',
        cell: ({ row }) => (
          <div className="font-medium">{format(new Date(row.getValue('created_at')), 'dd/MM/yyyy')}</div>
        ),
        size: 100,
      },
      {
        header: 'Gói đăng ký',
        id: 'subscriptions',
        cell: ({ row }) => {
          const subscriptions = row.original.subscriptions || []
          if (subscriptions.length === 0) return '-'

          return (
            <div className="flex flex-wrap gap-2">
              {subscriptions.map((userSub) => (
                <Badge key={userSub.subscription.id} variant="outline">
                  {userSub.subscription.name}
                </Badge>
              ))}
            </div>
          )
        },
        size: 180,
      },
      {
        header: 'Ngày bắt đầu (latest)',
        id: 'subscription_start',
        cell: ({ row }) => getFormattedSubscriptionDate(row.original, 'subscription_start_at'),
        size: 120,
      },
      {
        header: 'Ngày kết thúc (latest)',
        id: 'subscription_end',
        cell: ({ row }) => getFormattedSubscriptionDate(row.original, 'subscription_end_at'),
        size: 120,
      },
      {
        header: 'Coupon dùng',
        id: 'coupons',
        cell: ({ row }) => {
          const sortedSubs = sortByKey(row.original.subscriptions, 'subscription_start_at', {
            transform: (val) => new Date(val).getTime(),
            direction: 'desc',
          })

          // Use Set to track unique coupon IDs
          const uniqueCouponIds = new Set<number>()
          const uniqueCoupons = sortedSubs
            .filter((s) => s.coupon)
            .filter((s) => {
              // Only include coupons we haven't seen before
              if (s.coupon && !uniqueCouponIds.has(s.coupon.id)) {
                uniqueCouponIds.add(s.coupon.id)
                return true
              }
              return false
            })
            .map((s) => s.coupon?.code)
            .filter(Boolean) as string[]

          if (uniqueCoupons.length === 0) return '-'

          return (
            <div className="flex flex-wrap gap-2">
              {uniqueCoupons.map((coupon) => (
                <Badge key={coupon} variant="outline">
                  {coupon}
                </Badge>
              ))}
            </div>
          )
        },
        size: 150,
      },
      {
        header: 'Tình trạng gói',
        id: 'subscription_status',
        cell: ({ row }) => {
          const subscriptions = row.original.subscriptions || []
          if (subscriptions.length === 0) return '-'

          const hasActiveSubscription = subscriptions.some((s) => isActiveSubscription(s.status, s.subscription_end_at))

          return hasActiveSubscription ? (
            <Badge className="bg-[#13D8A7] rounded-none border border-[#000000]">Còn hạn</Badge>
          ) : (
            <Badge className="bg-[#E61417] rounded-none border border-[#000000]">Hết hạn</Badge>
          )
        },
        size: 120,
      },
      {
        header: 'Lần click khoá tập (tháng này)',
        accessorKey: 'course_clicks_current_month',
        size: 150,
      },
      {
        header: 'Lần click thực đơn (tháng này)',
        accessorKey: 'meal_plan_clicks_current_month',
        size: 150,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} onEdit={onEditRow} onDelete={onDeleteRow} />,
        size: 60,
      },
    ],
    [handleChatbotToggle]
  )

  const router = useRouter()

  const onEditRow = (row: User) => {
    router.push(`/admin/users/${row.id}`)
  }

  const onDeleteRow = async (row: User) => {
    const deletePromise = () => deleteUser(row.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá tài khoản thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteRows = async (selectedRows: User[]) => {
    const deletePromise = () => deleteBulkUser(selectedRows.map((row) => row.id))

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá tài khoản thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">{error?.message}</p>
      </div>
    )
  }

  return (
    <DataTable
      data={data?.data}
      columns={columns}
      state={{ pagination }}
      rowCount={data?.paging.total}
      onDelete={onDeleteRows}
      onPaginationChange={setPagination}
      leftSection={
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Input
              placeholder="Nhập username hoặc SĐT"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-8"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>

          {/* Sort selects */}
          <div className="flex items-center gap-2">
            <FilterableSelect
              value={sortBy || ''}
              onValueChange={setSortBy}
              options={sortByOptions}
              placeholder="Chọn trường sắp xếp"
              className="w-56"
            />
            <FilterableSelect
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value || 'asc')}
              options={sortOrderOptions}
              placeholder="Kiểu sắp xếp"
              className="w-36"
              showClearButton={false}
              disabled={!sortBy}
            />
          </div>
        </div>
      }
      rightSection={
        <>
          <CreateAccountDialog updateData={refetch}>
            <AddButton text="Thêm tài khoản" />
          </CreateAccountDialog>
          <ExportDialog data={data?.data} onSuccess={() => toast.success('Đã xuất danh sách tài khoản thành công')} />
          <DialogExcelImport
            title="Tài khoản"
            handleSubmit={async (file: File) => {
              await importUsersExcel(file)
              refetch()
            }}
          />
        </>
      }
    />
  )
}

function CreateAccountDialog({ children, updateData }: { children: React.ReactNode; updateData?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm tài khoản</DialogTitle>
        </DialogHeader>
        <CreateAccountForm
          onSuccess={() => {
            setOpen(false)
            updateData?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function CreateAccountForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const formSchema = z.object({
    fullname: z.string().min(3, {
      message: 'Họ và tên phải có ít nhất 3 ký tự.',
    }),
    phone_number: z
      .string()
      .min(10, { message: 'Số điện thoại phải có ít nhất 10 ký tự.' })
      .regex(/^0[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ.' }),
    username: z.string().min(3, {
      message: 'Username phải có ít nhất 3 ký tự.',
    }),
    password: z.string().min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự.',
    }),
    province: z.enum([...PROVINCES.map((province) => province.value)] as [string, ...string[]], {
      message: 'Bạn phải chọn tỉnh/thành phố',
    }),
    address: z.string().min(6, {
      message: 'Địa chỉ phải có ít nhất 6 ký tự.',
    }),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      phone_number: '',
      username: '',
      password: '',
      province: '',
      address: '',
    },
  })

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        // Register the user with all data in a single call
        const res = await register(values)

        if (res.status !== 'success') {
          toast.error('Có lỗi khi tạo tài khoản')
          return
        }

        const userId = res.data?.user_id
        if (!userId) {
          toast.error('Không nhận được ID người dùng')
          return
        }

        const userData = await getUser(userId)
        if (userData.status !== 'success') {
          toast.error('Không nhận được thông tin người dùng')
          return
        }

        // Update user with province and address in a single call
        const updateRes = await updateUser(userId.toString(), {
          ...userData.data,
          province: values.province,
          address: values.address,
        })

        if (updateRes.status === 'success') {
          toast.success('Tạo tài khoản thành công')
          onSuccess?.()
        } else {
          toast.error('Cập nhật thông tin địa chỉ thất bại')
        }
      } catch (error: any) {
        console.error('Account creation error:', error)
        toast.error(error?.message || 'Có lỗi xảy ra khi tạo tài khoản')
      }
    })
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'fullname' && value.fullname) {
        const username = generateUsername(value.fullname)
        form.setValue('username', username)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInputField form={form} name="fullname" label="Họ & tên" required placeholder="Nhập họ & tên" />

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
        <FormInputField form={form} name="address" label="Địa chỉ chi tiết" placeholder="Nhập địa chỉ của bạn" />

        <FormInputField form={form} name="username" label="Username" required placeholder="Nhập username" />
        <div className="grid grid-cols-12 w-full gap-2">
          <div className="col-span-9">
            <FormInputField
              form={form}
              name="password"
              label="Mật khẩu"
              required
              placeholder="Nhập mật khẩu"
              className="w-full"
            />
          </div>
          <div className="col-span-3 flex items-end">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                const password = generatePassword()
                form.setValue('password', password)
              }}
            >
              Tạo mật khẩu
            </Button>
          </div>
        </div>
        <MainButton text="Tạo" className="w-full" loading={isPending} />
      </form>
    </Form>
  )
}

function ExportDialog({ data, onSuccess }: { data?: User[]; onSuccess?: () => void }) {
  if (!data) return null

  const [isPending, setIsPending] = useState(false)

  const onSubmit = async () => {
    setIsPending(true)
    try {
      const headers = [
        'ID',
        'Họ & tên',
        'Username',
        'Số điện thoại',
        'Email',
        'Role',
        'Ngày tạo',
        'Tỉnh/Thành phố',
        'Địa chỉ chi tiết',
        'Gói tập',
        'Ngày bắt đầu',
        'Ngày kết thúc',
        'Code khuyến mãi',
        'Khoá tập',
        'Thực đơn',
        'Động tác',
        'Món ăn',
      ]
      const csvRows = []
      csvRows.push(headers.join(','))

      for (const account of data) {
        const userId = account.id

        try {
          const userSubscriptionsResponse = await getUserSubscriptions(userId)

          if (userSubscriptionsResponse?.data && userSubscriptionsResponse.data.length > 0) {
            for (const sub of userSubscriptionsResponse.data) {
              const subscriptionDetail = await getSubscription(sub.subscription.id)
              const subName = subscriptionDetail.data.name
              const startDate = sub.subscription_start_at ? formatDateString(sub.subscription_start_at) : ''
              const endDate = sub.subscription_end_at ? formatDateString(sub.subscription_end_at) : ''

              const courseNames = sub.subscription.courses.map((course) => course.course_name).join(', ')
              const mealPlanNames = sub.meal_plans.map((meal) => meal.title).join(', ')
              const exerciseNames = sub.exercises.map((exercise) => exercise.name).join(', ')
              const dishNames = sub.dishes.map((dish) => dish.name).join(', ')

              const row = [
                account.id.toString(),
                account.fullname,
                account.username,
                account.phone_number,
                account.email,
                roleLabel[account.role],
                account.created_at,
                account.province || '',
                account.address || '',
                subName,
                startDate,
                endDate,
                sub.coupon?.code || '',
                courseNames,
                mealPlanNames,
                exerciseNames,
                dishNames,
              ]
              csvRows.push(row.map((field) => `"${field}"`).join(','))
            }
          } else {
            // If no subscriptions, still add a row with user data and empty subscription fields
            const row = [
              account.id.toString(),
              account.fullname,
              account.username,
              account.phone_number,
              account.email,
              roleLabel[account.role],
              account.created_at,
              account.province || '',
              account.address || '',
              '', // Gói tập
              '', // Ngày bắt đầu
              '', // Ngày kết thúc
              '', // Code khuyến mãi
              '', // Khoá tập
              '', // Thực đơn
              '', // Động tác
              '', // Món ăn
            ]
            csvRows.push(row.map((field) => `"${field}"`).join(','))
          }
        } catch (error) {
          console.error(`Error fetching detailed data for user ${userId}:`, error)
          // If an error occurs, still add a row with user data and empty subscription fields
          const row = [
            account.id.toString(),
            account.fullname,
            account.username,
            account.phone_number,
            account.email,
            roleLabel[account.role],
            account.created_at,
            account.province || '',
            account.address || '',
            '', // Gói tập
            '', // Ngày bắt đầu
            '', // Ngày kết thúc
            '', // Code khuyến mãi
            '', // Khoá tập
            '', // Thực đơn
            '', // Động tác
            '', // Món ăn
          ]
          csvRows.push(row.map((field) => `"${field}"`).join(','))
        }
      }

      const csvString = csvRows.join('\n')

      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'accounts.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      onSuccess?.()
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Có lỗi khi xuất dữ liệu')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Đang xuất dữ liệu. Vui lòng chờ...</p>
            <p className="text-sm text-gray-600 mt-2">Quá trình này có thể mất vài phút.</p>
            <div className="mt-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      )}
      <MainButton text="Xuất dữ liệu" icon={Download} variant="outline" onClick={onSubmit} loading={isPending} />
    </>
  )
}

function isActiveSubscription(status: string, endDate: string) {
  if (!endDate) return false
  const now = new Date()
  const end = new Date(endDate)
  return status === 'active' && end > now
}
