'use client'

import type { Configuration } from '@/models/configuration'
import type { MealPlan } from '@/models/meal-plan'
import type { Product } from '@/models/product'
import type { Coach } from '@/models/coach'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
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
import { Course } from '@/models/course'
import { CoursesTable } from '@/components/data-table/courses-table'
import { WorkoutMethod } from '@/models/workout-method'
import { WorkoutMethodsTable } from '@/components/data-table/workout-methods-table'
import { getSubscriptions, queryKeySubscriptions } from '@/network/client/subscriptions'
import { getCourses, queryKeyCourses } from '@/network/client/courses'
import { getWorkoutMethods, queryKeyWorkoutMethods } from '@/network/client/workout-methods'
import { getCoaches, queryKeyCoaches } from '@/network/client/coaches'
import { getProducts, queryKeyProducts } from '@/network/client/products'
import { getMealPlans, queryKeyMealPlans } from '@/network/client/meal-plans'
import { Skeleton } from '@/components/ui/skeleton'

const configurationID = 3

export default function HomepagePage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyConfigurations, configurationID],
    queryFn: () => getConfiguration(configurationID),
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center align-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center align-center justify-center">
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
  'Khoá tập',
  'Loại hình',
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
  const [openWorkoutMethodsTable, setOpenWorkoutMethodsTable] = useState(false)
  const [openVideoCourseTable, setOpenVideoCourseTable] = useState(false)
  const [openZoomCourseTable, setOpenZoomCourseTable] = useState(false)
  const [openDialogWorkoutMethodId, setOpenDialogWorkoutMethodId] = useState<string | null>(null)

  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Subscription[]>([] as Subscription[])
  const [selectedMealPlans, setSelectedMealPlans] = useState<MealPlan[]>([] as MealPlan[])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([] as Product[])
  const [selectedCoaches, setSelectedCoaches] = useState<Coach[]>([] as Coach[])
  const [selectedWorkoutMethods, setSelectedWorkoutMethods] = useState<WorkoutMethod[]>([] as WorkoutMethod[])
  const [selectedVideoCourses, setSelectedVideoCourses] = useState<Course[]>([] as Course[])
  const [selectedZoomCourses, setSelectedZoomCourses] = useState<Course[]>([] as Course[])

  const { data: initialSubscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: [queryKeySubscriptions],
    queryFn: () => getSubscriptions({ ids: data.data.section_3.subscription_ids.join(',') }),
    enabled: data.data.section_3.subscription_ids.length > 0,
  })

  const { data: initialVideoCourses, isLoading: isLoadingVideoCourses } = useQuery({
    queryKey: [queryKeyCourses],
    queryFn: () => getCourses({ ids: data.data.section_5.video.course_ids.join(','), course_format: 'video' }),
    enabled: data.data.section_5.video.course_ids.length > 0,
  })

  const { data: initialZoomCourses, isLoading: isLoadingZoomCourses } = useQuery({
    queryKey: [queryKeyCourses],
    queryFn: () => getCourses({ ids: data.data.section_5.zoom.course_ids.join(','), course_format: 'live' }),
    enabled: data.data.section_5.zoom.course_ids.length > 0,
  })

  const workoutMethodIds = data.data.section_6.features.map((f: any) => f.workout_method_id)

  const { data: initialWorkoutMethods, isLoading: isLoadingWorkoutMethods } = useQuery({
    queryKey: [queryKeyWorkoutMethods],
    queryFn: () => getWorkoutMethods({ ids: workoutMethodIds.join(',') }),
    enabled: workoutMethodIds.length > 0,
  })

  // Prefer user-selected workout methods; fall back to the initial ones coming from the API
  const workoutMethods = selectedWorkoutMethods.length > 0 ? selectedWorkoutMethods : initialWorkoutMethods?.data ?? []

  // Component to render tab content for a single workout method while keeping hooks outside the parent map
  const WorkoutMethodTab: React.FC<{ w: WorkoutMethod; featureIdx: number }> = ({ w, featureIdx }) => {
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([])

    // Watch the course_ids array for this workout method so we can fetch existing courses
    const courseIds: number[] = (form.watch(`data.section_6.features.${featureIdx}.course_ids`) as number[]) || []

    const { data: initialCourses, isLoading: isLoadingCourses } = useQuery({
      queryKey: [queryKeyCourses, courseIds],
      queryFn: () => getCourses({ ids: courseIds.join(',') }),
      enabled: courseIds.length > 0,
    })

    return (
      <div key={w.id}>
        <TabsContent value={`tab-${w.id}`} className="pt-4">
          <FormTextareaField
            form={form}
            name={`data.section_6.features.${featureIdx}.description`}
            label="Mô tả"
            placeholder="Nhập mô tả cho loại hình này"
          />
          <div className="space-y-2">
            <Label>Khoá tập</Label>
            {isLoadingCourses && selectedCourses.length === 0 ? (
              <Skeleton className="h-10 w-full bg-muted" />
            ) : (
              <Input
                value={
                  selectedCourses.length > 0
                    ? selectedCourses.map((c) => c.course_name).join(', ')
                    : initialCourses?.data.map((c) => c.course_name).join(', ')
                }
                onFocus={() => setOpenDialogWorkoutMethodId(w.id.toString())}
                placeholder="Chọn khoá tập"
                readOnly
              />
            )}
          </div>
        </TabsContent>

        <EditDialog
          title="Chọn Khoá tập"
          description="Chọn một hoặc nhiều khoá tập đã có hoặc tạo mới để liên kết với cấu hình này."
          open={openDialogWorkoutMethodId === w.id.toString()}
          onOpenChange={(open) => setOpenDialogWorkoutMethodId(open ? w.id.toString() : null)}
        >
          <CoursesTable
            onConfirmRowSelection={(row) => {
              setSelectedCourses(row)
              form.setValue(
                `data.section_6.features.${featureIdx}.course_ids`,
                row.map((c: any) => c.id),
                { shouldDirty: true }
              )
              form.trigger(`data.section_6.features.${featureIdx}.course_ids`)
              setOpenDialogWorkoutMethodId(null)
            }}
          />
        </EditDialog>
      </div>
    )
  }

  const { data: initialMealPlans, isLoading: isLoadingMealPlans } = useQuery({
    queryKey: [queryKeyMealPlans],
    queryFn: () => getMealPlans({ ids: data.data.section_7.meal_plan_ids.join(',') }),
    enabled: data.data.section_7.meal_plan_ids.length > 0,
  })

  const { data: initialProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: [queryKeyProducts],
    queryFn: () => getProducts({ ids: data.data.section_8.product_ids.join(',') }),
    enabled: data.data.section_8.product_ids.length > 0,
  })

  const { data: initialCoaches, isLoading: isLoadingCoaches } = useQuery({
    queryKey: [queryKeyCoaches, data.data.section_9.coach_ids],
    queryFn: () => getCoaches({ ids: data.data.section_9.coach_ids.join(',') }),
    enabled: data.data.section_9.coach_ids.length > 0,
  })

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
              <ImageUploader form={form} name="data.section_1.image_desktop" label="Hình ảnh desktop" />
              <ImageUploader form={form} name="data.section_1.image_mobile" label="Hình ảnh mobile" />
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
              <ImageUploader form={form} name="data.section_2.image_desktop" label="Hình ảnh desktop" />
              <ImageUploader form={form} name="data.section_2.image_mobile" label="Hình ảnh mobile" />
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
                {isLoadingSubscriptions && selectedSubscriptions.length === 0 ? (
                  <Skeleton className="h-10 w-full bg-muted" />
                ) : (
                  <Input
                    value={
                      selectedSubscriptions.length > 0
                        ? selectedSubscriptions.map((s) => s.name).join(', ')
                        : initialSubscriptions?.data.map((s) => s.name).join(', ')
                    }
                    onFocus={() => setOpenSubscriptionsTable(true)}
                    placeholder="Chọn gói tập"
                    readOnly
                  />
                )}
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

              <Tabs defaultValue={'video'} className="mt-4">
                <TabsList className="overflow-x-auto">
                  <TabsTrigger key={'video'} value={'video'} className="min-w-[100px]">
                    Video
                  </TabsTrigger>
                  <TabsTrigger key={'zoom'} value={'zoom'} className="min-w-[100px]">
                    Zoom
                  </TabsTrigger>
                </TabsList>

                <div key={'video'}>
                  <TabsContent value={'video'} key={'video'} className="pt-4">
                    <FormTextareaField
                      form={form}
                      name={`data.section_5.video.description`}
                      label="Mô tả"
                      placeholder="Nhập mô tả"
                    />
                    <div className="space-y-2">
                      <Label>Khoá tập</Label>
                      {isLoadingVideoCourses && selectedVideoCourses.length === 0 ? (
                        <Skeleton className="h-10 w-full bg-muted" />
                      ) : (
                        <Input
                          value={
                            selectedVideoCourses.length > 0
                              ? selectedVideoCourses.map((s) => s.course_name).join(', ')
                              : initialVideoCourses?.data.map((s) => s.course_name).join(', ')
                          }
                          onFocus={() => setOpenVideoCourseTable(true)}
                          placeholder="Chọn khoá tập"
                          readOnly
                        />
                      )}
                    </div>
                  </TabsContent>
                </div>

                <div key={'zoom'}>
                  <TabsContent value={'zoom'} key={'zoom'} className="pt-4">
                    <FormTextareaField
                      form={form}
                      name={`data.section_5.zoom.description`}
                      label="Mô tả"
                      placeholder="Nhập mô tả"
                    />
                    <div className="space-y-2">
                      <Label>Khoá tập</Label>
                      {isLoadingZoomCourses && selectedZoomCourses.length === 0 ? (
                        <Skeleton className="h-10 w-full bg-muted" />
                      ) : (
                        <Input
                          value={
                            selectedZoomCourses.length > 0
                              ? selectedZoomCourses.map((s) => s.course_name).join(', ')
                              : initialZoomCourses?.data.map((s) => s.course_name).join(', ')
                          }
                          onFocus={() => setOpenZoomCourseTable(true)}
                          placeholder="Chọn khoá tập"
                          readOnly
                        />
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </TabsContent>
            <TabsContent value="tab-6" className="space-y-4">
              <FormInputField form={form} name="data.section_6.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
              <div className="space-y-2">
                <Label>Loại hình tập luyện</Label>
                {isLoadingWorkoutMethods && selectedWorkoutMethods.length === 0 ? (
                  <Skeleton className="h-10 w-full bg-muted" />
                ) : (
                  <Input
                    value={
                      selectedWorkoutMethods.length > 0
                        ? selectedWorkoutMethods.map((s) => s.name).join(', ')
                        : initialWorkoutMethods?.data.map((s) => s.name).join(', ')
                    }
                    onFocus={() => setOpenWorkoutMethodsTable(true)}
                    placeholder="Chọn loại hình"
                    readOnly
                  />
                )}
              </div>
              {isLoadingWorkoutMethods && selectedWorkoutMethods.length === 0 ? (
                <Skeleton className="h-32 w-full bg-muted" />
              ) : (
                workoutMethods.length > 0 && (
                  <Tabs defaultValue={`tab-${workoutMethods[0]?.id ?? ''}`} className="mt-4">
                    <TabsList className="overflow-x-auto">
                      {workoutMethods.map((w) => (
                        <TabsTrigger key={w.id} value={`tab-${w.id}`} className="min-w-[100px]">
                          {w.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {workoutMethods.map((w) => {
                      const features = form.watch('data.section_6.features') || []
                      const featureIdx = features.findIndex((f: any) => f.workout_method_id === w.id)
                      return <WorkoutMethodTab key={w.id} w={w} featureIdx={featureIdx} />
                    })}
                  </Tabs>
                )
              )}
            </TabsContent>
            <TabsContent value="tab-7" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInputField form={form} name="data.section_7.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
                <FormInputField form={form} name="data.section_7.subtitle" label="Phụ đề" placeholder="Nhập phụ đề" />
              </div>
              <div className="space-y-2">
                <Label>Thực đơn</Label>
                {isLoadingMealPlans && selectedMealPlans.length === 0 ? (
                  <Skeleton className="h-10 w-full bg-muted" />
                ) : (
                  <Input
                    value={
                      selectedMealPlans.length > 0
                        ? selectedMealPlans.map((ml) => ml.title).join(', ')
                        : initialMealPlans?.data.map((ml) => ml.title).join(', ')
                    }
                    onFocus={() => setOpenMealPlansTable(true)}
                    placeholder="Chọn thực đơn"
                    readOnly
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="tab-8" className="space-y-4">
              <FormInputField form={form} name="data.section_8.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
              <FormTextareaField form={form} name="data.section_8.description" label="Mô tả" placeholder="Nhập mô tả" />
              <div className="space-y-2">
                <Label>Sản phẩm</Label>
                {isLoadingProducts && selectedProducts.length === 0 ? (
                  <Skeleton className="h-10 w-full bg-muted" />
                ) : (
                  <Input
                    value={
                      selectedProducts.length > 0
                        ? selectedProducts.map((p) => p.name).join(', ')
                        : initialProducts?.data.map((p) => p.name).join(', ')
                    }
                    onFocus={() => setOpenProductsTable(true)}
                    placeholder="Chọn sản phẩm"
                    readOnly
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="tab-9" className="space-y-4">
              <div className="space-y-2">
                <Label>Huấn luyện viên</Label>
                {isLoadingCoaches && selectedCoaches.length === 0 ? (
                  <Skeleton className="h-10 w-full bg-muted" />
                ) : (
                  <Input
                    value={
                      selectedCoaches.length > 0
                        ? selectedCoaches.map((c) => c.name).join(', ')
                        : initialCoaches?.data?.map((c) => c.name).join(', ')
                    }
                    onFocus={() => setOpenCoachesTable(true)}
                    placeholder="Chọn huấn luyện viên"
                    readOnly
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="tab-10" className="space-y-4">
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
            <TabsContent value="tab-11" className="space-y-4">
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
            form.setValue(
              'data.section_3.subscription_ids',
              row.map((s) => Number(s.id)),
              { shouldDirty: true }
            )
            form.trigger('data.section_3.subscription_ids')
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
            form.setValue(
              'data.section_7.meal_plan_ids',
              row.map((s) => Number(s.id)),
              { shouldDirty: true }
            )
            form.trigger('data.section_7.meal_plan_ids')
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
            form.setValue(
              'data.section_8.product_ids',
              row.map((s) => Number(s.id)),
              { shouldDirty: true }
            )
            form.trigger('data.section_8.product_ids')
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
            form.setValue(
              'data.section_9.coach_ids',
              row.map((c) => c.id),
              { shouldDirty: true }
            )
            form.trigger('data.section_9.coach_ids')
            setOpenCoachesTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Loại hình tập luyện"
        description="Chọn một hoặc nhiều loại hình tập luyện đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openWorkoutMethodsTable}
        onOpenChange={setOpenWorkoutMethodsTable}
      >
        <WorkoutMethodsTable
          onConfirmRowSelection={(row) => {
            setSelectedWorkoutMethods(row)
            // Sync features in form state
            const currentFeatures = form.getValues('data.section_6.features') || []
            const newFeatures = row.map((cat: any) => {
              const existing = currentFeatures.find((f: any) => f.workout_method_id === cat.id)
              return existing || { workout_method_id: cat.id, description: '', course_ids: [] }
            })
            form.setValue('data.section_6.features', newFeatures, { shouldDirty: true })
            form.trigger('data.section_6.features')
            setOpenWorkoutMethodsTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Khoá tập Video"
        description="Chọn một hoặc nhiều khoá tập video đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openVideoCourseTable}
        onOpenChange={setOpenVideoCourseTable}
      >
        <CoursesTable
          courseFormat="video"
          onConfirmRowSelection={(row) => {
            setSelectedVideoCourses(row)
            form.setValue(
              'data.section_5.video.course_ids',
              row.map((s) => Number(s.id)),
              { shouldDirty: true }
            )
            form.trigger('data.section_5.video.course_ids')
            setOpenVideoCourseTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Khoá tập Zoom"
        description="Chọn một hoặc nhiều khoá tập zoom đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openZoomCourseTable}
        onOpenChange={setOpenZoomCourseTable}
      >
        <CoursesTable
          courseFormat="live"
          onConfirmRowSelection={(row) => {
            setSelectedZoomCourses(row)
            form.setValue(
              'data.section_5.zoom.course_ids',
              row.map((s) => Number(s.id)),
              { shouldDirty: true }
            )
            form.trigger('data.section_5.zoom.course_ids')
            setOpenZoomCourseTable(false)
          }}
        />
      </EditDialog>
    </>
  )
}
