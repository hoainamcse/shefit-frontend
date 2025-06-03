'use client'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useActionState, useEffect, useMemo, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { MainButton } from '@/components/buttons/main-button'
import {
  FormInputField,
  FormTextareaField,
  FormSelectField,
  FormSwitchField,
  FormCheckboxField,
  FormRadioField,
  FormMultiSelectField,
} from '@/components/forms/fields'
import { FileUploader } from '@/components/file-uploader'
import { Label } from '@/components/ui/label'

import { difficultyLevelLabelOptions, formCategoryLabelOptions, VISIBLE_IN_OPTIONS } from '@/lib/label'
import { FormImageInputField } from './fields/form-image-input-field'
import { Equipment } from '@/models/equipment'
import { MuscleGroup } from '@/models/muscle-group'
import { getEquipments } from '@/network/server/equipments'
import { getMuscleGroups } from '@/network/server/muscle-groups'
import { Subscription } from '@/models/subscription-admin'
import { getSubscriptions } from '@/network/server/subscriptions-admin'
import { CourseFormat, DetailCourse } from '@/models/course-admin'
import { createCourse, updateCourse } from '@/network/server/courses-admin'
import { useAuth } from '../providers/auth-context'

const formSchema = z.object({
  id: z.number().int().optional(),
  course_name: z.string().min(1, { message: 'Vui lòng nhập tên khoá h' }),
  course_format: z.string(),
  summary: z.string().min(30, { message: 'Tóm tắt phải có ít nhất 30 ký tự' }),
  description: z.string().min(30, { message: 'Mô tả phải có ít nhất 30 ký tự' }),
  trainer: z.string().min(1, { message: 'Vui lòng nhập huấn luyện viên' }),
  form_categories: z.array(z.string()).nonempty({ message: 'Vui lòng chọn ít nhất một danh mục' }),
  difficulty_level: z.string().min(1, { message: 'Vui lòng chọn cấp độ' }),
  visible_in: z.array(z.string()).optional(),
  cover_image: z.string().optional(),
  thumbnail_image: z.string().optional(),
  equipment_ids: z.array(z.string()).nonempty({ message: 'Vui lòng chọn ít nhất một thiết bị' }),
  muscle_group_ids: z.array(z.string()).nonempty({ message: 'Vui lòng chọn ít nhất một nhóm cơ' }),
  subscription_ids: z.array(z.string()).nonempty({ message: 'Vui lòng chọn ít nhất một gói đăng ký' }),
  is_public: z.boolean().default(true),
  category: z.string().nullable().optional(),
  duration_weeks: z.coerce.number().nullable().optional(),
  goal: z.string().nullable().optional(),
  suitable_for: z.string().nullable().optional(),
  days_per_week: z.coerce.number().nullable().optional(),
  minutes_per_session: z.coerce.number().nullable().optional(),
  is_free: z.boolean().default(false),
  free_amount: z.coerce.number().optional(),
  is_one_on_one: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>
interface CreateCourseFormProps {
  isEdit?: boolean
  data?: DetailCourse
  format: CourseFormat
  isOneOnOne?: boolean
  onSuccess?: () => void
}

function CreateCourseForm({ isEdit = false, data, format, isOneOnOne = false, onSuccess }: CreateCourseFormProps) {
  const { accessToken } = useAuth()
  const [isPending, startTransition] = useTransition()
  // const [equipments, setEquipments] = useState<Equipment[]>([])
  // const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  // const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  // const [state, action, isPending] = useActionState(createCourse, null)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          ...data,
          equipment_ids: data.equipment_ids.map((equipment) => equipment.toString()),
          muscle_group_ids: data.muscle_group_ids.map((muscleGroup) => muscleGroup.toString()),
          subscription_ids: data.subscription_ids.map((subscription) => subscription.toString()),
        }
      : {
          course_name: '',
          course_format: format,
          summary: '',
          description: '',
          trainer: '',
          form_categories: [],
          difficulty_level: 'beginner',
          visible_in: [],
          cover_image: '',
          thumbnail_image: '',
          equipment_ids: [],
          muscle_group_ids: [],
          subscription_ids: [],
          is_public: true,
          is_free: false,
          free_amount: 0,
          is_one_on_one: isOneOnOne,
          category: '',
          duration_weeks: 0,
          goal: '',
          suitable_for: '',
          days_per_week: 0,
          minutes_per_session: 0,
        },
  })

  // const AVAILABLE_EQUIPMENTS = useMemo(
  //   () => equipments.map((equipment) => ({ value: equipment.id.toString(), label: equipment.name })),
  //   [equipments]
  // )

  // const AVAILABLE_MUSCLE_GROUPS = useMemo(
  //   () => muscleGroups.map((muscleGroup) => ({ value: muscleGroup.id.toString(), label: muscleGroup.name })),
  //   [muscleGroups]
  // )

  // const AVAILABLE_SUBSCRIPTIONS = useMemo(
  //   () =>
  //     subscriptions
  //       .filter((subscription) => subscription.course_format === format || subscription.course_format === 'both')
  //       .map((subscription) => ({ value: subscription.id.toString(), label: subscription.name })),
  //   [subscriptions, format]
  // )

  // const fetchEquipments = async () => {
  //   const response = await getEquipments()
  //   setEquipments(response.data || [])
  // }

  // const fetchMuscleGroups = async () => {
  //   const response = await getMuscleGroups()
  //   setMuscleGroups(response.data || [])
  // }

  // const fetchSubscriptions = async () => {
  //   const response = await getSubscriptions()
  //   setSubscriptions(response.data || [])
  // }

  // useEffect(() => {
  //   fetchEquipments()
  //   fetchMuscleGroups()
  //   fetchSubscriptions()
  // }, [])

  function onSubmit(values: FormData) {
    startTransition(async () => {
      try {
        const convertedValues = {
          ...values,
          equipment_ids: values.equipment_ids.map((id) => Number(id)),
          muscle_group_ids: values.muscle_group_ids.map((id) => Number(id)),
          subscription_ids: values.subscription_ids.map((id) => Number(id)),
          free_amount: values.is_free ? values?.free_amount || 1 : 0,
          visible_in: values.is_public ? values.visible_in : [],
        }
        if (isEdit && data?.id) {
          if (!accessToken) return
          const response = await updateCourse(data.id.toString(), convertedValues, accessToken)
          if (response.status === 'success') {
            toast.success('Cập nhật khoá tập thành công')
          }
        } else {
          if (!accessToken) return
          const response = await createCourse(convertedValues, accessToken)

          if (response.status === 'success') {
            toast.success('Tạo khoá tập thành công')
            onSuccess?.()
          }
        }
      } catch (error) {
        toast.error('Tạo khoá tập thất bại')
      }
    })
  }

  const isFree = form.watch('is_free')

  const isPublic = form.watch('is_public')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInputField
            form={form}
            name="course_name"
            label="Tên khoá"
            withAsterisk
            placeholder="Nhập tên khoá tập"
          />
          <FormInputField form={form} name="trainer" label="HLV" withAsterisk placeholder="Nhập tên HLV" />
        </div>
        <FormTextareaField form={form} name="summary" label="Tóm tắt" withAsterisk placeholder="Nhập tóm tắt" />
        <FormTextareaField form={form} name="description" label="Thông tin" withAsterisk placeholder="Nhập thông tin" />
        <FormMultiSelectField form={form} name="equipment_ids" label="Dụng cụ IDs" data={[]} placeholder="Dụng cụ" />
        <FormMultiSelectField form={form} name="muscle_group_ids" label="Nhóm cơ IDs" data={[]} placeholder="Nhóm cơ" />

        {/* <FormInputField form={form} name="category" label="Thể loại tập" withAsterisk placeholder="Nhập thể loại tập" />

        <FormInputField
          form={form}
          name="duration_weeks"
          label="Thời lượng"
          withAsterisk
          placeholder="Nhập thời lượng (số tuần)"
          type="number"
          min={1}
        />

        <FormInputField form={form} name="goal" label="Mục tiêu" withAsterisk placeholder="Nhập mục tiêu" />

        <FormInputField
          form={form}
          name="suitable_for"
          label="Phù hợp cho đối tượng"
          withAsterisk
          placeholder="Nhập đối tượng"
        />

        <FormInputField
          form={form}
          name="days_per_week"
          label="Số ngày tập 1 tuần"
          withAsterisk
          placeholder="Nhập số ngày"
          type="number"
          min={1}
        />

        <FormInputField
          form={form}
          name="minutes_per_session"
          label="Độ dài 1 buổi tập"
          withAsterisk
          placeholder="Nhập độ dài (số phút)"
          type="number"
          min={1}
        /> */}

        <FormMultiSelectField
          form={form}
          name="subscription_ids"
          label="Membership IDs"
          data={[]}
          placeholder="Membership"
        />

        <div className="grid grid-cols-3 gap-4">
          <FormCheckboxField
            form={form}
            name="form_categories"
            label="Dáng"
            withAsterisk
            data={formCategoryLabelOptions}
          />
          <FormRadioField
            form={form}
            name="difficulty_level"
            label="Độ khó"
            withAsterisk
            data={difficultyLevelLabelOptions}
          />
          <div className="flex items-start gap-10">
            <FormSwitchField form={form} name="is_public" label="Hiển thị" />
            {isPublic && (
              <FormCheckboxField
                form={form}
                name="visible_in"
                label="Danh sách trang"
                withAsterisk
                data={VISIBLE_IN_OPTIONS}
              />
            )}
          </div>
        </div>
        <div className="space-y-4">
          {/* <Label>Hình khoá</Label>
          <FileUploader /> */}
          <FormImageInputField form={form} name="cover_image" label="Hình khoá" placeholder="Tải lên hình ảnh khoá" />
        </div>
        <div className="space-y-4">
          {/* <Label>Hình đại diện khoá</Label>
          <FileUploader /> */}
          <FormImageInputField
            form={form}
            name="thumbnail_image"
            label="Hình đại diện khoá"
            placeholder="Tải lên hình ảnh minh họa cho bài viết"
          />
        </div>
        <div className="flex items-start gap-4">
          <FormSwitchField form={form} name="is_free" label="Free" description="Khoá tập miễn phí" />
          {isFree && (
            <FormInputField
              form={form}
              name="free_amount"
              label="Số lượng ngày miễn phí"
              placeholder="Nhập số lượng miễn phí"
              type="number"
              min={1}
            />
          )}
        </div>
        <MainButton text="Lưu" className="w-full" loading={isPending} />
      </form>
    </Form>
  )
}

export { CreateCourseForm }
