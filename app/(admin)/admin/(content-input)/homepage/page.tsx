'use client'

import type { Configuration } from '@/models/configuration'
import type { MealPlan } from '@/models/meal-plan'
import type { Product } from '@/models/product'
import type { Coach } from '@/models/coach'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PanelsTopLeftIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'

import { getConfiguration, queryKeyConfigurations, updateConfiguration } from '@/network/client/configurations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormInputField, FormTextareaField } from '@/components/forms/fields'
import { MealPlansTable } from '@/components/data-table/meal-plans-table'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ProductsTable } from '@/components/data-table/products-table'
import { CoachesTable } from '@/components/data-table/coaches-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { EditDialog } from '@/components/data-table/edit-dialog'
import { MainButton } from '@/components/buttons/main-button'
import { ImageUploader } from '@/components/image-uploader'
import { Spinner } from '@/components/spinner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'

import { formSchema as homepageSchema } from './schema'
import { Subscription } from '@/models/subscription'
import { SubscriptionsTable } from '@/components/data-table/subscriptions-table'

const configurationID = 3

export default function HomepagePage() {
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
    <ContentLayout title="Trang chủ">
      <EditHomepageForm data={data?.data} onSuccess={refetch} />
    </ContentLayout>
  )
}

const labels = [
  'Phần nổi bật',
  'Khoá tập tiêu biểu',
  'Gói tập',
  'CTA',
  'Phom dáng',
  'Thực đơn',
  'Sản phẩm',
  'Huấn luyện viên',
  'Câu hỏi thường gặp',
  'Liên hệ',
]

// ! Follow ConfigurationPayload model in models/configuration.ts
const formSchema = z.object({
  type: z.enum(['about_us', 'policy', 'homepage']),
  data: homepageSchema,
})

type FormValue = z.infer<typeof formSchema>

interface EditHomepageFormProps {
  data?: Configuration
  onSuccess?: () => void
}

