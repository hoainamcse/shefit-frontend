'use client'

import type { FormCategory } from '@/models/form-category'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { FormInputField } from './fields'
import { MainButton } from '../buttons/main-button'
import { WorkoutMethod } from '@/models/workout-method'
import { createWorkoutMethod, updateWorkoutMethod } from '@/network/client/workout-methods'

const formSchema = z.object({
  name: z.string().min(1, 'Tên loại hình tập luyện không được để trống'),
})

type FormValue = z.infer<typeof formSchema>

interface EditWorkoutMethodFormProps {
  data: WorkoutMethod | null
  onSuccess: () => void
}

export function EditWorkoutMethodForm({ data, onSuccess }: EditWorkoutMethodFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '' } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
        }
      : defaultValue,
  })

  const workoutMethodMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateWorkoutMethod(data.id, values) : createWorkoutMethod(values)),
    onSettled(data, error) {
      if (data) {
        toast.success(isEdit ? 'Cập nhật loại hình tập luyện thành công' : 'Tạo loại hình tập luyện thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    workoutMethodMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField
          form={form}
          name="name"
          label="Tên loại hình tập luyện"
          withAsterisk
          placeholder="Nhập tên loại hình tập luyện"
        />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={workoutMethodMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
