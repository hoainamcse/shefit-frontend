'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { FileUploader } from '@/components/file-uploader'
import { RichTextEditor } from '@/components/forms/fields/rich-text-editor'
import { useAuth } from '@/components/providers/auth-context'
import { ImageUploader } from '@/components/image-uploader'

import { Form } from '@/components/ui/form'
import { Configuration } from '@/models/configuration'
import { getConfiguration, updateConfiguration } from '@/network/server/configurations'
import { getS3FileUrl, uploadImageApi } from '@/network/server/upload'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const AboutUsSchema = z.object({
  'thumbnail image': z.string().url({ message: 'Please enter a valid URL for the image, or leave it empty.' }),
  description: z.string().min(1, 'Description is required'),
})

type AboutUsFormValues = z.infer<typeof AboutUsSchema>

const aboutUsID = 1

export default function AboutUsPage() {
  const { accessToken } = useAuth()
  const [aboutUsData, setAboutUsData] = useState<Configuration>()

  const form = useForm<AboutUsFormValues>({
    resolver: zodResolver(AboutUsSchema),
    defaultValues: aboutUsData?.data || {
      'thumbnail image': '',
      description: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getConfiguration(aboutUsID)
        if (!result?.data) {
          throw new Error('About Us data not found')
        }
        setAboutUsData(result.data)
        form.reset(result.data.data)
      } catch (error) {
        console.error('Error fetching about us data:', error)
      }
    }

    fetchData()
  }, [])

  async function updateAboutUs(id: number, values: AboutUsFormValues) {
    if (!aboutUsData?.data) {
      throw new Error('About Us data not found')
    }

    const updateData: Configuration = {
      ...aboutUsData,
      data: values,
    }
    const res = await updateConfiguration(Number(id), updateData)
    return res
  }

  async function onSubmit(values: AboutUsFormValues) {
    try {
      if (!aboutUsData?.id) {
        throw new Error('About Us ID not found')
      }
      await updateAboutUs(aboutUsData?.id, values)
      toast.success('Đã cập nhật thành công!')
    } catch (error) {
      toast.error('Failed to create dish')
    }
  }

  console.log('form.getValues()', form.getValues())

  return (
    <ContentLayout title="About Us">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <ImageUploader form={form} name="thumbnail image" accept={{ 'image/*': [] }} maxFileCount={1} />
            <RichTextEditor form={form} name="description" label="Về Shefit" withAsterisk placeholder="Nhập nội dung" />
            <MainButton text="Lưu" type="submit" className="mt-6" />
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
