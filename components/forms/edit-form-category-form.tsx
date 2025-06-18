'use client'

import type { FormCategory } from '@/models/form-category'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createFormCategory, updateFormCategory } from '@/network/client/form-categories'
import { FormInputField } from './fields'
import { MainButton } from '../buttons/main-button'

const formSchema = z.object({
  name: z.string().min(1, 'Tên phom dáng không được để trống'),
})

type FormValue = z.infer<typeof formSchema>

interface EditFormCategoryFormProps {
  data: FormCategory | null
  onSuccess: () => void
}

export function EditFormCategoryForm({ data, onSuccess }: EditFormCategoryFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '' } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
        }
      : defaultValue,
  })

  const formCategoryMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateFormCategory(data.id, values) : createFormCategory(values)),
    onSettled(data, error) {
      if (data) {
        toast.success(isEdit ? 'Cập nhật phom dáng thành công' : 'Tạo phom dáng thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    formCategoryMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField
          form={form}
          name="name"
          label="Tên loại phom dáng"
          withAsterisk
          placeholder="Nhập tên loại phom dáng"
        />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={formCategoryMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
