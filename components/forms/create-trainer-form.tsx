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

export interface Trainer {
  id?: string
  name: string
  quote: string
  image?: string | File[]
  specialty: string
}

const trainerSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  quote: z.string().min(100, {
    message: 'Quote must be at least 100 characters.',
  }),
  image: z.array(z.instanceof(File)).length(1, { message: 'Must upload exactly 1 image.' }),
  specialty: z.string().min(2, {
    message: 'Specialty must be at least 2 characters.',
  }),
})

type FormValues = z.infer<typeof trainerSchema>

type TrainerFormProps = {
  isEdit: boolean
  data?: Trainer
}

export function CreateTrainerForm({ isEdit, data }: TrainerFormProps) {
  const [isPending, startTransition] = useTransition()

  // Convert the image URL to File[] if in edit mode and data exists
  const initialValues: Partial<FormValues> = {
    name: data?.name || '',
    quote: data?.quote || '',
    image: Array.isArray(data?.image) ? data.image : [],
    specialty: data?.specialty || '',
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(trainerSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        // For demonstration purposes, just log the values
        console.log(values)

        if (!isEdit) {
          // TODO: Implement API call to create blog
          toast.success('Blog created successfully!')
        } else {
          // TODO: Implement API call to update blog
          toast.success('Blog updated successfully!')
        }
      } catch (error) {
        toast.error(`Failed to ${!isEdit ? 'create' : 'update'} blog`)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên huấn luyện viên" />
        <FormTextareaField form={form} name="quote" label="Quote" required placeholder="Nhập quote" />
        <FormInputField form={form} name="specialty" label="Chuyên môn" required placeholder="Nhập chuyên môn" />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  maxFileCount={1}
                  accept={{
                    'image/*': [],
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Tải lên hình ảnh minh họa cho bài viết</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <MainButton text={!isEdit ? 'Tạo mới' : 'Lưu'} type="submit" disabled={isPending} />
      </form>
    </Form>
  )
}
