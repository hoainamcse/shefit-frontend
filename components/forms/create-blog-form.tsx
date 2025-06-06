'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTransition } from 'react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { MainButton } from '@/components/buttons/main-button'
import { Blog } from '@/models/blog'
import { createBlog, updateBlog } from '@/network/server/blog'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from './fields/rich-text-editor'
import { ImageUploader } from '../image-uploader'

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  content: z.string().min(100, {
    message: 'Content must be at least 100 characters.',
  }),
  cover_image: z.string().optional(),
  thumbnail_image: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type BlogFormProps = {
  isEdit: boolean
  data?: Blog
}

export function CreateBlogForm({ isEdit, data }: BlogFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const initialValues: Partial<FormValues> = {
    title: '',
    content: '',
    cover_image: '',
    thumbnail_image: '',
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || initialValues,
  })

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (!isEdit) {
          const blogResult = await createBlog(values)
          if (blogResult.status === 'success') {
            toast.success('Tạo bài viết thành công')
            router.push('/admin/blog')
          }
        } else {
          if (data?.id) {
            const blogResult = await updateBlog(data.id.toString(), values)
            if (blogResult.status === 'success') {
              toast.success('Cập nhật bài viết thành công')
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề bài viết" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <RichTextEditor form={form} name="content" label="Nội dung" withAsterisk placeholder="Nhập nội dung" />

        <ImageUploader form={form} name="cover_image" label="Hình ảnh" accept={{ 'image/*': [] }} maxFileCount={1} />

        <MainButton text={!isEdit ? 'Tạo bài viết' : 'Cập nhật bài viết'} type="submit" loading={isPending} />
      </form>
    </Form>
  )
}
