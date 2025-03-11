'use client'

import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { getValuable } from '@/lib/utils'
import { Form } from '@/components/ui/form'
import { MainButton } from '@/components/buttons/main-button'
import { FormTextField } from '@/components/forms/fields/form-text-field'
import { FormSelectField } from '@/components/forms/fields/form-select-field'
import { FormTextareaField } from '@/components/forms/fields/form-textarea-field'
import { FormMultiSelectField } from '@/components/forms/fields/form-multi-select-field'

const FormSchema = z.object({
  id: z.string().optional(),
  course_name: z.string().min(1, 'Course name is required'),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().min(1, 'Description is required'),
  equipment_ids: z.array(z.string()).min(1, 'Equipment is required'),
  muscle_group_ids: z.array(z.string()).min(1, 'Muscle group is required'),
  trainer_id: z.string().min(1, 'Trainer is required'),
  membership_id: z.string().optional(),
})

type FormData = z.infer<typeof FormSchema>

interface CreateContactFormProps {
  data?: any
  isEdit?: boolean
  onSuccess?: () => void
}

const trainers = [
  {
    value: '1',
    label: 'Chris Bumstead',
  },
  {
    value: '2',
    label: 'Ramon Dino',
  },
  {
    value: '3',
    label: 'Wesley Vissers',
  },
  {
    value: '4',
    label: 'Hadi Choopan',
  },
]

const equipments = [
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

const muscleGroups = [
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

const memberships = [
  {
    value: '1',
    label: 'Free',
  },
  {
    value: '2',
    label: 'Paid',
  },
  {
    value: '3',
    label: 'Pro',
  },
]

function EditClassForm({ data, isEdit = false, onSuccess }: CreateContactFormProps) {
  // const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: data ? { ...data } : undefined,
  })
  const mutation = useMutation({
    // mutationFn: isEdit ? (_data: FormData) => console.log('update', data?.id as string, _data) : console.log('create'),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['salesReps'] });
      // toast.success(isEdit ? 'Contact has been updated' : 'Contact has been created')
      form.reset()
      // onSuccess()
    },
    onError: (err: any) => {
      // toast.error(err.error?.message || err.message || 'Contact has not been created')
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(getValuable(data))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormTextField form={form} name="course_name" label="Tên khoá" required placeholder="Nhập tên khoá học" />
          <FormSelectField form={form} name="trainer_id" label="HLV" options={trainers} placeholder="Chọn HLV" />
        </div>
        <FormTextareaField form={form} name="summary" label="Tóm tắt" required placeholder="Nhập tóm tắt" />
        <FormTextareaField form={form} name="description" label="Thông tin" required placeholder="Nhập thông tin" />
        <FormSelectField
          form={form}
          name="membership_id"
          label="Gói membership"
          options={memberships}
          placeholder="Chọn gói membership"
        />
        <MainButton text="Lưu" className="w-full" loading={mutation.isPending} />
        <FormMultiSelectField
          form={form}
          name="muscle_group_ids"
          label="Nội dung"
          options={muscleGroups}
          placeholder="Chọn nội dung"
        />
      </form>
    </Form>
  )
}

export { EditClassForm }
