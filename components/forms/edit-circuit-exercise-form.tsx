'use client'

import type { Course, CircuitExercise, CourseWeek, DayCircuit, WeekDay } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { updateDayCircuit } from '@/network/client/courses'

import { FormInputField, FormNumberField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// ! Follow CircuitExercisePayload model in models/course.ts
const formSchema = z.object({
  id: z.number().optional(),
  circuit_exercise_title: z.string().min(1, 'Tiêu đề bài tập không được để trống'),
  circuit_exercise_description: z.string(),
  youtube_url: z.string().url('Link Youtube không hợp lệ'),
  no: z.number().min(0),
})

type FormValue = z.infer<typeof formSchema>

interface EditCircuitExerciseFormProps {
  data: DayCircuit | null
  onSuccess?: () => void
  courseID: Course['id']
  weekID: CourseWeek['id']
  dayID: WeekDay['id']
  exerciseID: CircuitExercise['id'] | null
}

export function EditCircuitExerciseForm({
  data,
  onSuccess,
  courseID,
  weekID,
  dayID,
  exerciseID,
}: EditCircuitExerciseFormProps) {
  if (!data) {
    return <div>Không có dữ liệu</div>
  }

  const isEdit = !!exerciseID
  const defaultValue = {
    circuit_exercise_title: '',
    circuit_exercise_description: '',
    youtube_url: '',
    no: 0,
  } as FormValue

  const exerciseIndex = data.circuit_exercises.findIndex((exercise) => exercise.id === exerciseID)

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit ? data.circuit_exercises[exerciseIndex] || defaultValue : defaultValue,
  })

  const dayCircuitMutation = useMutation({
    mutationFn: (values: FormValue) => {
      let dataToUpdate = [...data.circuit_exercises]
      if (isEdit) {
        dataToUpdate = dataToUpdate.filter((exercise) => exercise.id !== exerciseID)
      }
      return updateDayCircuit(courseID, weekID, dayID, data.id, {
        ...data,
        circuit_exercises: [...dataToUpdate, values],
      })
    },
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật bài tập thành công' : 'Tạo bài tập thành công')
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
        <FormInputField
          form={form}
          name="circuit_exercise_title"
          label="Tiêu đề bài tập"
          placeholder="Nhập tiêu đề bài tập"
          withAsterisk
        />
        <FormTextareaField form={form} name="circuit_exercise_description" label="Mô tả" placeholder="Nhập mô tả" />
        <FormInputField
          form={form}
          name="youtube_url"
          label="Link Youtube"
          placeholder="Nhập tên youtube"
          withAsterisk
        />
        <FormNumberField form={form} name="no" label="Số lần phát lại" placeholder="Nhập số lần phát lại" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={dayCircuitMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
