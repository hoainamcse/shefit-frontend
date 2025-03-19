'use client'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getValuable } from '@/lib/utils'
import { Form } from '@/components/ui/form'
import { MainButton } from '@/components/buttons/main-button'
import FormInputField from '@/components/forms/fields/form-input-field'
import FormTextareaField from '@/components/forms/fields/form-textarea-field'
import { FormMultiSelectField } from '@/components/forms/fields/form-multi-select-field'
import { FormCheckboxField } from '@/components/forms/fields/form-checkbox-field'
import { FormRadioField } from '@/components/forms/fields/form-radio-field'
import { FileUploader } from '@/components/file-uploader'
import { Label } from '@/components/ui/label'
import { useActionState, useTransition } from 'react'
import { createCourse } from '@/network/server/courses'
import { DIFFICULTY_LEVEL_OPTIONS, FORM_CATEGORY_OPTIONS } from '@/lib/label'

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
interface CreateContactFormProps {
  data?: any
  isEdit?: boolean
  onSuccess?: () => void
}

export const equipments = [
  {
    value: '1',
    label: 'Barbell',
  },
  {
    value: '2',
    label: 'Dumbbell',
  },
  {
    value: '3',
    label: 'Kettlebell',
  },
  {
    value: '4',
    label: 'Cable',
  },
  {
    value: '5',
    label: 'Machine',
  },
  {
    value: '6',
    label: 'Bodyweight',
  },
]

export const muscleGroups = [
  {
    value: '1',
    label: 'Chest',
  },
  {
    value: '2',
    label: 'Back',
  },
  {
    value: '3',
    label: 'Shoulders',
  },
  {
    value: '4',
    label: 'Legs',
  },
  {
    value: '5',
    label: 'Arms',
  },
  {
    value: '6',
    label: 'Abs',
  },
  {
    value: '7',
    label: 'Biceps',
  },
  {
    value: '8',
    label: 'Triceps',
  },
  {
    value: '9',
    label: 'Quads',
  },
]

function EditClassForm({ data, isEdit = false, onSuccess }: CreateContactFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course_name: '',
      course_format: 'video',
      summary: '',
      description: '',
      trainer: '',
      form_categories: [],
      // difficulty_level: '',
      visible_in: [],
      cover_image: '',
      thumbnail_image: '',
      equipment_ids: [],
      muscle_group_ids: [],
      is_public: false,
    },
  })

  function onSubmit(data: FormData) {
    console.log('Form submitted with data:', data)
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    )
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
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <div className="space-y-4">
          <Label>Hình khoá</Label>
          <FileUploader />
        </div>
        <div className="space-y-4">
          <Label>Hình đại diện khoá</Label>
          <FileUploader />
        </div>
        <MainButton text="Lưu" className="w-full" />
      </form>
    </Form>
  )
}

export { EditClassForm }
