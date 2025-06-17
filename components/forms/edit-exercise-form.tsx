'use client'

import type { Exercise } from '@/models/exercise'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createExercise, updateExercise } from '@/network/client/exercises'

import { MuscleGroupsTable } from '../data-table/muscle-groups-table'
import { EquipmentsTable } from '../data-table/equipments-table'
import { FormInputField, FormTextareaField } from './fields'
import { EditDialog } from '../data-table/edit-dialog'
import { MainButton } from '../buttons/main-button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Form } from '../ui/form'

// ! Follow ExercisePayload model in models/exercise.ts
const formSchema = z.object({
  name: z.string().min(1, 'Tên bài tập không được để trống'),
  description: z.string(),
  youtube_url: z.string().url('Link Youtube không hợp lệ'),
  muscle_group_ids: z.array(z.string()),
  equipment_ids: z.array(z.string()),
})

type FormValue = z.infer<typeof formSchema>

interface EditExerciseFormProps {
  data: Exercise | null
  onSuccess?: () => void
}

export function EditExerciseForm({ data, onSuccess }: EditExerciseFormProps) {
  const isEdit = !!data
  const defaultValue = {
    name: '',
    description: '',
    youtube_url: '',
    muscle_group_ids: [],
    equipment_ids: [],
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          description: data.description,
          youtube_url: data.youtube_url,
          muscle_group_ids: data.muscle_groups.map((mg) => mg.id.toString()),
          equipment_ids: data.equipments.map((e) => e.id.toString()),
        }
      : defaultValue,
  })

  const exerciseMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateExercise(data.id, values) : createExercise(values)),
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
    exerciseMutation.mutate(values)
  }

  const [openMuscleGroupsTable, setOpenMuscleGroupsTable] = useState(false)
  const [openEquipmentsTable, setOpenEquipmentsTable] = useState(false)
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState(data?.muscle_groups || [])
  const [selectedEquipments, setSelectedEquipments] = useState(data?.equipments || [])

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInputField form={form} name="name" label="Tên bài tập" withAsterisk placeholder="Nhập tên bài tập" />
          <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
          <div className="space-y-2">
            <Label>Nhóm cơ</Label>
            <Input
              value={selectedMuscleGroups.map((mg) => mg.name).join(', ')}
              onFocus={() => setOpenMuscleGroupsTable(true)}
              placeholder="Chọn nhóm cơ"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label>Dụng cụ</Label>
            <Input
              value={selectedEquipments.map((e) => e.name).join(', ')}
              onFocus={() => setOpenEquipmentsTable(true)}
              placeholder="Chọn dụng cụ"
              readOnly
            />
          </div>
          <FormInputField form={form} name="youtube_url" label="Link Youtube" placeholder="Nhập link Youtube" />
          <div className="flex justify-end">
            {(!isEdit || (isEdit && form.formState.isDirty)) && (
              <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={exerciseMutation.isPending} />
            )}
          </div>
        </form>
      </Form>
      <EditDialog
        title="Chọn Nhóm Cơ"
        description="Chọn một hoặc nhiều nhóm cơ đã có hoặc tạo mới để liên kết với bài tập này."
        open={openMuscleGroupsTable}
        onOpenChange={setOpenMuscleGroupsTable}
      >
        <MuscleGroupsTable
          onConfirmRowSelection={(row) => {
            setSelectedMuscleGroups(row)
            form.setValue(
              'muscle_group_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('muscle_group_ids')
            setOpenMuscleGroupsTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Dụng Cụ"
        description="Chọn một hoặc nhiều dụng cụ đã có hoặc tạo mới để liên kết với bài tập này."
        open={openEquipmentsTable}
        onOpenChange={setOpenEquipmentsTable}
      >
        <EquipmentsTable
          onConfirmRowSelection={(row) => {
            setSelectedEquipments(row)
            form.setValue(
              'equipment_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('equipment_ids')
            setOpenEquipmentsTable(false)
          }}
        />
      </EditDialog>
    </>
  )
}