function EditHomepageForm({ data, onSuccess }: EditHomepageFormProps) {
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

  const [openSubscriptionsTable, setOpenSubscriptionsTable] = useState(false)
  const [openMealPlansTable, setOpenMealPlansTable] = useState(false)
  const [openProductsTable, setOpenProductsTable] = useState(false)
  const [openCoachesTable, setOpenCoachesTable] = useState(false)
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Subscription[]>(
    data.data.section_3.subscriptions || []
  )
  const [selectedMealPlans, setSelectedMealPlans] = useState<MealPlan[]>(data.data.section_7.meal_plans || [])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(data.data.section_8.products || [])
  const [selectedCoaches, setSelectedCoaches] = useState<Coach[]>(data.data.section_9.coaches || [])

  return (
    <>
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
            {labels.map((label, index) => (
              <TabsTrigger
                key={index}
                value={`tab-${index + 1}`}
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
              >
                <PanelsTopLeftIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="tab-1" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInputField form={form} name="data.section_1.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
                <FormInputField
                  form={form}
                  name="data.section_1.features.0"
                  label="Tiêu biểu 1"
                  placeholder="Nhập tiêu biểu"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                  form={form}
                  name="data.section_1.features.1"
                  label="Tiêu biểu 2"
                  placeholder="Nhập tiêu biểu"
                />
                <FormInputField
                  form={form}
                  name="data.section_1.features.2"
                  label="Tiêu biểu 3"
                  placeholder="Nhập tiêu biểu"
                />
              </div>
              <FormTextareaField form={form} name="data.section_1.description" label="Mô tả" placeholder="Nhập mô tả" />
              <ImageUploader form={form} name="data.section_1.image" label="Hình ảnh" />
              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                  form={form}
                  name="data.section_1.cta.text"
                  label="Nút CTA"
                  placeholder="Nhập văn bản nút"
                />
                <FormInputField
                  form={form}
                  name="data.section_1.cta.href"
                  label="Liên kết CTA"
                  placeholder="Nhập liên kết"
                />
              </div>
            </TabsContent>
            <TabsContent value="tab-2" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInputField form={form} name="data.section_2.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
                <FormInputField form={form} name="data.section_2.subtitle" label="Phụ đề" placeholder="Nhập phụ đề" />
              </div>
              <FormTextareaField form={form} name="data.section_2.description" label="Mô tả" placeholder="Nhập mô tả" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormInputField
                    form={form}
                    name="data.section_2.features.0.title"
                    label="Tiêu đề tiêu biểu 1"
                    placeholder="Nhập tiêu đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="data.section_2.features.0.description"
                    label="Mô tả tiêu biểu 1"
                    placeholder="Nhập mô tả"
                  />
                </div>
                <div className="space-y-4">
                  <FormInputField
                    form={form}
                    name="data.section_2.features.1.title"
                    label="Tiêu đề tiêu biểu 2"
                    placeholder="Nhập tiêu đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="data.section_2.features.1.description"
                    label="Mô tả tiêu biểu 2"
                    placeholder="Nhập mô tả"
                  />
                </div>
                <div className="space-y-4">
                  <FormInputField
                    form={form}
                    name="data.section_2.features.2.title"
                    label="Tiêu đề tiêu biểu 3"
                    placeholder="Nhập tiêu đề"
                  />
                  <FormTextareaField
                    form={form}
                    name="data.section_2.features.2.description"
                    label="Mô tả tiêu biểu 3"
                    placeholder="Nhập mô tả"
                  />
                </div>
              </div>
              <ImageUploader form={form} name="data.section_2.image" label="Hình ảnh" />
              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                  form={form}
                  name="data.section_2.cta.text"
                  label="Nút CTA"
                  placeholder="Nhập văn bản nút"
                />
                <FormInputField
                  form={form}
                  name="data.section_2.cta.href"
                  label="Liên kết CTA"
                  placeholder="Nhập liên kết"
                />
              </div>
            </TabsContent>
            <TabsContent value="tab-3" className="space-y-4">
              <FormInputField form={form} name="data.section_3.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
              <FormTextareaField form={form} name="data.section_3.description" label="Mô tả" placeholder="Nhập mô tả" />
              <div className="space-y-2">
                <Label>Gói tập</Label>
                <Input
                  value={selectedSubscriptions.map((c) => c.name).join(', ')}
                  onFocus={() => setOpenSubscriptionsTable(true)}
                  placeholder="Chọn gói tập"
                  readOnly
                />
              </div>
            </TabsContent>
            <TabsContent value="tab-4" className="space-y-4">
              <FormInputField form={form} name="data.section_4.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
              <FormTextareaField form={form} name="data.section_4.description" label="Mô tả" placeholder="Nhập mô tả" />
              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                  form={form}
                  name="data.section_4.cta.text"
                  label="Nút CTA"
                  placeholder="Nhập văn bản nút"
                />
                <FormInputField
                  form={form}
                  name="data.section_4.cta.href"
                  label="Liên kết CTA"
                  placeholder="Nhập liên kết"
                />
              </div>
            </TabsContent>
            <TabsContent value="tab-5" className="space-y-4">
              <FormInputField form={form} name="data.section_5.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
              <FormTextareaField form={form} name="data.section_5.description" label="Mô tả" placeholder="Nhập mô tả" />
            </TabsContent>
            <TabsContent value="tab-6" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInputField form={form} name="data.section_7.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
                <FormInputField form={form} name="data.section_7.subtitle" label="Phụ đề" placeholder="Nhập phụ đề" />
              </div>
              <div className="space-y-2">
                <Label>Thực đơn</Label>
                <Input
                  value={selectedMealPlans.map((ml) => ml.title).join(', ')}
                  onFocus={() => setOpenMealPlansTable(true)}
                  placeholder="Chọn thực đơn"
                  readOnly
                />
              </div>
            </TabsContent>
            <TabsContent value="tab-7" className="space-y-4">
              <FormInputField form={form} name="data.section_8.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
              <FormTextareaField form={form} name="data.section_8.description" label="Mô tả" placeholder="Nhập mô tả" />
              <div className="space-y-2">
                <Label>Sản phẩm</Label>
                <Input
                  value={selectedProducts.map((p) => p.name).join(', ')}
                  onFocus={() => setOpenProductsTable(true)}
                  placeholder="Chọn sản phẩm"
                  readOnly
                />
              </div>
            </TabsContent>
            <TabsContent value="tab-8" className="space-y-4">
              <div className="space-y-2">
                <Label>Huấn luyện viên</Label>
                <Input
                  value={selectedCoaches.map((c) => c.name).join(', ')}
                  onFocus={() => setOpenCoachesTable(true)}
                  placeholder="Chọn huấn luyện viên"
                  readOnly
                />
              </div>
            </TabsContent>
            <TabsContent value="tab-9" className="space-y-4">
              <FormInputField
                form={form}
                name="data.section_10.top.title"
                label="Tiêu đề trên"
                placeholder="Nhập tiêu đề"
              />
              <FormTextareaField
                form={form}
                name="data.section_10.top.description"
                label="Mô tả trên"
                placeholder="Nhập mô tả"
              />
              <ImageUploader form={form} name="data.section_10.top.image" label="Hình ảnh trên" />
              <FormInputField
                form={form}
                name="data.section_10.bottom.title"
                label="Tiêu đề dưới"
                placeholder="Nhập tiêu đề"
              />
              <FormTextareaField
                form={form}
                name="data.section_10.bottom.description"
                label="Mô tả dưới"
                placeholder="Nhập mô tả"
              />
              <ImageUploader form={form} name="data.section_10.bottom.image" label="Hình ảnh dưới" />
            </TabsContent>
            <TabsContent value="tab-10" className="space-y-4">
              <ImageUploader form={form} name="data.section_11.image" label="Hình ảnh" />
              <FormTextareaField
                form={form}
                name="data.section_11.description"
                label="Mô tả"
                placeholder="Nhập mô tả"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                  form={form}
                  name="data.section_11.cta.text"
                  label="Nút CTA"
                  placeholder="Nhập văn bản nút"
                />
                <FormInputField
                  form={form}
                  name="data.section_11.cta.href"
                  label="Liên kết CTA"
                  placeholder="Nhập liên kết"
                />
              </div>
            </TabsContent>
            <div className="flex justify-end">
              {form.formState.isDirty && <MainButton text="Cập nhật" loading={configurationMutation.isPending} />}
            </div>
          </form>
        </Form>
      </Tabs>
      <EditDialog
        title="Chọn Gói tập"
        description="Chọn một hoặc nhiều gói tập đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openSubscriptionsTable}
        onOpenChange={setOpenSubscriptionsTable}
      >
        <SubscriptionsTable
          onConfirmRowSelection={(row) => {
            setSelectedSubscriptions(row)
            form.setValue('data.section_3.subscriptions', row, { shouldDirty: true })
            form.trigger('data.section_3.subscriptions')
            setOpenSubscriptionsTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Thực đơn"
        description="Chọn một hoặc nhiều thực đơn đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openMealPlansTable}
        onOpenChange={setOpenMealPlansTable}
      >
        <MealPlansTable
          onConfirmRowSelection={(row) => {
            setSelectedMealPlans(row)
            form.setValue('data.section_7.meal_plans', row, { shouldDirty: true })
            form.trigger('data.section_7.meal_plans')
            setOpenMealPlansTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Sản phẩm"
        description="Chọn một hoặc nhiều sản phẩm đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openProductsTable}
        onOpenChange={setOpenProductsTable}
      >
        <ProductsTable
          onConfirmRowSelection={(row) => {
            setSelectedProducts(row)
            form.setValue('data.section_8.products', row, { shouldDirty: true })
            form.trigger('data.section_8.products')
            setOpenProductsTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn HLV"
        description="Chọn một hoặc nhiều HLV đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openCoachesTable}
        onOpenChange={setOpenCoachesTable}
      >
        <CoachesTable
          onConfirmRowSelection={(row) => {
            setSelectedCoaches(row)
            form.setValue('data.section_9.coaches', row, { shouldDirty: true })
            form.trigger('data.section_9.coaches')
            setOpenCoachesTable(false)
          }}
        />
      </EditDialog>
    </>
  )
}
