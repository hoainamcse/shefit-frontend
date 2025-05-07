'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { FileUploader } from '@/components/file-uploader'
import { RichTextEditor } from '@/components/forms/fields/rich-text-editor'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  image: z.instanceof(File).optional(),
  content: z.string().min(1, 'Content is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function AboutUsPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      content: '',
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      // TODO: Implement your API call here
      console.log(values)
      toast.success('Dish created successfully!')
    } catch (error) {
      toast.error('Failed to create dish')
    }
  }
  return (
    <ContentLayout title="About Us">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FileUploader />
          <RichTextEditor form={form} name="content" label="Về Shefit" withAsterisk placeholder="Nhập nội dung" />
          <MainButton text="Lưu" type="submit" />
        </form>
      </Form>
    </ContentLayout>
  )
}
