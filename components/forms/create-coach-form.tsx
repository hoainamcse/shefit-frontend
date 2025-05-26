'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTransition } from 'react'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUploader } from '@/components/file-uploader'
import { toast } from 'sonner'
import { MainButton } from '@/components/buttons/main-button'
import { FormInputField } from './fields/form-input-field'
import { FormTextareaField } from './fields'
import { Coach } from '@/models/coaches'
import { FormImageInputField } from './fields/form-image-input-field'
import { createCoach, updateCoach } from '@/network/server/coaches'
import { useRouter } from 'next/navigation'

const coachSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  image: z.string().url().min(1, { message: 'Image is required' }),
  detail: z.string().min(10, {
    message: 'Detail must be at least 10 characters.',
  }),
})

type FormValues = z.infer<typeof coachSchema>

type CoachFormProps = {
  isEdit: boolean
  data?: Coach
}

export function CreateCoachForm({ isEdit, data }: CoachFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Convert the image URL to File[] if in edit mode and data exists
  const initialValues: Partial<FormValues> = data || {
    name: '',
    description: '',
    image: '',
    detail: '',
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(coachSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (!isEdit) {
          const coachResult = await createCoach(values)
          if (coachResult.status === 'success') {
            toast.success('Tạo huấn luyện viên thành công')
            router.push('/admin/coach')
          }
        } else {
          if (data?.id) {
            const coachResult = await updateCoach(data.id.toString(), values)
            if (coachResult.status === 'success') {
              toast.success('Cập nhật huấn luyện viên thành công')
            }
          }
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error(isEdit ? 'Cập nhật bài viết thất bại' : 'Tạo bài viết thất bại')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên huấn luyện viên" />
        <FormInputField form={form} name="detail" label="Chuyên môn" required placeholder="Nhập chuyên môn" />
        <FormTextareaField form={form} name="description" label="Quote" required placeholder="Nhập quote" />
        <FormImageInputField form={form} name="image" label="Hình ảnh" />
        <MainButton text={!isEdit ? 'Tạo mới' : 'Lưu'} type="submit" loading={isPending} />
      </form>
    </Form>
  )
}
