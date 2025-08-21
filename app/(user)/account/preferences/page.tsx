'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as z from 'zod'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormInputField, FormSelectField } from '@/components/forms/fields'

import { getUser, updateUser, updatePassword } from '@/network/client/users'
import { PROVINCES } from '@/lib/label'
import { useSession } from '@/hooks/use-session'
import { User } from '@/models/user'

// Form schemas
const userInfoSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
  fullname: z.string().min(1, 'Họ tên là bắt buộc'),
  phone_number: z.string().min(1, 'Số điện thoại là bắt buộc'),
  province: z.string().min(1, 'Tỉnh/thành phố là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  role: z.string().optional(),
  provider: z.string().optional(),
})

const passwordSchema = z.object({
  password: z.string().min(1, 'Mật khẩu cũ là bắt buộc'),
  new_password: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
})

type UserInfoForm = z.infer<typeof userInfoSchema>
type PasswordForm = z.infer<typeof passwordSchema>

// User Info Update Component
function UserInfoUpdateForm({ user: user }: { user: User }) {
  const queryClient = useQueryClient()

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: UserInfoForm) => updateUser(user.id, data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!')
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] })
    },
    onError: (error) => {
      toast.error('Cập nhật thông tin thất bại!')
      console.error('Update user error:', error)
    },
  })

  const form = useForm<UserInfoForm>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      username: user.username || '',
      fullname: user.fullname || '',
      phone_number: user.phone_number || '',
      province: user.province || '',
      address: user.address || '',
      role: user.role || 'normal_user',
      provider: user.provider || 'default',
    },
  })

  const onSubmit = (data: UserInfoForm) => {
    updateUserMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormInputField form={form} name="username" label="Tên đăng nhập" placeholder="Nhập tên đăng nhập của bạn" />

        <FormInputField form={form} name="fullname" label="Họ & tên" placeholder="Nhập tên của bạn" />

        <FormInputField
          form={form}
          name="phone_number"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại của bạn"
        />

        <FormSelectField
          form={form}
          name="province"
          label="Tỉnh / thành phố"
          placeholder="Chọn tỉnh/thành phố của bạn đang sống"
          data={PROVINCES}
        />

        <FormInputField form={form} name="address" label="Địa chỉ chi tiết" placeholder="Nhập địa chỉ của bạn" />

        <Button
          type="submit"
          className="bg-[#13D8A7] h-[38px] w-full text-sm md:text-lg font-normal rounded-[26px]"
          disabled={updateUserMutation.isPending}
        >
          {updateUserMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
        </Button>
      </form>
    </Form>
  )
}

// Password Update Component
function PasswordUpdateForm({ user }: { user: User }) {
  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: PasswordForm) => updatePassword({ username: user.username, new_password: data.new_password }),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!')
      form.reset()
    },
    onError: (error) => {
      toast.error('Đổi mật khẩu thất bại!')
      console.error('Update password error:', error)
    },
  })

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      new_password: '',
    },
  })

  const onSubmit = (data: PasswordForm) => {
    updatePasswordMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormInputField
          form={form}
          name="password"
          label="Mật khẩu cũ"
          placeholder="Nhập mật khẩu cũ"
          type="password"
        />

        <FormInputField
          form={form}
          name="new_password"
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          type="password"
        />

        <Button
          type="submit"
          className="bg-[#13D8A7] h-[38px] w-full text-sm md:text-lg font-normal rounded-[26px]"
          disabled={updatePasswordMutation.isPending}
        >
          {updatePasswordMutation.isPending ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
        </Button>
      </form>
    </Form>
  )
}

// Main Account Information Component
export default function AccountInformation() {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info')
  const { session } = useSession()

  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', session?.userId],
    queryFn: () => (session ? getUser(session.userId) : Promise.resolve(null)),
    enabled: !!session,
  })

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  if (!userData) {
    return <div>Không tìm thấy thông tin người dùng</div>
  }

  return (
    <div className="flex">
      <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px] flex-1 lg:max-w-[832px]">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-[#13D8A7] text-[#13D8A7] font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-[#13D8A7] text-[#13D8A7] font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Form Content */}
        {activeTab === 'info' ? (
          <UserInfoUpdateForm user={userData.data} />
        ) : (
          <PasswordUpdateForm user={userData.data} />
        )}
      </div>

      <div className="hidden lg:block flex-1">
        <div className="w-full aspect-[2/3] relative">
          <Image src="/two-women-doing-exercises.avif" fill className="object-cover" alt="image" />
        </div>
      </div>
    </div>
  )
}
