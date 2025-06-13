'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Form } from '@/components/ui/form'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { MainButton } from '@/components/buttons/main-button'
import { Button } from '@/components/ui/button'
import { FormInputField, FormMultiSelectField, FormTextareaField } from '@/components/forms/fields'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getConfiguration, updateConfiguration } from '@/network/server/configurations'
import { toast } from 'sonner'
import { formSchema } from './schema'
import { Configuration } from '@/models/configuration'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { BoxIcon, Plus, Trash2 } from 'lucide-react'
import { ImageUploader } from '@/components/image-uploader'

const homepageID = 3

export default function HomepagePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage-configuration', homepageID],
    queryFn: () => getConfiguration(homepageID),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading homepage configuration: {error.message}</div>
  }

  if (!data || !data.data) {
    return <div>No configuration data found</div>
  }

  return <HomepageForm defaultData={data.data.data} />
}

const data = [
  { value: 'section_1', label: 'Hero' },
  { value: 'section_2', label: 'Section 2' },
  { value: 'section_3', label: 'Membership' },
  { value: 'section_4', label: 'CTA' },
  { value: 'section_5', label: 'Body Type' },
  { value: 'section_7', label: 'Thực đơn' },
  { value: 'section_8', label: 'Sản phẩm' },
  { value: 'section_9', label: 'HLV' },
  { value: 'section_10', label: 'FAQ' },
  { value: 'section_11', label: 'Contact' },
]

