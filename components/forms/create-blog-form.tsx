'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTransition } from 'react'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUploader } from '@/components/file-uploader'
import { toast } from 'sonner'
import { MainButton } from '@/components/buttons/main-button'

// Define the Blog interface
export interface Blog {
  id?: string
  title: string
  content: string
  image?: string | File[] 
  createdAt?: Date
  updatedAt?: Date
}

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  content: z.string().min(100, {
    message: 'Content must be at least 100 characters.',
  }),
  image: z.array(z.instanceof(File)).optional(),
})

type FormValues = z.infer<typeof formSchema>

type BlogFormProps = {
  typeForm: 'create' | 'edit' | 'view'
  data?: Blog
  onSuccess?: () => void
}

export function CreateBlogForm({ typeForm, data, onSuccess }: BlogFormProps) {
  const [isPending, startTransition] = useTransition()
  
  // Convert the image URL to File[] if in edit mode and data exists
  const initialValues: Partial<FormValues> = {
    title: data?.title || '',
    content: data?.content || '',
    image: Array.isArray(data?.image) ? data.image : [],
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  // Determine if the form should be read-only
  const isReadOnly = typeForm === 'view'

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        // For demonstration purposes, just log the values
        console.log(values)
        
        if (typeForm === 'create') {
          // TODO: Implement API call to create blog
          toast.success('Blog created successfully!')
        } else if (typeForm === 'edit') {
          // TODO: Implement API call to update blog
          toast.success('Blog updated successfully!')
        }
        
        onSuccess?.()
      } catch (error) {
        toast.error(`Failed to ${typeForm === 'create' ? 'create' : 'update'} blog`)
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
                <Input 
                  placeholder="Nhập tiêu đề bài viết" 
                  {...field} 
                  disabled={isReadOnly || isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung bài viết"
                  className="min-h-[300px]"
                  {...field}
                  disabled={isReadOnly || isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />    

        {(!isReadOnly || data?.image) && (
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  {isReadOnly && typeof data?.image === 'string' ? (
                    <div className="relative w-full h-48 overflow-hidden rounded-md">
                      <img 
                        src={data.image} 
                        alt={data.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFileCount={1}
                      accept={{
                        'image/*': [],
                      }}
                      disabled={isReadOnly || isPending}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  {!isReadOnly && 'Tải lên hình ảnh minh họa cho bài viết'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {!isReadOnly && (
          <MainButton 
            text={typeForm === 'create' ? 'Tạo bài viết' : 'Cập nhật bài viết'} 
            type="submit" 
            disabled={isPending}
          />
        )}
      </form>
    </Form>
  )
}