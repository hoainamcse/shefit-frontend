'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { FormImageInputField } from '@/components/forms/fields/form-image-input-field'
import { RichTextEditor } from '@/components/forms/fields/rich-text-editor'

import { Form } from '@/components/ui/form'
import { ConfigurationItem, ConfigurationsResponse } from '@/models/configurations'
import { getConfigurations, updateConfigurations } from '@/network/server/configuarations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  'thumbnail image': z.string().url('Please enter a valid URL'),
  description: z.string().min(1, 'Description is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function AboutUsPage() {
  const [aboutUsData, setAboutUsData] = useState<ConfigurationItem>()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: aboutUsData?.data || {
      'thumbnail image': '',
      description: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getConfigurations('about_us')
        if (!result?.data[0]) {
          throw new Error('About Us data not found')
        }
        setAboutUsData(result.data[0])
        form.reset(result.data[0].data)
      } catch (error) {
        console.error('Error fetching about us data:', error)
        // Optionally handle the error state here
      }
    }

    fetchData()
  }, [])

  async function updateAboutUs(id: string, values: FormValues) {
    if (!aboutUsData?.data) {
      throw new Error('About Us data not found')
    }
    const updateData: ConfigurationItem = {
      ...aboutUsData,
      data: values,
    }
    const res = await updateConfigurations(id, updateData)
    return res
  }

  async function onSubmit(values: FormValues) {
    try {
      if (!aboutUsData?.id) {
        throw new Error('About Us ID not found')
      }
      await updateAboutUs(aboutUsData?.id.toString(), values)
      toast.success('Đã cập nhật thành công!')
    } catch (error) {
      toast.error('Failed to create dish')
    }
  }
  return (
    <ContentLayout title="About Us">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormImageInputField form={form} name="thumbnail image" label="Ảnh đại diện" />
            <RichTextEditor form={form} name="description" label="Về Shefit" withAsterisk placeholder="Nhập nội dung" />
            <MainButton text="Lưu" type="submit" className="mt-6" />
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
