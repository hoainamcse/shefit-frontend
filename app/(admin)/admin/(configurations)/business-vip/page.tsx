'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'

import { getConfiguration, queryKeyConfigurations, updateConfiguration } from '@/network/client/configurations'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MainButton } from '@/components/buttons/main-button'
import { FormImageSelectField, FormRichTextField } from '@/components/forms/fields'
import { Configuration } from '@/models/configuration'
import { Spinner } from '@/components/spinner'
import { Form } from '@/components/ui/form'

const configurationID = 4

export default function BusinessVipPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyConfigurations, configurationID],
    queryFn: () => getConfiguration(configurationID),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    )
  }

  return (
    <ContentLayout title="Business & VIP">
      <EditAboutUsForm data={data?.data} onSuccess={refetch} />
    </ContentLayout>
  )
}

// ! Follow ConfigurationPayload model in models/configuration.ts
const formSchema = z.object({
  type: z.enum(['about_us', 'policy', 'homepage']),
  data: z.object({
    thumbnail_image: z.string().url(),
    description: z.string().min(1),
  }),
})

type FormValue = z.infer<typeof formSchema>

interface EditAboutUsFormProps {
  data?: Configuration
  onSuccess?: () => void
}

function EditAboutUsForm({ data, onSuccess }: EditAboutUsFormProps) {
  if (!data) {
    return <p className="text-destructive">Không tìm thấy dữ liệu</p>
  }

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: data.type,
      data: data.data,
    },
  })

  const configurationMutation = useMutation({
    mutationFn: (values: FormValue) => updateConfiguration(data.id, values),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success('Cập nhật thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    configurationMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormImageSelectField control={form.control} name="data.thumbnail_image" label="Hình ảnh" />
        <FormRichTextField
          form={form}
          name="data.description"
          label="Nội dung"
          placeholder="Nhập nội dung"
          withAsterisk
        />
        <div className="flex justify-end">
          {form.formState.isDirty && <MainButton text="Cập nhật" loading={configurationMutation.isPending} />}
        </div>
      </form>
    </Form>
  )
}
