'use client'

import type { Course, CourseFormat } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
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
  FormMultiSelectField,
  FormNumberField,
  FormRadioField,
  FormSwitchField,
  FormTextareaField,
} from './fields'
import { ImageUploader } from '../image-uploader'

// ! Follow CoursePayload model in models/course.ts
const formSchema = z.object({
  thumbnail_image: z.string().url(),
  description: z.string(),
  course_name: z.string().min(1),
  course_format: z.enum(['video', 'live']),
  trainer: z.string(),
  form_categories: z.array(z.enum(['pear', 'apple', 'rectangle', 'hourglass', 'inverted_triangle'])),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  is_public: z.boolean(),
  is_popular: z.boolean(),
  cover_image: z.string().url(),
  is_free: z.boolean(),
  summary: z.string(),
  free_amount: z.number().min(0),
  is_one_on_one: z.boolean(),
  equipment_ids: z.array(z.string()),
  muscle_group_ids: z.array(z.string()),
  subscription_ids: z.array(z.string()),
})

type FormValue = z.infer<typeof formSchema>

interface EditCourseFormProps {
  data?: Course
  onSuccess?: (data: Course) => void
  courseFormat: CourseFormat
  isOneOnOne: boolean
}

export function EditCourseForm({ data, onSuccess, courseFormat, isOneOnOne }: EditCourseFormProps) {
  const isEdit = !!data
  const defaultValue = {
    thumbnail_image: 'https://placehold.co/600x400?text=example',
    description: '',
    course_name: '',
    course_format: courseFormat,
    trainer: '',
    form_categories: [],
    difficulty_level: 'beginner',
    is_public: true,
    is_popular: false,
    cover_image: 'https://placehold.co/600x400?text=example',
    is_free: false,
    summary: '',
    free_amount: 0,
    is_one_on_one: isOneOnOne,
    muscle_group_ids: [],
    equipment_ids: [],
    subscription_ids: [],
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          thumbnail_image: data.thumbnail_image,
          description: data.description,
          course_name: data.course_name,
          course_format: data.course_format,
          trainer: data.trainer,
          form_categories: data.form_categories,
          difficulty_level: data.difficulty_level,
          is_public: data.is_public,
          is_popular: data.is_popular,
          cover_image: data.cover_image,
          is_free: data.is_free,
          summary: data.summary,
          free_amount: data.free_amount,
          is_one_on_one: data.is_one_on_one,
          muscle_group_ids: data.muscle_group_ids.map((mg) => mg.toString()),
          equipment_ids: data.equipment_ids.map((e) => e.toString()),
          subscription_ids: data.subscription_ids.map((s) => s.toString()),
        }
      : defaultValue,
  })

  const courseMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateCourse(data.id, values) : createCourse(values)),
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

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <FormInputField
            form={form}
            name="course_name"
            label="Tên khoá tập"
            withAsterisk
            placeholder="Nhập tên khoá tập"
          />
          <FormInputField form={form} name="trainer" label="Tên HLV" placeholder="Nhập tên HLV" />
        </div>
        <FormTextareaField form={form} name="summary" label="Tóm tắt" placeholder="Nhập tóm tắt" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <div className="grid grid-cols-2 gap-4">
          <ImageUploader
            form={form}
            name="thumbnail_image"
            label="Hình ảnh đại diện"
            accept={{ 'image/*': [] }}
            maxFileCount={1}
          />
          <ImageUploader
            form={form}
            name="cover_image"
            label="Hình ảnh bìa"
            accept={{ 'image/*': [] }}
            maxFileCount={1}
          />
        </div>
        <FormMultiSelectField
          form={form}
          name="muscle_group_ids"
          label="Nhóm cơ IDs"
          placeholder="Nhập nhóm cơ ID"
          description="Nhập ID và nhấn enter để thêm"
        />
        <FormMultiSelectField
          form={form}
          name="equipment_ids"
          label="Dụng cụ IDs"
          placeholder="Nhập dụng cụ ID"
          description="Nhập ID và nhấn enter để thêm"
        />
        <FormMultiSelectField
          form={form}
          name="subscription_ids"
          label="Gói tập IDs"
          placeholder="Nhập gói tập ID"
          description="Nhập ID và nhấn enter để thêm"
        />
        <div className="grid grid-cols-3 gap-4">
          <FormCheckboxField form={form} name="form_categories" label="Phom dáng" data={courseFormOptions} />
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
  )
}
