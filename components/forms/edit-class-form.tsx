'use client'

import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getValuable } from '@/lib/utils'
import { Form } from '@/components/ui/form'
import { MainButton } from '@/components/buttons/main-button'
import { FormTextField } from '@/components/forms/fields/form-text-field'
import { FormTextareaField } from '@/components/forms/fields/form-textarea-field'
import { FormMultiSelectField } from '@/components/forms/fields/form-multi-select-field'
import { FormCheckboxField } from '@/components/forms/fields/form-checkbox-field'
import { FormRadioField } from '@/components/forms/fields/form-radio-field'
import { FileUploader } from '../file-uploader'
import { Label } from '../ui/label'

const FormSchema = z.object({
  course_name: z.string().min(2, {
    message: 'Tên khóa học phải có ít nhất 2 ký tự',
  }),
  course_format: z.enum(['video', 'live']),
  summary: z.string().min(2, {
    message: 'Tóm tắt phải có ít nhất 2 ký tự',
  }),
  description: z.string().min(2, {
    message: 'Mô tả phải có ít nhất 2 ký tự',
  }),
  trainer: z.string().min(2, {
    message: 'HLV phải có ít nhất 2 ký tự',
  }),
  form_category: z.array(z.enum(['pear', 'apple', 'rectangle', 'hourglass', 'inverted_triangle'])),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  cover_image: z.string(),
  thumbnail_image: z.string(),
  equipment_ids: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'Bạn phải chọn ít nhất 1 loại dụng cụ',
  }),
  muscle_group_ids: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'Bạn phải chọn ít nhất 1 nhóm cơ',
  }),
})

type FormData = z.infer<typeof FormSchema>

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

const difficultyLevels = [
  {
    value: 'beginner',
    label: 'Beginner',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
  },
  {
    value: 'advanced',
    label: 'Advanced',
  },
]

const formCategories = [
  {
    value: 'pear',
    label: 'Dáng quả lê',
  },
  {
    value: 'apple',
    label: 'Dáng quả táo',
  },
  {
    value: 'rectangle',
    label: 'Dáng chữ nhật',
  },
  {
    value: 'hourglass',
    label: 'Dáng đồng hồ cát',
  },
  {
    value: 'inverted_triangle',
    label: 'Dáng tam giác ngược',
  },
]

function EditClassForm({ data, isEdit = false, onSuccess }: CreateContactFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: data ? { ...data } : undefined,
  })

  const onSubmit = (data: FormData) => {
    console.log(getValuable(data))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormTextField form={form} name="course_name" label="Tên khoá" required placeholder="Nhập tên khoá học" />
          <FormTextField form={form} name="trainer" label="HLV" required placeholder="Nhập tên HLV" />
        </div>
        <FormTextareaField form={form} name="summary" label="Tóm tắt" required placeholder="Nhập tóm tắt" />
        <FormTextareaField form={form} name="description" label="Thông tin" required placeholder="Nhập thông tin" />
        <FormMultiSelectField
          form={form}
          name="equipment_ids"
          label="Dụng cụ"
          options={equipments}
          placeholder="Chọn dụng cụ"
        />
        <FormMultiSelectField
          form={form}
          name="muscle_group_ids"
          label="Nhóm cơ"
          options={muscleGroups}
          placeholder="Chọn nhóm cơ"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormCheckboxField form={form} name="form_category" label="Dáng" required data={formCategories} />
          <FormRadioField form={form} name="difficulty_level" label="Độ khó" required data={difficultyLevels} />
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
