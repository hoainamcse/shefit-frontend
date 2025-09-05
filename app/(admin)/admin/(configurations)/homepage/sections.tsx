import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'

import { FormImageSelectField, FormInputField, FormTextareaField } from '@/components/forms/fields'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DialogEdit } from '@/components/dialogs/dialog-edit'
import { CoursesTable } from '@/components/data-table/courses-table'

import { getCourses, queryKeyCourses } from '@/network/client/courses'
import { getWorkoutMethods, queryKeyWorkoutMethods } from '@/network/client/workout-methods'
import { getMealPlans, queryKeyMealPlans } from '@/network/client/meal-plans'
import { getProducts, queryKeyProducts } from '@/network/client/products'

import type { Subscription } from '@/models/subscription'
import type { MealPlan } from '@/models/meal-plan'
import type { Product } from '@/models/product'
import type { Coach } from '@/models/coach'
import type { WorkoutMethod } from '@/models/workout-method'
import type { Course } from '@/models/course'

interface SectionProps {
  form: UseFormReturn<any>
}

// Component to render tab content for a single workout method
interface WorkoutMethodTabProps {
  w: WorkoutMethod
  featureIdx: number
  form: UseFormReturn<any>
  setOpenDialogWorkoutMethodId: (id: string | null) => void
  openDialogWorkoutMethodId: string | null
}

function WorkoutMethodTab({
  w,
  featureIdx,
  form,
  setOpenDialogWorkoutMethodId,
  openDialogWorkoutMethodId,
}: WorkoutMethodTabProps) {
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

      <DialogEdit
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
      </DialogEdit>
    </div>
  )
}

export function HeroSection({ form }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormInputField form={form} name="data.section_1.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
        <FormInputField form={form} name="data.section_1.features.0" label="Tiêu biểu 1" placeholder="Nhập tiêu biểu" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormInputField form={form} name="data.section_1.features.1" label="Tiêu biểu 2" placeholder="Nhập tiêu biểu" />
        <FormInputField form={form} name="data.section_1.features.2" label="Tiêu biểu 3" placeholder="Nhập tiêu biểu" />
      </div>
      <FormTextareaField form={form} name="data.section_1.description" label="Mô tả" placeholder="Nhập mô tả" />
      <FormImageSelectField control={form.control} name="data.section_1.image_desktop" label="Hình ảnh desktop" />
      <FormImageSelectField control={form.control} name="data.section_1.image_mobile" label="Hình ảnh mobile" />
      <div className="grid grid-cols-2 gap-4">
        <FormInputField form={form} name="data.section_1.cta.text" label="Nút CTA" placeholder="Nhập văn bản nút" />
        <FormInputField form={form} name="data.section_1.cta.href" label="Liên kết CTA" placeholder="Nhập liên kết" />
      </div>
    </>
  )
}

export function FeaturedSection({ form }: SectionProps) {
  return (
    <>
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
      <FormImageSelectField control={form.control} name="data.section_2.image_desktop" label="Hình ảnh desktop" />
      <FormImageSelectField control={form.control} name="data.section_2.image_mobile" label="Hình ảnh mobile" />
      <div className="grid grid-cols-2 gap-4">
        <FormInputField form={form} name="data.section_2.cta.text" label="Nút CTA" placeholder="Nhập văn bản nút" />
        <FormInputField form={form} name="data.section_2.cta.href" label="Liên kết CTA" placeholder="Nhập liên kết" />
      </div>
    </>
  )
}

interface SubscriptionsSectionProps extends SectionProps {
  selectedSubscriptions: Subscription[]
  isLoadingSubscriptions: boolean
  initialSubscriptions: any
  setOpenSubscriptionsTable: (open: boolean) => void
}

export function SubscriptionsSection({
  form,
  selectedSubscriptions,
  isLoadingSubscriptions,
  initialSubscriptions,
  setOpenSubscriptionsTable,
}: SubscriptionsSectionProps) {
  return (
    <>
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
                : initialSubscriptions?.data.map((s: Subscription) => s.name).join(', ')
            }
            onFocus={() => setOpenSubscriptionsTable(true)}
            placeholder="Chọn gói tập"
            readOnly
          />
        )}
      </div>
    </>
  )
}

