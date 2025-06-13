'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { FileUploader } from '@/components/file-uploader'
import { FormRichTextField } from '@/components/forms/fields'
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

const PolicySchema = z.object({
  privacy_policy: z.string().min(1, 'Privacy policy is required'),
  personal_policy: z.string().min(1, 'Personal policy is required'),
})

type PolicyFormValues = z.infer<typeof PolicySchema>

const policyID = 2

export default function PolicyPage() {
  const [policyData, setPolicyData] = useState<Configuration>()

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(PolicySchema),
    defaultValues: policyData?.data || {
      privacy_policy: '',
      personal_policy: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getConfiguration(policyID)
        if (!result?.data) {
          throw new Error('Policy data not found')
        }
        setPolicyData(result.data)
        form.reset(result.data.data)
      } catch (error) {
        console.error('Error fetching about us data:', error)
      }
    }

    fetchData()
  }, [])

  async function updatePolicy(id: number, values: PolicyFormValues) {
    if (!policyData?.data) {
      throw new Error('Policy data not found')
    }

    const updateData: Configuration = {
      ...policyData,
      data: values,
    }
    const res = await updateConfiguration(Number(id), updateData)
    return res
  }

  async function onSubmit(values: PolicyFormValues) {
    try {
      if (!policyData?.id) {
        throw new Error('Policy ID not found')
      }
      await updatePolicy(policyData?.id, values)
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
            <FormRichTextField
              form={form}
              name="privacy_policy"
              label="Chính sách bảo mật"
              withAsterisk
              placeholder="Nhập nội dung"
            />

            <FormRichTextField
              form={form}
              name="personal_policy"
              label="Chính sách bảo vệ thông tin cá nhân khách hàng"
              withAsterisk
              placeholder="Nhập nội dung"
            />
            <MainButton text="Lưu" type="submit" className="mt-6" />
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
