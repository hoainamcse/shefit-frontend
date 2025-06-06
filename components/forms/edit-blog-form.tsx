'use client'

import type { Blog } from '@/models/blog'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createBlog, updateBlog } from '@/network/client/blogs'

import { FormInputField, FormRichTextField } from './fields'
import { MainButton } from '../buttons/main-button'
import { ImageUploader } from '../image-uploader'
import { Form } from '../ui/form'

// ! Follow BlogPayload model in models/blog.ts
const formSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  thumbnail_image: z.string().url(),
  cover_image: z.string().url(),
})

type FormValue = z.infer<typeof formSchema>

interface EditBlogFormProps {
  data: Blog | null
  onSuccess?: () => void
}

export function EditBlogForm({ data, onSuccess }: EditBlogFormProps) {
  const isEdit = !!data
  const defaultValue = {
    title: '',
    content: '',
    thumbnail_image: 'https://placehold.co/600x400?text=example',
    cover_image: 'https://placehold.co/600x400?text=example',
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: data.title,
          content: data.content,
          thumbnail_image: data.thumbnail_image,
          cover_image: data.cover_image,
        }
      : defaultValue,
  })

  const exerciseMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateBlog(data.id, values) : createBlog(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật bài viết thành công' : 'Tạo bài viết thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    exerciseMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="title" label="Tên bài viết" withAsterisk placeholder="Nhập tên bài viết" />
        <FormRichTextField form={form} name="content" label="Nội dung" placeholder="Nhập nội dung" />
        <div className="grid grid-cols-2 gap-4">
          <ImageUploader
            form={form}
            name="thumbnail_image"
            label="Hình ảnh đại diện"
            accept={{ 'image/*': [] }}
            maxFileCount={1}
          />
          <ImageUploader
            form={form}
            name="cover_image"
            label="Hình ảnh bìa"
            accept={{ 'image/*': [] }}
            maxFileCount={1}
          />
        </div>
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={exerciseMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
