'use client'

import type { Course, CourseWeek, DayCircuit, WeekDay } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createDayCircuit, updateDayCircuit } from '@/network/client/courses'

import { FormInputField, FormNumberField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// ! Follow DayCircuitPayload model in models/course.ts
const formSchema = z.object({
  name: z.string().min(1, 'Tên circuit không được để trống'),
  description: z.string(),
  auto_replay_count: z.number().min(0),
  circuit_exercises: z.array(z.any()),
})

type FormValue = z.infer<typeof formSchema>

interface EditDayCircuitFormProps {
  data: DayCircuit | null
  onSuccess?: () => void
  courseID: Course['id']
  weekID: CourseWeek['id']
  dayID: WeekDay['id']
}

export function EditDayCircuitForm({ data, onSuccess, courseID, weekID, dayID }: EditDayCircuitFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '', description: '', auto_replay_count: 0, circuit_exercises: [] } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          description: data.description,
          auto_replay_count: data.auto_replay_count,
          circuit_exercises: data.circuit_exercises.map((exercise) => ({
            circuit_exercise_title: exercise.circuit_exercise_title,
            circuit_exercise_description: exercise.circuit_exercise_description,
            youtube_url: exercise.youtube_url,
            no: exercise.no,
          })),
        }
      : defaultValue,
  })

  const dayCircuitMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit
        ? updateDayCircuit(courseID, weekID, dayID, data.id, values)
        : createDayCircuit(courseID, weekID, dayID, values),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật circuit thành công' : 'Tạo circuit thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    dayCircuitMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="name" label="Tên circuit" placeholder="Nhập tên circuit" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <FormNumberField
          form={form}
          name="auto_replay_count"
          label="Số lần phát lại"
          placeholder="Nhập số lần phát lại"
        />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={dayCircuitMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