export function CTASection({ form }: SectionProps) {
  return (
    <>
      <FormInputField form={form} name="data.section_4.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
      <FormTextareaField form={form} name="data.section_4.description" label="Mô tả" placeholder="Nhập mô tả" />
      <div className="grid grid-cols-2 gap-4">
        <FormInputField form={form} name="data.section_4.cta.text" label="Nút CTA" placeholder="Nhập văn bản nút" />
        <FormInputField form={form} name="data.section_4.cta.href" label="Liên kết CTA" placeholder="Nhập liên kết" />
      </div>
    </>
  )
}

interface CoursesSectionProps extends SectionProps {
  selectedVideoCourses: Course[]
  selectedZoomCourses: Course[]
  isLoadingVideoCourses: boolean
  isLoadingZoomCourses: boolean
  initialVideoCourses: any
  initialZoomCourses: any
  setOpenVideoCourseTable: (open: boolean) => void
  setOpenZoomCourseTable: (open: boolean) => void
}

export function CoursesSection({
  form,
  selectedVideoCourses,
  selectedZoomCourses,
  isLoadingVideoCourses,
  isLoadingZoomCourses,
  initialVideoCourses,
  initialZoomCourses,
  setOpenVideoCourseTable,
  setOpenZoomCourseTable,
}: CoursesSectionProps) {
  return (
    <>
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
                      : initialVideoCourses?.data.map((s: Course) => s.course_name).join(', ')
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
                      : initialZoomCourses?.data.map((s: Course) => s.course_name).join(', ')
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
    </>
  )
}

interface WorkoutMethodsSectionProps extends SectionProps {
  selectedWorkoutMethods: WorkoutMethod[]
  setOpenWorkoutMethodsTable: (open: boolean) => void
  setOpenDialogWorkoutMethodId: (id: string | null) => void
  openDialogWorkoutMethodId: string | null
}

export function WorkoutMethodsSection({
  form,
  selectedWorkoutMethods,
  setOpenWorkoutMethodsTable,
  setOpenDialogWorkoutMethodId,
  openDialogWorkoutMethodId,
}: WorkoutMethodsSectionProps) {
  const workoutMethodIds = form.watch('data.section_6.features')?.map((f: any) => f.workout_method_id) || []

  const { data: initialWorkoutMethodsData, isLoading: isLoadingWorkoutMethodsData } = useQuery({
    queryKey: [queryKeyWorkoutMethods],
    queryFn: () => getWorkoutMethods({ ids: workoutMethodIds.join(',') }),
    enabled: workoutMethodIds.length > 0,
  })

  // Prefer user-selected workout methods; fall back to the initial ones coming from the API
  const workoutMethods =
    selectedWorkoutMethods.length > 0 ? selectedWorkoutMethods : initialWorkoutMethodsData?.data ?? []

  return (
    <>
      <FormInputField form={form} name="data.section_6.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
      <div className="space-y-2">
        <Label>Loại hình tập luyện</Label>
        {isLoadingWorkoutMethodsData && selectedWorkoutMethods.length === 0 ? (
          <Skeleton className="h-10 w-full bg-muted" />
        ) : (
          <Input
            value={
              selectedWorkoutMethods.length > 0
                ? selectedWorkoutMethods.map((s) => s.name).join(', ')
                : initialWorkoutMethodsData?.data.map((s) => s.name).join(', ')
            }
            onFocus={() => setOpenWorkoutMethodsTable(true)}
            placeholder="Chọn loại hình"
            readOnly
          />
        )}
      </div>
      {isLoadingWorkoutMethodsData && selectedWorkoutMethods.length === 0 ? (
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
              return (
                <WorkoutMethodTab
                  key={w.id}
                  w={w}
                  featureIdx={featureIdx}
                  form={form}
                  setOpenDialogWorkoutMethodId={setOpenDialogWorkoutMethodId}
                  openDialogWorkoutMethodId={openDialogWorkoutMethodId}
                />
              )
            })}
          </Tabs>
        )
      )}
    </>
  )
}

interface MealPlansSectionProps extends SectionProps {
  selectedMealPlans: MealPlan[]
  setOpenMealPlansTable: (open: boolean) => void
}

