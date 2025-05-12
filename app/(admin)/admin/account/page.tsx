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
import { FormMultiSelectField, FormInputField, FormTextareaField } from '@/components/forms/fields'
import { Copy, Edit, Ellipsis, Eye, Import, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MainButton } from '@/components/buttons/main-button'
import { equipments, muscleGroups } from '@/components/forms/create-course-form'
import { useEffect, useState, useTransition } from 'react'
import { deleteUser, getUsers, register } from '@/network/server/user'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateUsername, generatePassword } from '@/helper/user'

interface AccountRow {
  id: number
  fullname: string
  phone_number: string
  username: string
  created_at: string
}

export default function AccountPage() {
  const router = useRouter()
  const [accountTable, setAccountTable] = useState<AccountRow[]>([])

  const fetchAccounts = async () => {
    const response = await getUsers()
    const mapped = (response.data || []).map((item: any) => {
      const date = new Date(item.created_at)
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-
        ${date.getMonth().toString().padStart(2, '0')}-
        ${date.getFullYear()}`
      return {
        id: item.id,
        fullname: item.fullname,
        username: item.username,
        phone_number: item.phone_number,
        created_at: formattedDate,
      }
    })
    setAccountTable(mapped)
  }

  const handleDeleteAccount = async (accountId: number) => {
    if (window.confirm('Bạn có chắc muốn xoá tài khoản này?')) {
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
  }

  const columns: ColumnDef<AccountRow>[] = [
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
              <Copy /> Sao chép account ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/admin/account/${row.id}`)}>
              <Edit /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDeleteAccount(row.id)}
            >
              <Trash2 /> Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  const headerExtraContent = (
    <CreateAccountDialog updateData={fetchAccounts}>
      <AddButton text="Thêm tài khoản" />
    </CreateAccountDialog>
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
      message: 'Tên phải có ít nhất 3 ký tự.',
    }),
    phone_number: z.string().min(10, {
      message: 'Số điện thoại phải có ít nhất 10 ký tự.',
    }),
    username: z.string().min(3, {
      message: 'Username phải có ít nhất 3 ký tự.',
    }),
    password: z.string().min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự.',
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
    },
  })

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      const res = await register(values)
      if (res.status === 'success') {
        toast.success('Tạo tài khoản thành công')
        onSuccess?.()
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
        <FormInputField form={form} name="fullname" label="Tên" required placeholder="Nhập tên người dùng" />
        <FormInputField
          form={form}
          name="phone_number"
          label="Số điện thoại"
          required
          placeholder="Nhập số điện thoại"
          type="tel"
          pattern="^0[0-9]{9,10}$"
          onInput={(e) => {
            const input = e.target as HTMLInputElement
            input.value = input.value.replace(/[^0-9]/g, '')
          }}
        />
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
