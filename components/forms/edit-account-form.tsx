'use client'

import { Button } from '@/components/ui/button'
import { FormInputField, FormSelectField } from '@/components/forms/fields'
import { MainButton } from '../buttons/main-button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { User } from '@/models/user'
import { generatePassword } from '@/utils/helpers'
import { getUser, updatePassword, updateUser } from '@/network/client/users'
import { PROVINCES } from '@/lib/label'
import { useSession } from '@/hooks/use-session'
import { roleOptions } from '@/lib/label'
import { useForm } from 'react-hook-form'
import { Form } from '../ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useMutation } from '@tanstack/react-query'

// Basic account information schema
const accountSchema = z.object({
  id: z.coerce.number().optional(),
  fullname: z.string().min(3, { message: 'Họ và tên phải có ít nhất 3 ký tự.' }),
  phone_number: z
    .string()
    .min(10, { message: 'Số điện thoại phải có ít nhất 10 ký tự.' })
    .regex(/^0[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ.' }),
  email: z.string().email().nullable(),
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
})

// Password change schema
const passwordSchema = z.object({
  new_password: z.string().min(1, { message: 'New password must be at least 1 characters' }),
})

type AccountFormData = z.infer<typeof accountSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

interface EditAccountFormProps {
  data: User
}

export default function EditAccountForm({ data }: EditAccountFormProps) {
  const { session } = useSession()
  const [isApplyingPassword, setIsApplyingPassword] = useState(false)

  // Basic information form
  const basicInfoForm = useForm<AccountFormData>({
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
        }
      : {
          fullname: '',
          phone_number: '',
          email: null,
          username: '',
          province: '',
          address: '',
          role: 'normal_user',
        },
  })

  // Password change form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      new_password: '',
    },
  })

  // Handler for basic info submission
  const basicInfoMutation = useMutation({
    mutationFn: (values: AccountFormData) => {
      // Update user basic information
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
      return updateUser(data.id, userUpdateData)
    },
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success('Cập nhật tài khoản thành công')
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onBasicInfoSubmit = (values: AccountFormData) => {
    basicInfoMutation.mutate(values)
  }

  // Handler for password change
  const onPasswordSubmit = async (values: PasswordFormData) => {
    setIsApplyingPassword(true)
    try {
      const newestUserData = await getUser(data.id)
      const updateData = {
        role: 'admin',
        username: newestUserData.data.username,
        new_password: values.new_password,
      }

      await updatePassword(updateData)
      toast.success('Mật khẩu đã được cập nhật thành công')
      passwordForm.reset()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật mật khẩu')
    } finally {
      setIsApplyingPassword(false)
    }
  }

  // Generate random password and set it in the form
  const handleGeneratePassword = () => {
    const pwd = generatePassword()
    passwordForm.setValue('new_password', pwd)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Basic Information Section */}
      <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b pb-4">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...basicInfoForm}>
            <form onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* First row - name and phone */}
                <div className="relative group">
                  <FormInputField form={basicInfoForm} name="fullname" label="Tên" required placeholder="Nhập tên" />
                </div>
                <div className="relative group">
                  <FormInputField
                    form={basicInfoForm}
                    name="phone_number"
                    label="Số điện thoại"
                    type="tel"
                    pattern="^0[0-9]{9,10}$"
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Second row - email and username */}
                <div className="relative group">
                  <FormInputField
                    form={basicInfoForm}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Nhập email"
                  />
                </div>
                <div className="relative group">
                  <FormInputField
                    form={basicInfoForm}
                    name="username"
                    label="Username"
                    required
                    placeholder="Nhập username"
                  />
                </div>

                {/* Admin role - only for admins */}
                {session?.role === 'admin' && (
                  <div className="col-span-2 relative group">
                    <FormSelectField
                      form={basicInfoForm}
                      name="role"
                      label="Role"
                      placeholder="Chọn role"
                      data={roleOptions}
                    />
                  </div>
                )}

                {/* Province dropdown - full width */}
                <div className="col-span-2 relative group">
                  <FormSelectField
                    form={basicInfoForm}
                    name="province"
                    label="Tỉnh / thành phố"
                    placeholder="Chọn tỉnh/thành phố của bạn đang sống"
                    data={PROVINCES}
                  />
                </div>

                {/* Address - full width */}
                <div className="col-span-2 relative group">
                  <FormInputField
                    form={basicInfoForm}
                    name="address"
                    label="Địa chỉ chi tiết"
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                {basicInfoForm.formState.isDirty && (
                  <MainButton text="Cập nhật" loading={basicInfoMutation.isPending} />
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b pb-4">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
              <circle cx="16.5" cy="7.5" r=".5" />
            </svg>
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="relative group">
                  <FormInputField
                    form={passwordForm}
                    name="new_password"
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 transition-all"
                    variant="outline"
                    onClick={handleGeneratePassword}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z" />
                    </svg>
                    Tạo mật khẩu ngẫu nhiên
                  </Button>
                </div>
              </div>

              <MainButton
                type="submit"
                text="Cập nhật mật khẩu"
                className="w-full mt-8 transition-all"
                loading={isApplyingPassword}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
