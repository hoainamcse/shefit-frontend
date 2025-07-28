'use client'

import type { Course, CourseFormat, CoursePayload } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCourse, updateCourse } from '@/network/client/courses'
import { courseFormOptions, courseLevelOptions } from '@/lib/label'

import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'
import {
  FormCheckboxField,
  FormInputField,
  FormNumberField,
  FormRadioField,
  FormSwitchField,
  FormTextareaField,
} from './fields'
import { ImageUploader } from '../image-uploader'
import { EquipmentsTable } from '../data-table/equipments-table'
import { EditDialog } from '../data-table/edit-dialog'
import { MuscleGroupsTable } from '../data-table/muscle-groups-table'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SubscriptionsTable } from '../data-table/subscriptions-table'
import { CoverMediaSelector } from './cover-media-selector'
import { FormCategoryTable } from '../data-table/form-category-table'
import { WorkoutMethodsTable } from '../data-table/workout-methods-table'

// ! Follow CoursePayload model in models/course.ts
const formSchema = z.object({
  thumbnail_image_mobile: z.string().url(),
  thumbnail_image_desktop: z.string().url(),
  description: z.string(),
  course_name: z.string().min(1, 'Tên khoá tập không được để trống'),
  course_format: z.enum(['video', 'live']),
  trainer: z.string(),
  form_category_ids: z.array(z.string()),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  is_public: z.boolean(),
  is_popular: z.boolean(),
  cover_image: z.string().url(),
  youtube_url: z.string().url().optional(),
  is_free: z.boolean(),
  summary: z.string(),
  free_amount: z.number().min(0),
  is_one_on_one: z.boolean(),
  equipment_ids: z.array(z.string()),
  muscle_group_ids: z.array(z.string()),
  subscription_ids: z.array(z.string()),
  description_homepage_1: z.string(),
  image_homepage: z.string().url(),
  workout_method_ids: z.array(z.string()),
  display_order: z.number(),
})

type FormValue = z.infer<typeof formSchema>

interface EditCourseFormProps {
  data?: Course
  onSuccess?: (data: Course) => void
  courseFormat: CourseFormat
  isOneOnOne: boolean
}

const defaultImageUrl = 'https://placehold.co/400?text=shefit.vn&font=Oswald'
const defaultYoutubeUrl = 'https://www.youtube.com/'

