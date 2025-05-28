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
import { FormMultiSelectField, FormInputField, FormTextareaField, FormSelectField } from '@/components/forms/fields'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2, FolderDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MainButton } from '@/components/buttons/main-button'
import { useEffect, useState, useTransition } from 'react'
import { deleteUser, getUserById, getUsers, register, updateUser } from '@/network/server/user'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateUsername, generatePassword } from '@/helper/user'
import PROVINCES from './provinceData'
import { DeleteMenuItem } from '@/components/buttons/delete-menu-item'
import { User } from '@/models/user'
import { formatDateString } from '@/lib/utils'

export default function AccountPage() {
  const router = useRouter()
  const [accountTable, setAccountTable] = useState<User[]>([])

  const fetchAccounts = async () => {
    const response = await getUsers()
    const mapped = (response.data || []).map((item: any) => {
      return {
        ...item,
        created_at: formatDateString(item.created_at),
      }
    })
    setAccountTable(mapped)
  }

  const handleExportCsv = () => {
    if (accountTable.length === 0) {
      toast.info('Không có dữ liệu để xuất.')
      return
    }

    const headers = [
      'ID',
      'Họ & tên',
      'Username',
      'Số điện thoại',
      'Role',
      'Ngày tạo',
      'Tỉnh/Thành phố',
      'Địa chỉ chi tiết',
    ]
    const csvRows = []
    csvRows.push(headers.join(','))

    accountTable.forEach((account) => {
      const row = [
        account.id.toString(),
        account.fullname,
        account.username,
        account.phone_number,
        account.role,
        account.created_at,
        account.province || '',
        account.address || '',
      ]
      csvRows.push(row.map((field) => `"${field}"`).join(','))
    })

    const csvString = csvRows.join('\n')
    console.log(csvRows)
    console.log(csvString)

    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'accounts.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Dữ liệu đã được xuất thành công!')
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

  const columns: ColumnDef<User>[] = [
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
      accessorKey: 'created_at',
      header: 'Ngày tạo',
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
            <DropdownMenuItem onClick={() => router.push(`/admin/account/${row.id}`)}>
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
    <ContentLayout title="Danh sách tài khoản">
      <DataTable
        headerExtraContent={headerExtraContent}
        searchPlaceholder="Tìm kiếm theo sdt"
        data={accountTable}
        columns={columns}
        onSelectChange={() => {}}
      />
    </ContentLayout>
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

        const userData = await getUserById(userId)
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
      } catch (error) {
        console.error('Account creation error:', error)
        toast.error('Có lỗi xảy ra khi tạo tài khoản')
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
