'use client'

import { Exercise } from '@/models/exercies'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'
import { FormInputField, FormMultiSelectField, FormTextareaField } from './fields'
import { z } from 'zod'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Equipment } from '@/models/equipments'
import { MuscleGroup } from '@/models/muscle-group'
import { getEquipments } from '@/network/server/equipments'
import { getMuscleGroups } from '@/network/server/muscle-group'
import { createExercise, updateExercise } from '@/network/server/exercise'
import { toast } from 'sonner'

const exerciseSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên bài tập'),
  description: z.string().min(1, 'Vui lòng nhập mô tả'),
  youtube_url: z.string().url('Vui lòng nhập một URL hợp lệ').optional(),
  equipment_ids: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một dụng cụ'),
  muscle_group_ids: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một nhóm cơ'),
  thumbnail_image: z.string().nullable().optional(),
  cover_image: z.string().nullable().optional(),
})

type ExerciseFormData = z.infer<typeof exerciseSchema>

interface CreateExerciseFormProps {
  data?: Exercise
  isEdit: boolean
}

export default function CreateExerciseForm({ data, isEdit }: CreateExerciseFormProps) {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: data
      ? {
          name: data.name,
          description: data.description,
          youtube_url: data.youtube_url,
          equipment_ids: data.equipments.map((equipment) => equipment.id.toString()),
          muscle_group_ids: data.muscle_groups.map((muscleGroup) => muscleGroup.id.toString()),
          thumbnail_image: data.thumbnail_image,
          cover_image: data.cover_image,
        }
      : {
          name: '',
          description: '',
          youtube_url: '',
          equipment_ids: [],
          muscle_group_ids: [],
          thumbnail_image: '',
          cover_image: '',
        },
  })

  const AVAILABLE_EQUIPMENTS = useMemo(
    () => equipments.map((equipment) => ({ value: equipment.id.toString(), label: equipment.name })),
    [equipments]
  )

  const AVAILABLE_MUSCLE_GROUPS = useMemo(
    () => muscleGroups.map((muscleGroup) => ({ value: muscleGroup.id.toString(), label: muscleGroup.name })),
    [muscleGroups]
  )

  const fetchEquipments = async () => {
    const response = await getEquipments()
    setEquipments(response.data || [])
  }

  const fetchMuscleGroups = async () => {
    const response = await getMuscleGroups()
    setMuscleGroups(response.data || [])
  }

  useEffect(() => {
    fetchEquipments()
    fetchMuscleGroups()
  }, [])

  function onSubmit(values: ExerciseFormData) {
    startTransition(() => {
      ;(async () => {
        try {
          // Convert string arrays to number arrays
          const formattedValues = {
            ...values,
            equipment_ids: values.equipment_ids.map((id) => Number(id)),
            muscle_group_ids: values.muscle_group_ids.map((id) => Number(id)),
          }

          if (isEdit && data) {
            const response = await updateExercise(data.id, formattedValues)
            if (response.status === 'success') toast.success('Cập nhật bài tập thành công')
            router.refresh()
          } else {
            const response = await createExercise(formattedValues)
            if (response.status === 'success') toast.success('Tạo bài tập thành công')
            router.push('/admin/exercises')
          }
        } catch (error) {
          console.error('Error creating/updating exercise:', error)
          toast.error('Tạo bài tập thất bại')
        }
      })()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên bài tập" />
        <FormTextareaField form={form} name="description" label="Thông tin" />
        <FormMultiSelectField
          form={form}
          name="equipment_ids"
          label="Dụng cụ"
          data={AVAILABLE_EQUIPMENTS}
          placeholder="Chọn dụng cụ"
        />
        <FormMultiSelectField
          form={form}
          name="muscle_group_ids"
          label="Nhóm cơ"
          data={AVAILABLE_MUSCLE_GROUPS}
          placeholder="Chọn nhóm cơ"
        />
        <FormInputField form={form} name="youtube_url" label="Link Youtube" placeholder="Nhập link Youtube" />
        <MainButton text={isEdit ? 'Cập nhật' : 'Tạo'} className="w-full" loading={isPending} />
      </form>
    </Form>
  )
}
