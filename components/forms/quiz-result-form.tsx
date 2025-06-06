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
import { FormImageInputField } from './fields/form-image-input-field'
import { Blog } from '@/models/blog'
import { createBlog, updateBlog } from '@/network/server/blog'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from './fields/rich-text-editor'
import { FormTextareaField } from './fields/form-textarea-field'
import { updateUserBodyQuizz } from '@/network/server/user-body-quizz'
import { UserBodyQuizz } from '@/models/user-body-quizz'
import { formatDateString } from '@/lib/helpers'

// Define the form schema
const formSchema = z.object({
  comment: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type QuizResultFormProps = {
  isEdit: boolean
  data?: UserBodyQuizz
}

export function QuizResultForm({ isEdit, data }: QuizResultFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const initialValues: Partial<FormValues> = {
    comment: '',
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data ? { comment: data.comment } : initialValues,
  })

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (isEdit && data?.id) {
          const updateData = {
            ...data,
            comment: values?.comment || '',
          }
          const result = await updateUserBodyQuizz(data.id.toString(), updateData)
          if (result.status === 'success') {
            toast.success('Cập nhật kết quả thành công')
            router.push('/admin/quizzes/results')
          }
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error(isEdit ? 'Cập nhật kết quả thất bại' : 'Tạo kết quả thất bại')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-800">User Name</label>
                <p className="mt-1 text-gray-700">{data?.user_name}</p>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800">Telephone Number</label>
                <p className="mt-1 text-gray-700">{data?.telephone_number}</p>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800">Created At</label>
                <p className="mt-1 text-gray-700">{formatDateString(data?.created_at || '')}</p>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800">Updated At</label>
                <p className="mt-1 text-gray-700">{formatDateString(data?.updated_at || '')}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-base font-semibold text-gray-800">Responses</label>
                <ul className="list-none p-0 m-0 space-y-2 mt-2">
                  {data?.responses?.map((response, idx) => (
                    <li key={idx} className="bg-gray-50 p-3 rounded-md text-gray-800 shadow-sm">
                      {response}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <label className="block text-base font-semibold text-gray-800">Comment</label>
          <FormTextareaField form={form} name="comment" className="h-64" placeholder="Nhập nhận xét" />
        </div>
        <MainButton text={!isEdit ? 'Tạo kết quả' : 'Cập nhật kết quả'} type="submit" loading={isPending} />
      </form>
    </Form>
  )
}
