'use client'

import type { Course, CourseFormat, CoursePayload } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { courseLevelOptions } from '@/lib/label'
import { createCourse, updateCourse } from '@/network/client/courses'

import { Form } from '../ui/form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { MainButton } from '../buttons/main-button'
import { SheetEdit } from '../dialogs/sheet-edit'
import { DialogEdit } from '../dialogs/dialog-edit'
import { EquipmentsTable } from '../data-table/equipments-table'
import { FormCategoriesTable } from '../data-table/form-categories-table'
import { MuscleGroupsTable } from '../data-table/muscle-groups-table'
import { SubscriptionsTable } from '../data-table/subscriptions-table'
import { WorkoutMethodsTable } from '../data-table/workout-methods-table'
import {
  FormImageSelectField,
  FormInputField,
  FormNumberField,
  FormRadioField,
  FormRichTextField,
  FormSwitchField,
  FormTextareaField,
} from './fields'

// ! Follow CoursePayload model in models/course.ts
const formSchema = z.object({
  description: z.string(),
  course_name: z.string().min(1, 'Tên khoá tập không được để trống'),
  course_format: z.enum(['video', 'live']),
  trainer: z.string(),
  form_category_ids: z.array(z.string()),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  is_public: z.boolean(),
  is_popular: z.boolean(),
  assets: z.object({
    thumbnail: z.string().url().nullable(),
    mobile_cover: z.string().url().nullable(),
    desktop_cover: z.string().url().nullable(),
    youtube_cover: z.string().url().nullable(),
    homepage_thumbnail: z.string().url().nullable(),
  }),
  is_free: z.boolean(),
  summary: z.string(),
  free_amount: z.number().min(0),
  is_one_on_one: z.boolean(),
  equipment_ids: z.array(z.string()),
  muscle_group_ids: z.array(z.string()),
  subscription_ids: z.array(z.number()),
  description_homepage_1: z.string(),
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

const DEFAULT_IMAGE_URL = 'https://placehold.co/400?text=shefit.vn&font=Oswald'

export function EditCourseForm({ data, onSuccess, courseFormat, isOneOnOne }: EditCourseFormProps) {
  const isEdit = !!data
  const defaultValue = {
    description: '',
    course_name: '',
    course_format: courseFormat,
    trainer: '',
    difficulty_level: 'beginner',
    is_public: true,
    is_popular: false,
    assets: {
      thumbnail: DEFAULT_IMAGE_URL,
      mobile_cover: DEFAULT_IMAGE_URL,
      desktop_cover: null,
      youtube_cover: null,
      homepage_thumbnail: null,
    },
    is_free: false,
    summary: '',
    free_amount: 0,
    is_one_on_one: isOneOnOne,
    equipment_ids: [],
    muscle_group_ids: [],
    form_category_ids: [],
    workout_method_ids: [],
    description_homepage_1: '',
    subscription_ids: [],
    display_order: 1,
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          description: data.description,
          course_name: data.course_name,
          course_format: data.course_format,
          trainer: data.trainer,
          difficulty_level: data.difficulty_level,
          is_public: data.is_public,
          is_popular: data.is_popular,
          assets: data.assets,
          is_free: data.is_free,
          summary: data.summary,
          free_amount: data.free_amount,
          is_one_on_one: data.is_one_on_one,
          equipment_ids: data.relationships?.equipments.map((e) => e.id.toString()) || [],
          muscle_group_ids: data.relationships?.muscle_groups.map((mg) => mg.id.toString()) || [],
          form_category_ids: data.relationships?.form_categories.map((mg) => mg.id.toString()) || [],
          workout_method_ids: data.relationships?.workout_methods.map((wm) => wm.id.toString()) || [],
          description_homepage_1: data.description_homepage_1 || '',
          subscription_ids: data.relationships?.subscriptions.map((s) => s.id) || [],
          display_order: data.display_order || 0,
        }
      : defaultValue,
  })

  const courseMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit ? updateCourse(data.id, values as CoursePayload) : createCourse(values as CoursePayload),
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
    courseMutation.mutate(values)
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
          <FormTextareaField form={form} name="summary" label="Tóm tắt" placeholder="Nhập tóm tắt" />
          <FormRichTextField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
          <FormTextareaField
            form={form}
            name="description_homepage_1"
            label="Mô tả homepage 1"
            placeholder="Nhập mô tả"
          />

          <EditCourseAssets form={form} />
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
      <DialogEdit
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
      </DialogEdit>
      <DialogEdit
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
      </DialogEdit>
      <DialogEdit
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
              row.map((r) => r.id),
              { shouldDirty: true }
            )
            form.trigger('subscription_ids')
            setOpenSubscriptionsTable(false)
          }}
        />
      </DialogEdit>
      <DialogEdit
        title="Chọn Phom dáng"
        description="Chọn một hoặc nhiều dụng cụ đã có hoặc tạo mới để liên kết với khoá tập này."
        open={openFormCategoryTable}
        onOpenChange={setOpenFormCategoryTable}
      >
        <FormCategoriesTable
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
      </DialogEdit>
      <DialogEdit
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
      </DialogEdit>
    </>
  )
}

function EditCourseAssets({ form }: { form: ReturnType<typeof useForm<FormValue>> }) {
  const [openEditSheet, setOpenEditSheet] = useState(false)
  return (
    <>
      <MainButton text="Assets của khoá tập" variant="outline" type="button" onClick={() => setOpenEditSheet(true)} />
      <SheetEdit
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        title="Chỉnh sửa khoá tập"
        description="Chỉnh sửa các thông tin liên quan đến khoá tập"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormImageSelectField control={form.control} name="assets.thumbnail" label="Hình ảnh đại diện" />
            <FormImageSelectField
              control={form.control}
              name="assets.homepage_thumbnail"
              label="Hình ảnh đại diện (Homepage)"
              description="Ảnh đại diện (mặc định) sẽ được sử dụng nếu không đặt"
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormImageSelectField control={form.control} name="assets.mobile_cover" label="Hình ảnh bìa (Mobile)" />
            <FormImageSelectField
              control={form.control}
              name="assets.desktop_cover"
              label="Hình ảnh bìa (Desktop)"
              description="Ảnh bìa mobile sẽ được sử dụng nếu không đặt"
            />
          </div>
          <FormInputField
            form={form}
            name="assets.youtube_cover"
            label="Video bìa (YouTube)"
            placeholder="Nhập URL video YouTube"
            description="Ảnh bìa mobile sẽ được sử dụng nếu không đặt"
          />
        </div>
      </SheetEdit>
    </>
  )
}
