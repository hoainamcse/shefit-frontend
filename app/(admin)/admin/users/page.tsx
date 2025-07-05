'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AddButton } from '@/components/buttons/add-button'
import { ColumnDef, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form } from '@/components/ui/form'
import { FormInputField, FormSelectField } from '@/components/forms/fields'
import { Copy, Edit, Ellipsis, FolderDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MainButton } from '@/components/buttons/main-button'
import { useEffect, useState, useTransition } from 'react'
import { deleteUser, getUser, getUsers, updateUser  } from '@/network/client/users'
import { register } from '@/network/client/auth'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatDateString, generateUsername, generatePassword } from '@/lib/helpers'
import { PROVINCES } from '@/lib/label'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'
import { User } from '@/models/user'
import { getSubAdminUsers, getSubscription } from '@/network/client/subscriptions'
import { useSession } from '@/hooks/use-session'
import { roleLabel } from '@/lib/label'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/spinner'
import { getUserTokenUsage, getUserChatbotSettings, updateUserChatbotSettings } from '@/network/client/chatbot'
import { getUserSubscriptions } from '@/network/client/users'
import { Switch } from '@/components/ui/switch'

type UserRow = User & { token_usage: number; is_enable_chatbot: boolean }
export default function UsersPage() {
  const router = useRouter()
  const [accountTable, setAccountTable] = useState<UserRow[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const { session } = useSession()
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true)
    setFetchError(null)
    try {
      let userData
      if (session?.role === 'sub_admin') {
        userData = (await getSubAdminUsers()).data.filter((item) => item.id !== Number(session?.userId))
      } else {
        userData = (await getUsers()).data
      }

      const mapped = (userData || []).map((item: any) => {
        return {
          ...item,
          created_at: formatDateString(item.created_at),
        }
      })
      const enriched = await Promise.all(
        mapped.map(async (row) => {
          const [tokenResp, settingResp] = await Promise.all([
            getUserTokenUsage(row.id.toString()),
            getUserChatbotSettings(row.id.toString()),
          ])
          const usage = tokenResp.data?.total_tokens ?? 0
          const is_enable_chatbot = settingResp.data?.is_enable_chatbot ?? false
          return { ...row, token_usage: usage, is_enable_chatbot }
        })
      )
      setAccountTable(enriched)
    } catch (error: any) {
      console.error(error)
      setFetchError('Có lỗi khi tải danh sách tài khoản')
      toast.error('Lỗi khi tải danh sách tài khoản')
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const handleExportCsv = async () => {
    if (accountTable.length === 0) {
      toast.info('Không có dữ liệu để xuất.')
      return
    }

    try {
      setIsExporting(true)
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
        'Gói membership',
        'Ngày bắt đầu',
        'Ngày kết thúc',
        'Code khuyến mãi',
        'Khoá tập',
        'Thực đơn',
        'Bài tập',
        'Món ăn',
      ]
      const csvRows = []
      csvRows.push(headers.join(','))

      for (const account of accountTable) {
        const userId = account.id.toString()

        try {
          const userSubscriptionsResponse = await getUserSubscriptions(userId)

          if (userSubscriptionsResponse?.data && userSubscriptionsResponse.data.length > 0) {
            for (const sub of userSubscriptionsResponse.data) {
              const subscriptionDetail = await getSubscription(sub.subscription.id.toString())
              const membershipName = subscriptionDetail.data.name
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
                membershipName,
                startDate,
                endDate,
                sub.coupon_code || '',
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
              '', // Gói membership
              '', // Ngày bắt đầu
              '', // Ngày kết thúc
              '', // Code khuyến mãi
              '', // Khoá tập
              '', // Thực đơn
              '', // Bài tập
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
            '', // Gói membership
            '', // Ngày bắt đầu
            '', // Ngày kết thúc
            '', // Code khuyến mãi
            '', // Khoá tập
            '', // Thực đơn
            '', // Bài tập
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
      toast.success('Dữ liệu đã được xuất thành công!')
      setIsExporting(false)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Có lỗi khi xuất dữ liệu')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async (accountId: number) => {
    try {
      const res = await deleteUser(accountId.toString())
      if (res.status === 'success') {
        toast.success('Xoá tài khoản thành công')
        fetchAccounts()
      }
    } catch (e) {
      toast.error('Có lỗi khi xoá tài khoản')
    }
  }

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: 'id',
      header: 'STT',
    },
    {
      accessorKey: 'fullname',
      header: 'Tên',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'phone_number',
      header: 'SDT',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'token_usage',
      header: 'Token Usage',
    },
    {
      accessorKey: 'is_enable_chatbot',
      header: 'Enable Chatbot',
      render: ({ row }) => (
        <Switch
          className="transform scale-75"
          checked={row.is_enable_chatbot}
          onCheckedChange={async (checked) => {
            const prev = row.is_enable_chatbot
            // Optimistic update
            setAccountTable((prevTable) =>
              prevTable.map((r) => (r.id === row.id ? { ...r, is_enable_chatbot: checked } : r))
            )
            try {
              console.log('checked', checked)
              await updateUserChatbotSettings(row.id.toString(), { is_enable_chatbot: checked })
              toast.success('Đã cập nhật trạng thái chatbot')
            } catch (error: any) {
              console.error(error)
              toast.error('Lỗi khi cập nhật trạng thái chatbot')
              // Revert
              setAccountTable((prevTable) =>
                prevTable.map((r) => (r.id === row.id ? { ...r, is_enable_chatbot: prev } : r))
              )
            }
          }}
        />
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Ngày tạo',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      render: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {roleLabel[row.role]}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      render: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem>
              <Copy /> Sao chép tài khoản ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/admin/users/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DeleteMenuItem onConfirm={() => handleDeleteAccount(row.id)} />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  const headerExtraContent = (
    <div className="flex items-center gap-2">
      <CreateAccountDialog updateData={fetchAccounts}>
        <AddButton text="Thêm tài khoản" />
      </CreateAccountDialog>
      <MainButton variant="outline" text="Xuất dữ liệu" onClick={handleExportCsv} icon={FolderDown} />
    </div>
  )

  useEffect(() => {
    fetchAccounts()
  }, [])

  return (
    <>
      {isExporting && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Đang xuất dữ liệu. Vui lòng chờ...</p>
            <p className="text-sm text-gray-600 mt-2">Quá trình này có thể mất vài phút.</p>
            <div className="mt-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      )}
      <ContentLayout title="Danh sách tài khoản">
        {fetchError ? (
          <div className="p-4 text-destructive">{fetchError}</div>
        ) : isLoadingAccounts ? (
          <div className="flex justify-center p-4">
            <Spinner className="bg-ring dark:bg-white" />
          </div>
        ) : (
          <DataTable
            headerExtraContent={session?.role === 'admin' ? headerExtraContent : null}
            searchPlaceholder="Tìm kiếm theo sdt"
            data={accountTable}
            columns={columns}
            onSelectChange={() => {}}
          />
        )}
      </ContentLayout>
    </>
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
