'use client'

import type { Blog } from '@/models/blog'
import type { Topic } from '@/models/topic'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createBlog, updateBlog } from '@/network/client/blogs'

import { FormImageSelectField, FormInputField, FormMultiSelectField, FormRichTextField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'
import { useRouter } from 'next/navigation'

// ! Follow BlogPayload model in models/blog.ts
const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề bài viết không được để trống'),
  content: z.string(),
  thumbnail_image: z.string().url(),
  cover_image: z.string().url(),
  topic_ids: z.array(z.string()),
})

type FormValue = z.infer<typeof formSchema>

interface EditBlogFormProps {
  data?: Blog
  topics: Topic[]
}

export function EditBlogForm({ data, topics }: EditBlogFormProps) {
  const router = useRouter()
  const isEdit = !!data
  const defaultValue = {
    title: '',
    content: '',
    thumbnail_image: 'https://placehold.co/400?text=shefit.vn&font=Oswald',
    cover_image: 'https://placehold.co/400?text=shefit.vn&font=Oswald',
    topic_ids: [],
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: data.title,
          content: data.content,
          thumbnail_image: data.thumbnail_image,
          cover_image: data.cover_image,
          topic_ids: data.topics.map((t) => t.id.toString()),
        }
      : defaultValue,
  })

  const blogMutation = useMutation({
    mutationFn: (values: any) => (isEdit ? updateBlog(data.id, values) : createBlog(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật bài viết thành công' : 'Tạo bài viết thành công')
        router.push(`/admin/blogs`)
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    blogMutation.mutate({ ...values, topic_ids: values.topic_ids.map((id) => Number(id)) })
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="title" label="Tên bài viết" withAsterisk placeholder="Nhập tên bài viết" />
        <FormRichTextField form={form} name="content" label="Nội dung" placeholder="Nhập nội dung" />
        <div className="grid grid-cols-2 gap-4">
          <FormImageSelectField control={form.control} name="thumbnail_image" label="Hình ảnh đại diện" />
          <FormImageSelectField control={form.control} name="cover_image" label="Hình ảnh bìa" />
        </div>
        <FormMultiSelectField
          form={form}
          name="topic_ids"
          label="Chủ đề"
          placeholder="Chọn chủ đề"
          data={topics.map((t) => ({
            value: t.id.toString(),
            label: t.name,
          }))}
        />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={blogMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