export function MealPlansSection({ form, selectedMealPlans, setOpenMealPlansTable }: MealPlansSectionProps) {
  const { data: initialMealPlansData, isLoading: isLoadingMealPlansData } = useQuery({
    queryKey: [queryKeyMealPlans],
    queryFn: () => getMealPlans({ ids: form.watch('data.section_7.meal_plan_ids')?.join(',') }),
    enabled: form.watch('data.section_7.meal_plan_ids')?.length > 0,
  })

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormInputField form={form} name="data.section_7.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
        <FormInputField form={form} name="data.section_7.subtitle" label="Phụ đề" placeholder="Nhập phụ đề" />
      </div>
      <div className="space-y-2">
        <Label>Thực đơn</Label>
        {isLoadingMealPlansData && selectedMealPlans.length === 0 ? (
          <Skeleton className="h-10 w-full bg-muted" />
        ) : (
          <Input
            value={
              selectedMealPlans.length > 0
                ? selectedMealPlans.map((ml) => ml.title).join(', ')
                : initialMealPlansData?.data.map((ml: MealPlan) => ml.title).join(', ')
            }
            onFocus={() => setOpenMealPlansTable(true)}
            placeholder="Chọn thực đơn"
            readOnly
          />
        )}
      </div>
    </>
  )
}

interface ProductsSectionProps extends SectionProps {
  selectedProducts: Product[]
  setOpenProductsTable: (open: boolean) => void
}

export function ProductsSection({ form, selectedProducts, setOpenProductsTable }: ProductsSectionProps) {
  const { data: initialProductsData, isLoading: isLoadingProductsData } = useQuery({
    queryKey: [queryKeyProducts],
    queryFn: () => getProducts({ ids: form.watch('data.section_8.product_ids')?.join(',') }),
    enabled: form.watch('data.section_8.product_ids')?.length > 0,
  })

  return (
    <>
      <FormInputField form={form} name="data.section_8.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
      <FormTextareaField form={form} name="data.section_8.description" label="Mô tả" placeholder="Nhập mô tả" />
      <div className="space-y-2">
        <Label>Sản phẩm</Label>
        {isLoadingProductsData && selectedProducts.length === 0 ? (
          <Skeleton className="h-10 w-full bg-muted" />
        ) : (
          <Input
            value={
              selectedProducts.length > 0
                ? selectedProducts.map((p) => p.name).join(', ')
                : initialProductsData?.data.map((p: Product) => p.name).join(', ')
            }
            onFocus={() => setOpenProductsTable(true)}
            placeholder="Chọn sản phẩm"
            readOnly
          />
        )}
      </div>
    </>
  )
}

interface CoachesSectionProps extends SectionProps {
  selectedCoaches: Coach[]
  isLoadingCoaches: boolean
  initialCoaches: any
  setOpenCoachesTable: (open: boolean) => void
}

export function CoachesSection({
  form,
  selectedCoaches,
  isLoadingCoaches,
  initialCoaches,
  setOpenCoachesTable,
}: CoachesSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Huấn luyện viên</Label>
      {isLoadingCoaches && selectedCoaches.length === 0 ? (
        <Skeleton className="h-10 w-full bg-muted" />
      ) : (
        <Input
          value={
            selectedCoaches.length > 0
              ? selectedCoaches.map((c) => c.name).join(', ')
              : initialCoaches?.data?.map((c: Coach) => c.name).join(', ')
          }
          onFocus={() => setOpenCoachesTable(true)}
          placeholder="Chọn huấn luyện viên"
          readOnly
        />
      )}
    </div>
  )
}

export function FAQSection({ form }: SectionProps) {
  return (
    <>
      <FormInputField form={form} name="data.section_10.top.title" label="Tiêu đề trên" placeholder="Nhập tiêu đề" />
      <FormTextareaField
        form={form}
        name="data.section_10.top.description"
        label="Mô tả trên"
        placeholder="Nhập mô tả"
      />
      <FormImageSelectField control={form.control} name="data.section_10.top.image" label="Hình ảnh trên" />
      <FormInputField form={form} name="data.section_10.bottom.title" label="Tiêu đề dưới" placeholder="Nhập tiêu đề" />
      <FormTextareaField
        form={form}
        name="data.section_10.bottom.description"
        label="Mô tả dưới"
        placeholder="Nhập mô tả"
      />
      <FormImageSelectField control={form.control} name="data.section_10.bottom.image" label="Hình ảnh dưới" />
    </>
  )
}

export function ContactSection({ form }: SectionProps) {
  return (
    <>
      <FormImageSelectField control={form.control} name="data.section_11.image" label="Hình ảnh" />
      <FormTextareaField form={form} name="data.section_11.description" label="Mô tả" placeholder="Nhập mô tả" />
      <div className="grid grid-cols-2 gap-4">
        <FormInputField form={form} name="data.section_11.cta.text" label="Nút CTA" placeholder="Nhập văn bản nút" />
        <FormInputField form={form} name="data.section_11.cta.href" label="Liên kết CTA" placeholder="Nhập liên kết" />
      </div>
    </>
  )
}