export function EditCourseForm({ data, onSuccess, courseFormat, isOneOnOne }: EditCourseFormProps) {
  const isEdit = !!data
  const defaultValue = {
    thumbnail_image_mobile: defaultImageUrl,
    thumbnail_image_desktop: defaultImageUrl,
    description: '',
    course_name: '',
    course_format: courseFormat,
    trainer: '',
    form_category_ids: [],
    difficulty_level: 'beginner',
    is_public: true,
    is_popular: false,
    youtube_url: defaultYoutubeUrl,
    cover_image: defaultImageUrl,
    is_free: false,
    summary: '',
    free_amount: 0,
    is_one_on_one: isOneOnOne,
    muscle_group_ids: [],
    equipment_ids: [],
    subscription_ids: [],
    description_homepage_1: '',
    image_homepage: defaultImageUrl,
    workout_method_ids: [],
    display_order: 0,
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? (() => {
          const isYoutube = typeof data.cover_image === 'string' && data.cover_image.includes('youtube.com')
          return {
            thumbnail_image_mobile: data.thumbnail_image_mobile || defaultImageUrl,
            thumbnail_image_desktop: data.thumbnail_image_desktop || defaultImageUrl,
            description: data.description,
            course_name: data.course_name,
            course_format: data.course_format,
            trainer: data.trainer,
            form_category_ids: data.relationships?.form_categories.map((mg) => mg.id.toString()) || [],
            difficulty_level: data.difficulty_level,
            is_public: data.is_public,
            is_popular: data.is_popular,
            cover_image: isYoutube ? defaultImageUrl : data.cover_image,
            youtube_url: isYoutube ? data.cover_image : defaultYoutubeUrl,
            is_free: data.is_free,
            summary: data.summary,
            free_amount: data.free_amount,
            is_one_on_one: data.is_one_on_one,
            description_homepage_1: data.description_homepage_1 || '',
            image_homepage: data.image_homepage || defaultImageUrl,
            muscle_group_ids: data.relationships?.muscle_groups.map((mg) => mg.id.toString()) || [],
            equipment_ids: data.relationships?.equipments.map((e) => e.id.toString()) || [],
            subscription_ids: data.relationships?.subscriptions.map((s) => s.id.toString()) || [],
            workout_method_ids: data.relationships?.workout_methods.map((wm) => wm.id.toString()) || [],
            display_order: data.display_order || 0,
          }
        })()
      : defaultValue,
  })

  const [showYoutubeUrlInput, setShowYoutubeUrlInput] = useState(
    isEdit && data?.cover_image?.includes('youtube.com') ? true : false
  )

  const courseMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateCourse(data.id, values as CoursePayload) : createCourse(values as CoursePayload)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật khoá tập thành công' : 'Tạo khoá tập thành công')
        onSuccess?.(data.data)
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    if (showYoutubeUrlInput && values.youtube_url) {
      const { youtube_url, ...submitValues } = values
      submitValues.cover_image = youtube_url
      courseMutation.mutate(submitValues)
    } else {
      courseMutation.mutate(values)
    }
  }

  const [openMuscleGroupsTable, setOpenMuscleGroupsTable] = useState(false)
  const [openEquipmentsTable, setOpenEquipmentsTable] = useState(false)
  const [openSubscriptionsTable, setOpenSubscriptionsTable] = useState(false)
  const [openFormCategoryTable, setOpenFormCategoryTable] = useState(false)
  const [openWorkoutMethodsTable, setOpenWorkoutMethodsTable] = useState(false)
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState(data?.relationships?.muscle_groups || [])
  const [selectedEquipments, setSelectedEquipments] = useState(data?.relationships?.equipments || [])
  const [selectedSubscriptions, setSelectedSubscriptions] = useState(data?.relationships?.subscriptions || [])
  const [selectedFormCategory, setSelectedFormCategory] = useState(data?.relationships?.form_categories || [])
  const [selectedWorkoutMethods, setSelectedWorkoutMethods] = useState(data?.relationships?.workout_methods || [])

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-4">
            <FormInputField
              form={form}
              name="course_name"
              label="Tên khoá tập"
              withAsterisk
              placeholder="Nhập tên khoá tập"
            />
            <FormNumberField form={form} name="display_order" label="Thứ tự hiển thị" placeholder="e.g., 10" />
            <FormInputField form={form} name="trainer" label="Tên HLV" placeholder="Nhập tên HLV" />
          </div>
          <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />

          <div className="grid grid-cols-2 gap-4">
            <ImageUploader
              form={form}
              name="thumbnail_image_mobile"
              label="Hình ảnh đại diện Mobile"
              accept={{ 'image/*': [] }}
              maxFileCount={1}
            />
            <ImageUploader
              form={form}
              name="thumbnail_image_desktop"
              label="Hình ảnh đại diện Desktop"
              accept={{ 'image/*': [] }}
              maxFileCount={1}
            />
          </div>
          <CoverMediaSelector
            form={form}
            showYoutubeUrlInput={showYoutubeUrlInput}
            setShowYoutubeUrlInput={setShowYoutubeUrlInput}
            coverImageName="cover_image"
            youtubeUrlName="youtube_url"
          />
          <FormTextareaField
            form={form}
            name="description_homepage_1"
            label="Mô tả homepage 1"
            placeholder="Nhập mô tả"
          />
          <ImageUploader
            form={form}
            name="image_homepage"
            label="Hình ảnh homepage"
            accept={{ 'image/*': [] }}
            maxFileCount={1}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nhóm cơ</Label>
              <Input
                value={selectedMuscleGroups.map((mg) => mg.name).join(', ')}
                onFocus={() => setOpenMuscleGroupsTable(true)}
                placeholder="Chọn nhóm cơ"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Dụng cụ</Label>
              <Input
                value={selectedEquipments.map((e) => e.name).join(', ')}
                onFocus={() => setOpenEquipmentsTable(true)}
                placeholder="Chọn dụng cụ"
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gói tập</Label>
              <Input
                value={selectedSubscriptions.map((e) => e.name).join(', ')}
                onFocus={() => setOpenSubscriptionsTable(true)}
                placeholder="Chọn gói tập"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Phom dáng</Label>
              <Input
                value={selectedFormCategory.map((e) => e.name).join(', ')}
                onFocus={() => setOpenFormCategoryTable(true)}
                placeholder="Chọn phom dáng"
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại hình tập luyện</Label>
              <Input
                value={selectedWorkoutMethods.map((e) => e.name).join(', ')}
                onFocus={() => setOpenWorkoutMethodsTable(true)}
                placeholder="Chọn loại hình tập luyện"
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormRadioField form={form} name="difficulty_level" label="Độ khó" data={courseLevelOptions} />
            <FormSwitchField
              form={form}
              name="is_popular"
              label="Phổ biến"
              description="Bật khi muốn khoá tập này xuất hiện trong danh sách phổ biến"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormSwitchField
              form={form}
              name="is_public"
              label="Công khai"
              description="Bật khi muốn khoá tập này hiển thị công khai"
            />
            <FormSwitchField
              form={form}
              name="is_free"
              label="Miễn phí"
              description="Bật khi muốn khoá tập này miễn phí cho người dùng"
            />
            <FormNumberField form={form} name="free_amount" label="Số ngày miễn phí" placeholder="e.g., 10" />
          </div>
          <div className="flex justify-end">
            {(!isEdit || (isEdit && form.formState.isDirty)) && (
              <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={courseMutation.isPending} />
            )}
          </div>
        </form>
      </Form>
      <EditDialog
        title="Chọn Nhóm cơ"
        description="Chọn một hoặc nhiều nhóm cơ đã có hoặc tạo mới để liên kết với khoá tập này."
        open={openMuscleGroupsTable}
        onOpenChange={setOpenMuscleGroupsTable}
      >
        <MuscleGroupsTable
          onConfirmRowSelection={(row) => {
            setSelectedMuscleGroups(row)
            form.setValue(
              'muscle_group_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('muscle_group_ids')
            setOpenMuscleGroupsTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Dụng cụ"
        description="Chọn một hoặc nhiều dụng cụ đã có hoặc tạo mới để liên kết với khoá tập này."
        open={openEquipmentsTable}
        onOpenChange={setOpenEquipmentsTable}
      >
        <EquipmentsTable
          onConfirmRowSelection={(row) => {
            setSelectedEquipments(row)
            form.setValue(
              'equipment_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('equipment_ids')
            setOpenEquipmentsTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Gói tập"
        description="Chọn một hoặc nhiều gói tập đã có hoặc tạo mới để liên kết với khoá tập này."
        open={openSubscriptionsTable}
        onOpenChange={setOpenSubscriptionsTable}
      >
        <SubscriptionsTable
          onConfirmRowSelection={(row) => {
            setSelectedSubscriptions(row)
            form.setValue(
              'subscription_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('subscription_ids')
            setOpenSubscriptionsTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Phom dáng"
        description="Chọn một hoặc nhiều dụng cụ đã có hoặc tạo mới để liên kết với khoá tập này."
        open={openFormCategoryTable}
        onOpenChange={setOpenFormCategoryTable}
      >
        <FormCategoryTable
          onConfirmRowSelection={(row) => {
            setSelectedFormCategory(row)
            form.setValue(
              'form_category_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('form_category_ids')
            setOpenFormCategoryTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn loại hình tập luyện"
        description="Chọn một hoặc nhiều dụng cụ đã có hoặc tạo mới để liên kết với khoá tập này."
        open={openWorkoutMethodsTable}
        onOpenChange={setOpenWorkoutMethodsTable}
      >
        <WorkoutMethodsTable
          onConfirmRowSelection={(row) => {
            setSelectedWorkoutMethods(row)
            form.setValue(
              'workout_method_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('workout_method_ids')
            setOpenWorkoutMethodsTable(false)
          }}
        />
      </EditDialog>
    </>
  )
}
