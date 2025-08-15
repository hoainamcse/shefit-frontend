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
import { MealPlansTable } from '@/components/data-table/meal-plans-table'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ProductsTable } from '@/components/data-table/products-table'
import { CoachesTable } from '@/components/data-table/coaches-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { EditDialog } from '@/components/data-table/edit-dialog'
import { MainButton } from '@/components/buttons/main-button'
import { Spinner } from '@/components/spinner'
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
import { getCoaches, queryKeyCoaches } from '@/network/client/coaches'
import {
  HeroSection,
  FeaturedSection,
  SubscriptionsSection,
  CTASection,
  CoursesSection,
  WorkoutMethodsSection,
  MealPlansSection,
  ProductsSection,
  CoachesSection,
  FAQSection,
  ContactSection,
} from './sections'

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
        form.reset(data.data)
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
              <HeroSection form={form} />
            </TabsContent>
            <TabsContent value="tab-2" className="space-y-4">
              <FeaturedSection form={form} />
            </TabsContent>
            <TabsContent value="tab-3" className="space-y-4">
              <SubscriptionsSection
                form={form}
                selectedSubscriptions={selectedSubscriptions}
                isLoadingSubscriptions={isLoadingSubscriptions}
                initialSubscriptions={initialSubscriptions}
                setOpenSubscriptionsTable={setOpenSubscriptionsTable}
              />
            </TabsContent>
            <TabsContent value="tab-4" className="space-y-4">
              <CTASection form={form} />
            </TabsContent>
            <TabsContent value="tab-5" className="space-y-4">
              <CoursesSection
                form={form}
                selectedVideoCourses={selectedVideoCourses}
                selectedZoomCourses={selectedZoomCourses}
                isLoadingVideoCourses={isLoadingVideoCourses}
                isLoadingZoomCourses={isLoadingZoomCourses}
                initialVideoCourses={initialVideoCourses}
                initialZoomCourses={initialZoomCourses}
                setOpenVideoCourseTable={setOpenVideoCourseTable}
                setOpenZoomCourseTable={setOpenZoomCourseTable}
              />
            </TabsContent>
            <TabsContent value="tab-6" className="space-y-4">
              <WorkoutMethodsSection
                form={form}
                selectedWorkoutMethods={selectedWorkoutMethods}
                setOpenWorkoutMethodsTable={setOpenWorkoutMethodsTable}
                setOpenDialogWorkoutMethodId={setOpenDialogWorkoutMethodId}
                openDialogWorkoutMethodId={openDialogWorkoutMethodId}
              />
            </TabsContent>
            <TabsContent value="tab-7" className="space-y-4">
              <MealPlansSection
                form={form}
                selectedMealPlans={selectedMealPlans}
                setOpenMealPlansTable={setOpenMealPlansTable}
              />
            </TabsContent>
            <TabsContent value="tab-8" className="space-y-4">
              <ProductsSection
                form={form}
                selectedProducts={selectedProducts}
                setOpenProductsTable={setOpenProductsTable}
              />
            </TabsContent>
            <TabsContent value="tab-9" className="space-y-4">
              <CoachesSection
                form={form}
                selectedCoaches={selectedCoaches}
                isLoadingCoaches={isLoadingCoaches}
                initialCoaches={initialCoaches}
                setOpenCoachesTable={setOpenCoachesTable}
              />
            </TabsContent>
            <TabsContent value="tab-10" className="space-y-4">
              <FAQSection form={form} />
            </TabsContent>
            <TabsContent value="tab-11" className="space-y-4">
              <ContactSection form={form} />
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
