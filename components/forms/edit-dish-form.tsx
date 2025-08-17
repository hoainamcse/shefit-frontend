'use client'

import type { Dish } from '@/models/dish'

import z from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { CoverMediaSelector } from './cover-media-selector'

// ! Follow DishPayload model in models/dish.ts
export const formSchema = z.object({
  name: z.string().min(1, 'Tên món ăn không được để trống'),
  description: z.string(),
  diet_id: z.coerce.number().nullable(),
  image: z.string().url(),
  youtube_url: z.string().url().optional(),
  nutrients: z.string(),
})

export type FormValue = z.infer<typeof formSchema>

type EditDishFormProps = {
  data: Dish | null
  onSuccess?: () => void
}

const defaultImageUrl = 'https://placehold.co/400?text=shefit.vn&font=Oswald'
const defaultYoutubeUrl = 'https://www.youtube.com/'

export function EditDishForm({ data, onSuccess }: EditDishFormProps) {
  const isEdit = !!data
  const defaultValue = {
    name: '',
    description: '',
    diet_id: null,
    image: defaultImageUrl,
    youtube_url: defaultYoutubeUrl,
    nutrients: '',
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? (() => {
          const isYoutube = typeof data.image === 'string' && data.image.includes('youtube.com')
          return {
            name: data.name,
            description: data.description,
            diet_id: data.diet?.id || null,
            image: isYoutube ? defaultImageUrl : data.image,
            youtube_url: isYoutube ? data.image : defaultYoutubeUrl,
            nutrients: data.nutrients,
          }
        })()
      : defaultValue,
  })

  const [showYoutubeUrlInput, setShowYoutubeUrlInput] = useState(
    isEdit && data?.image?.includes('youtube.com') ? true : false
  )

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
    if (showYoutubeUrlInput && values.youtube_url) {
      const { youtube_url, ...submitValues } = values
      dishMutation.mutate({ ...submitValues, image: youtube_url })
    } else {
      dishMutation.mutate(values)
    }
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
          <CoverMediaSelector
            form={form}
            showYoutubeUrlInput={showYoutubeUrlInput}
            setShowYoutubeUrlInput={setShowYoutubeUrlInput}
            coverImageName="image"
            youtubeUrlName="youtube_url"
          />
          <FormTextareaField form={form} name="nutrients" label="Dinh dưỡng" placeholder="Nhập dinh dưỡng" />
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
