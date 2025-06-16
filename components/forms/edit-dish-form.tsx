'use client'

import type { Dish } from '@/models/dish'

import z from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createDish, updateDish } from '@/network/client/dishes'
import { MainButton } from '@/components/buttons/main-button'
import { Form } from '@/components/ui/form'

import { FormInputField, FormNumberField, FormTextareaField } from './fields'
import { DietsTable } from '../data-table/diets-table'
import { EditDialog } from '../data-table/edit-dialog'
import { ImageUploader } from '../image-uploader'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

// ! Follow DishPayload model in models/dish.ts
export const formSchema = z.object({
  name: z.string().min(1, 'Tên món ăn không được để trống'),
  description: z.string(),
  diet_id: z.number().nullable(),
  image: z.string().url(),
  youtube_url: z.string().url('Link Youtube không hợp lệ'),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carb: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0),
})

export type FormValue = z.infer<typeof formSchema>

type EditDishFormProps = {
  data: Dish | null
  onSuccess?: () => void
}

export function EditDishForm({ data, onSuccess }: EditDishFormProps) {
  const isEdit = !!data
  const defaultValue = {
    name: '',
    description: '',
    diet_id: null,
    image: 'https://placehold.co/600x400?text=example',
    youtube_url: '',
    calories: 0,
    protein: 0,
    carb: 0,
    fat: 0,
    fiber: 0,
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          description: data.description,
          diet_id: data.diet?.id || null,
          image: data.image,
          youtube_url: data.youtube_url,
          calories: data.calories,
          protein: data.protein,
          carb: data.carb,
          fat: data.fat,
          fiber: data.fiber,
        }
      : defaultValue,
  })

  const dishMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateDish(data.id, values) : createDish(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật món ăn thành công' : 'Tạo món ăn thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    dishMutation.mutate(values)
  }

  const [openDietsTable, setOpenDietsTable] = useState(false)
  const [selectedDiet, setSelectedDiet] = useState(data?.diet || null)

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInputField form={form} name="name" label="Tên món ăn" withAsterisk placeholder="Nhập tên món ăn" />
          <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
          <div className="space-y-2">
            <Label>Chế độ ăn</Label>
            <Input
              value={selectedDiet ? `${selectedDiet.name}` : ''}
              onFocus={() => setOpenDietsTable(true)}
              placeholder="Chọn chế độ ăn"
              readOnly
            />
          </div>
          <ImageUploader form={form} name="image" label="Hình ảnh" accept={{ 'image/*': [] }} maxFileCount={1} />
          <FormInputField form={form} name="youtube_url" label="Link Youtube" placeholder="Nhập link Youtube" />

          <div className="grid grid-cols-2 gap-4">
            <FormNumberField form={form} name="calories" label="Calories (kcal)" placeholder="e.g., 250" />
            <FormNumberField form={form} name="protein" label="Protein (g)" step="0.1" placeholder="e.g., 20" />
            <FormNumberField form={form} name="carb" label="Carbs (g)" step="0.1" placeholder="e.g., 30" />
            <FormNumberField form={form} name="fat" label="Fat (g)" step="0.1" placeholder="e.g., 10" />
            <FormNumberField form={form} name="fiber" label="Fiber (g)" step="0.1" placeholder="e.g., 5" />
          </div>
          <div className="flex justify-end">
            {(!isEdit || (isEdit && form.formState.isDirty)) && (
              <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={dishMutation.isPending} />
            )}
          </div>
        </form>
      </Form>
      <EditDialog
        title="Chọn Chế độ ăn"
        description="Chọn một chế độ ăn đã có hoặc tạo mới để liên kết với món ăn này."
        open={openDietsTable}
        onOpenChange={setOpenDietsTable}
      >
        <DietsTable
          onConfirmRowSelection={(row) => {
            if (row.length > 1) {
              toast.error('Vui lòng chỉ chọn một chế độ ăn')
              return
            }
            setSelectedDiet(row[0])
            form.setValue('diet_id', row[0].id, { shouldDirty: true })
            form.trigger('diet_id')
            setOpenDietsTable(false)
          }}
        />
      </EditDialog>
    </>
  )
}
