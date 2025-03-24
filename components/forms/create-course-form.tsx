'use client'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useActionState, useTransition } from 'react'
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
import { createCourse } from '@/network/server/courses'
import { DIFFICULTY_LEVEL_OPTIONS, FORM_CATEGORY_OPTIONS } from '@/lib/label'
import type { Course, CourseFormat } from '@/models/course'

const formSchema = z.object({
  id: z.number().int().optional(),
  course_name: z.string().min(1, { message: 'Course name is required' }),
  course_format: z.string(),
  summary: z.string().min(30, { message: 'Summary must be at least 30 characters' }),
  description: z.string().min(30, { message: 'Description must be at least 30 characters' }),
  trainer: z.string().min(1, { message: 'Trainer is required' }),
  form_categories: z.array(z.string()).nonempty(),
  difficulty_level: z.string(),
  visible_in: z.array(z.string()),
  cover_image: z.string(),
  thumbnail_image: z.string(),
  equipment_ids: z.array(z.string()).nonempty(),
  muscle_group_ids: z.array(z.string()).nonempty(),
  is_public: z.boolean(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

type FormData = z.infer<typeof formSchema>
interface CreateCourseFormProps {
  data?: Course
  format: CourseFormat
  onSuccess?: () => void
}

export const equipments = [
  {
    value: '1',
    label: 'Dumbbell',
  },
]

export const muscleGroups = [
  {
    value: '1',
    label: 'Triceps',
  },
]

function CreateCourseForm({ data, format, onSuccess }: CreateCourseFormProps) {
  const [isPending, startTransition] = useTransition()
  // const [state, action, isPending] = useActionState(createCourse, null)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
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
      is_public: true,
    },
  })

  function onSubmit(data: FormData) {
    startTransition(async () => {
      await createCourse(data as Omit<Course, 'id' | 'created_at' | 'updated_at'>)
      toast.success('Tạo khoá học thành công')
      onSuccess?.()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInputField
            form={form}
            name="course_name"
            label="Tên khoá"
            withAsterisk
            placeholder="Nhập tên khoá học"
          />
          <FormInputField form={form} name="trainer" label="HLV" withAsterisk placeholder="Nhập tên HLV" />
        </div>
        <FormTextareaField form={form} name="summary" label="Tóm tắt" withAsterisk placeholder="Nhập tóm tắt" />
        <FormTextareaField form={form} name="description" label="Thông tin" withAsterisk placeholder="Nhập thông tin" />
        <FormMultiSelectField
          form={form}
          name="equipment_ids"
          label="Dụng cụ"
          data={equipments}
          placeholder="Chọn dụng cụ"
        />
        <FormMultiSelectField
          form={form}
          name="muscle_group_ids"
          label="Nhóm cơ"
          data={muscleGroups}
          placeholder="Chọn nhóm cơ"
        />
        <div className="grid grid-cols-3 gap-4">
          <FormCheckboxField
            form={form}
            name="form_categories"
            label="Dáng"
            withAsterisk
            data={FORM_CATEGORY_OPTIONS}
          />
          <FormRadioField
            form={form}
            name="difficulty_level"
            label="Độ khó"
            withAsterisk
            data={DIFFICULTY_LEVEL_OPTIONS}
          />
          <FormSwitchField form={form} name="is_public" label="Hiển thị" withAsterisk />
        </div>
        <div className="space-y-4">
          <Label>Hình khoá</Label>
          <FileUploader />
        </div>
        <div className="space-y-4">
          <Label>Hình đại diện khoá</Label>
          <FileUploader />
        </div>
        {!data && <MainButton text="Lưu" className="w-full" loading={isPending} />}
      </form>
    </Form>
  )
}

export { CreateCourseForm }
