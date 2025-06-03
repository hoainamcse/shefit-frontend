'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { FileUploader } from '@/components/file-uploader'
import { RichTextEditor } from '@/components/forms/fields/rich-text-editor'

import { Form } from '@/components/ui/form'
import { Configuration } from '@/models/configuration'
import { getConfiguration, updateConfiguration } from '@/network/server/configurations'
import { getPresignedUrl, uploadFileToS3 } from '@/network/server/upload'
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

const aboutUsID = 1

export default function AboutUsPage() {
  const [aboutUsData, setAboutUsData] = useState<Configuration>()

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
        const result = await getConfiguration(aboutUsID)
        if (!result?.data) {
          throw new Error('About Us data not found')
        }
        setAboutUsData(result.data)
        form.reset(result.data.data)
      } catch (error) {
        console.error('Error fetching about us data:', error)
        // Optionally handle the error state here
      }
    }

    fetchData()
  }, [])

  async function updateAboutUs(id: number, values: FormValues) {
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

  async function onSubmit(values: FormValues) {
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

  async function handleFileUpload(files: File[]) {
    const file = files[0]
    console.log('file', file)
    if (!file) return
    const response = await getPresignedUrl(file.name, file.type)
    console.log('response', response)
    const res = await uploadFileToS3(response.upload_url, file)
    console.log('res', res)
    form.setValue('thumbnail image', response.file_url)
  }

  return (
    <ContentLayout title="About Us">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FileUploader onUpload={handleFileUpload} accept={{ 'image/*': [] }} maxFileCount={1} />
            <RichTextEditor form={form} name="description" label="Về Shefit" withAsterisk placeholder="Nhập nội dung" />
            <MainButton text="Lưu" type="submit" className="mt-6" />
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