function HomepageForm({ defaultData }: { defaultData: Configuration['data'] }) {
  const [bodyTypeActiveTabIndex, setBodyTypeActiveTabIndex] = useState(0)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultData,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (body: any) => updateConfiguration(homepageID, body),
    onSuccess: () => {
      toast.success('Configuration updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update configuration: ${error.message}`)
    },
  })

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    mutate({ type: 'homepage', data: values })
  }

  return (
    <ContentLayout
      title="Homepage Content"
      rightSection={<MainButton text="Lưu thay đổi" loading={isPending} type="submit" form="hook-form" />}
    >
      <Form {...form}>
        <form id="hook-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 col-span-3">
          <Tabs defaultValue="section_1">
            <ScrollArea>
              <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
                {data.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
                  >
                    <BoxIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Section 1 */}
            <TabsContent value="section_1">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Hero</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần Hero</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField form={form} name="section_1.title" label="Tiêu đề" />
                  {form.watch('section_1.features')?.map((_, index) => (
                    <FormInputField
                      key={index}
                      form={form}
                      name={`section_1.features.${index}`}
                      label={`Feature ${index + 1}`}
                    />
                  ))}
                  <FormTextareaField form={form} name="section_1.description" label="Mô tả" rows={4} />
                  <ImageUploader
                    form={form}
                    name="section_1.image"
                    label="Image"
                    accept={{ 'image/*': [] }}
                    maxFileCount={1}
                  />
                  <FormInputField form={form} name="section_1.cta.text" label="CTA Button Text" />
                  <FormInputField form={form} name="section_1.cta.href" label="CTA Button URL" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 2 */}
            <TabsContent value="section_2">
              <Card>
                <CardHeader>
                  <CardTitle>Tone Body Section</CardTitle>
                  <CardDescription>Edit the Tone Body section content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField form={form} name="section_2.title" label="Tiêu đề" />
                  <FormInputField form={form} name="section_2.subtitle" label="Phụ đề" />
                  <FormTextareaField form={form} name="section_2.description" label="Mô tả" rows={4} />
                  {form.watch('section_2.features')?.map((_, index) => (
                    <Card key={index} className="p-4 space-y-4">
                      <FormInputField
                        form={form}
                        name={`section_2.features.${index}.title`}
                        label={`Feature ${index + 1} Tiêu đề`}
                      />
                      <FormTextareaField
                        form={form}
                        name={`section_2.features.${index}.description`}
                        label={`Feature ${index + 1} Mô tả`}
                        rows={4}
                      />
                    </Card>
                  ))}
                  <ImageUploader
                    form={form}
                    name="section_2.image"
                    label="Image"
                    accept={{ 'image/*': [] }}
                    maxFileCount={1}
                    maxSize={1024 * 1024 * 20} // 20MB
                  />
                  <FormInputField form={form} name="section_2.cta.text" label="CTA Button Text" />
                  <FormInputField form={form} name="section_2.cta.href" label="CTA Button URL" className="mb-4" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 3 */}
            <TabsContent value="section_3">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Membership</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần Membership</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField form={form} name="section_3.title" label="Tiêu đề" />
                  <FormTextareaField form={form} name="section_3.description" label="Mô tả" rows={4} />
                  <FormMultiSelectField
                    form={form}
                    data={[]}
                    name={`section_3.membership_ids`}
                    label={`Membership IDs`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 4 */}
            <TabsContent value="section_4">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: CTA</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần CTA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField form={form} name="section_4.title" label="Tiêu đề" />
                  <FormTextareaField form={form} name="section_4.description" label="Mô tả" rows={4} />
                  <FormInputField form={form} name="section_4.cta.text" label="CTA Button Text" />
                  <FormInputField form={form} name="section_4.cta.href" label="CTA Button URL" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 5 */}
            <TabsContent value="section_5">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Dáng</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần Dáng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField form={form} name="section_5.title" label="Tiêu đề" />
                  <FormTextareaField form={form} name="section_5.description" label="Mô tả" rows={4} />

                  <Tabs
                    value={bodyTypeActiveTabIndex.toString()}
                    onValueChange={(value) => setBodyTypeActiveTabIndex(Number(value))}
                    className="w-full space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="w-full overflow-x-auto pb-2">
                        <TabsList className="w-auto inline-flex h-auto p-1">
                          {form.watch('section_5.features')?.map((feature, index) => (
                            <TabsTrigger key={index} value={index.toString()} className="h-auto truncate">
                              {feature.title || `Feature ${index + 1}`}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => {
                          const currentFeatures = form.getValues('section_5.features') || []
                          const newIndex = currentFeatures.length
                          const newFeature = {
                            title: `Feature ${newIndex + 1}`,
                            description: '',
                            course_ids: [],
                          }
                          form.setValue('section_5.features', [...currentFeatures, newFeature])
                          setBodyTypeActiveTabIndex(newIndex)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm feature
                      </Button>
                    </div>

                    {form.watch('section_5.features')?.map((feature, index) => {
                      return (
                        <TabsContent key={index} value={index.toString()} className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-lg w-full">
                                  <FormInputField
                                    form={form}
                                    name={`section_5.features.${index}.title`}
                                    label="Tên"
                                    placeholder="Nhập tên"
                                    className="w-full"
                                  />
                                </CardTitle>
                                {form.watch('section_5.features')?.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const currentFeatures = form.getValues('section_5.features') || []
                                      if (currentFeatures.length > 1) {
                                        form.setValue(
                                          'section_5.features',
                                          currentFeatures.filter((_, i) => i !== index)
                                        )
                                        if (index === 0) {
                                          setBodyTypeActiveTabIndex(0)
                                        } else {
                                          setBodyTypeActiveTabIndex(index - 1)
                                        }
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormTextareaField
                                form={form}
                                name={`section_5.features.${index}.description`}
                                label="Mô tả"
                                placeholder="Nhập mô tả cho dáng người"
                                rows={4}
                              />
                              <FormMultiSelectField
                                form={form}
                                data={[]}
                                name={`section_5.features.${index}.course_ids`}
                                label="Khoá tập liên quan"
                                placeholder="Chọn khoá tập"
                              />
                            </CardContent>
                          </Card>
                        </TabsContent>
                      )
                    })}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 7 */}
            <TabsContent value="section_7">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Thực đơn</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần Thực đơn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField form={form} name="section_7.title" label="Tiêu đề" />
                  <FormInputField form={form} name="section_7.subtitle" label="Phụ đề" />
                  <FormMultiSelectField form={form} data={[]} name={`section_7.meal_plan_ids`} label={`Thực đơn IDs`} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 8 */}
            <TabsContent value="section_8">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Sản phẩm</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần Sản phẩm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInputField form={form} name="section_8.title" label="Tiêu đề" />
                  <FormTextareaField form={form} name="section_8.description" label="Mô tả" rows={4} />
                  <FormMultiSelectField form={form} data={[]} name={`section_8.product_ids`} label={`Sản phẩm IDs`} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 9 */}
            <TabsContent value="section_9">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: HLV</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần HLV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormMultiSelectField form={form} data={[]} name={`section_9.coach_ids`} label={`HLV IDs`} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 10 */}
            <TabsContent value="section_10">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: FAQ</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần FAQ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="p-4">
                    <CardTitle className="mb-4">Top FAQ</CardTitle>
                    <FormInputField form={form} name="section_10.top.title" label="Tiêu đề" />
                    <FormTextareaField form={form} name="section_10.top.description" label="Mô tả" rows={4} />
                    <ImageUploader
                      form={form}
                      name="section_10.top.image"
                      label="Image"
                      accept={{ 'image/*': [] }}
                      maxFileCount={1}
                    />
                  </Card>
                  <Card className="p-4 space-y-4">
                    <CardTitle className="mb-4">Bottom FAQ</CardTitle>
                    <FormInputField form={form} name="section_10.bottom.title" label="Tiêu đề" />
                    <FormTextareaField form={form} name="section_10.bottom.description" label="Mô tả" rows={4} />
                    <ImageUploader
                      form={form}
                      name="section_10.bottom.image"
                      label="Image"
                      accept={{ 'image/*': [] }}
                      maxFileCount={1}
                    />
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section 11 */}
            <TabsContent value="section_11">
              <Card>
                <CardHeader>
                  <CardTitle>Phần: Contact</CardTitle>
                  <CardDescription>Chỉnh sửa nội dung phần Contact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    form={form}
                    name="section_11.image"
                    label="Image"
                    accept={{ 'image/*': [] }}
                    maxFileCount={1}
                  />
                  <FormTextareaField form={form} name="section_11.description" label="Description" rows={4} />
                  <FormInputField form={form} name="section_11.cta.text" label="CTA Button Text" />
                  <FormInputField form={form} name="section_11.cta.href" label="CTA Button URL" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* <Button type="submit">Save Changes</Button> */}
        </form>
      </Form>
    </ContentLayout>
  )
}
