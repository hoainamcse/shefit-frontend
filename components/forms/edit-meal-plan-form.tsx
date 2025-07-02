'use client'

import type { MealPlan } from '@/models/meal-plan'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { createMealPlan, updateMealPlan } from '@/network/client/meal-plans'
import { FormInputField, FormNumberField, FormSwitchField, FormTextareaField } from './fields'
import { CaloriesTable } from '../data-table/calories-table'
import { EditDialog } from '../data-table/edit-dialog'
import { DietsTable } from '../data-table/diets-table'
import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Form } from '../ui/form'
import { CoverMediaSelector } from './cover-media-selector'
import { ImageUploader } from '../image-uploader'
import { GoalTable } from '../data-table/goal-table'

// ! Follow MealPlanPayload model in models/meal-plan.ts
const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề thực đơn không được để trống'),
  subtitle: z.string(),
  chef_name: z.string(),
  meal_plan_goal_id: z.number().nullable(),
  image: z.string().url(),
  youtube_url: z.string().url().optional(),
  description: z.string(),
  meal_ingredients: z.array(
    z.object({
      name: z.string().min(1),
      image: z.string().url(),
    })
  ),
  is_public: z.boolean(),
  is_free: z.boolean(),
  free_days: z.number().min(0),
  diet_id: z.coerce.number().nullable(),
  calorie_id: z.coerce.number().nullable(),
  description_homepage_1: z.string(),
  description_homepage_2: z.string(),
  image_homepage: z.string().url(),
})

type FormValue = z.infer<typeof formSchema>

interface EditMealPlanFormProps {
  data?: MealPlan
  onSuccess?: (data: MealPlan) => void
}

const defaultImageUrl = 'https://placehold.co/600x400?text=example'
const defaultYoutubeUrl = 'https://www.youtube.com/'

export function EditMealPlanForm({ data, onSuccess }: EditMealPlanFormProps) {
  const isEdit = !!data
  const defaultValue = {
    title: '',
    subtitle: '',
    chef_name: '',
    meal_plan_goal_id: null,
    image: defaultImageUrl,
    youtube_url: defaultYoutubeUrl,

    description: '',
    meal_ingredients: [],
    is_public: true,
    is_free: false,
    free_days: 0,
    calorie_id: null,
    diet_id: null,
    description_homepage_1: '',
    description_homepage_2: '',
    image_homepage: defaultImageUrl,
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? (() => {
          const isYoutube = typeof data.image === 'string' && data.image.includes('youtube.com')
          return {
            title: data.title,
            subtitle: data.subtitle,
            chef_name: data.chef_name,
            meal_plan_goal_id: data.meal_plan_goal?.id || null,
            image: isYoutube ? defaultImageUrl : data.image,
            youtube_url: isYoutube ? data.image : defaultYoutubeUrl,
            description: data.description,
            meal_ingredients: data.meal_ingredients,
            is_public: data.is_public,
            is_free: data.is_free,
            free_days: data.free_days,
            calorie_id: data.calorie?.id || null,
            diet_id: data.diet?.id || null,
            description_homepage_1: data.description_homepage_1,
            description_homepage_2: data.description_homepage_2,
            image_homepage: isYoutube ? defaultImageUrl : data.image_homepage,
          }
        })()
      : defaultValue,
  })

  const [showYoutubeUrlInput, setShowYoutubeUrlInput] = useState(
    isEdit && data?.image?.includes('youtube.com') ? true : false
  )

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'meal_ingredients',
  })

  const mealPlanMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateMealPlan(data.id, values) : createMealPlan(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật thực đơn thành công' : 'Tạo thực đơn thành công')
        onSuccess?.(data.data)
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    if (showYoutubeUrlInput && values.youtube_url) {
      const { youtube_url, ...submitValues } = values
      mealPlanMutation.mutate({ ...submitValues, image: youtube_url })
    } else {
      mealPlanMutation.mutate(values)
    }
  }

  const [openCaloriesTable, setOpenCaloriesTable] = useState(false)
  const [openDietsTable, setOpenDietsTable] = useState(false)
  const [openGoalsTable, setOpenGoalsTable] = useState(false)
  const [selectedCalorie, setSelectedCalorie] = useState(data?.calorie || null)
  const [selectedDiet, setSelectedDiet] = useState(data?.diet || null)
  const [selectedGoal, setSelectedGoal] = useState(data?.meal_plan_goal || null)

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInputField form={form} name="title" label="Tên thực đơn" withAsterisk placeholder="Nhập tên thực đơn" />
          <FormTextareaField form={form} name="subtitle" label="Tóm tắt" placeholder="Nhập tóm tắt" />
          <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
          <CoverMediaSelector
            form={form}
            showYoutubeUrlInput={showYoutubeUrlInput}
            setShowYoutubeUrlInput={setShowYoutubeUrlInput}
            coverImageName="image"
            youtubeUrlName="youtube_url"
          />
          <FormTextareaField
            form={form}
            name="description_homepage_1"
            label="Mô tả homepage 1"
            placeholder="Nhập mô tả"
          />
          <FormTextareaField
            form={form}
            name="description_homepage_2"
            label="Mô tả homepage 2"
            placeholder="Nhập mô tả"
          />
          <ImageUploader
            form={form}
            name="image_homepage"
            label="Hình ảnh homepage"
            accept={{ 'image/*': [] }}
            maxFileCount={1}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInputField form={form} name="chef_name" label="Tên đầu bếp" placeholder="Nhập tên đầu bếp" />
            <div className="space-y-2">
              <Label>Mục tiêu</Label>
              <Input
                value={selectedGoal ? `${selectedGoal.name}` : ''}
                onFocus={() => setOpenGoalsTable(true)}
                placeholder="Chọn mục tiêu"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chế độ ăn</Label>
              <Input
                value={selectedDiet ? `${selectedDiet.name}` : ''}
                onFocus={() => setOpenDietsTable(true)}
                placeholder="Chọn chế độ ăn"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Calorie</Label>
              <Input
                value={selectedCalorie ? `${selectedCalorie.name}` : ''}
                onFocus={() => setOpenCaloriesTable(true)}
                placeholder="Chọn calorie"
                readOnly
              />
            </div>
          </div>
          <div className="border border-dashed p-4 rounded-md space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Thành phần nguyên liệu</Label>
              <AddButton
                size="sm"
                type="button"
                variant="outline"
                text="Thêm nguyên liệu"
                onClick={() => append({ name: '', image: 'https://placehold.co/600x400?text=example' })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-ring border-dashed rounded-md space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Nguyên liệu {index + 1}</Label>
                    <MainButton
                      size="icon"
                      variant="outline"
                      icon={Trash2Icon}
                      onClick={() => remove(index)}
                      className="hover:text-destructive"
                    />
                  </div>
                  <div className="space-y-4">
                    <FormInputField
                      form={form}
                      name={`meal_ingredients.${index}.name`}
                      label={`Tên nguyên liệu`}
                      placeholder="Nhập tên nguyên liệu"
                      withAsterisk
                    />

                    <ImageUploader
                      form={form}
                      name={`meal_ingredients.${index}.image`}
                      label={`Hình ảnh`}
                      accept={{ 'image/*': [] }}
                      maxFileCount={1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormSwitchField
              form={form}
              name="is_public"
              label="Công khai"
              description="Bật khi muốn thực đơn này hiển thị công khai"
            />
            <FormSwitchField
              form={form}
              name="is_free"
              label="Miễn phí"
              description="Bật khi muốn thực đơn này miễn phí cho người dùng"
            />
            <FormNumberField form={form} name="free_days" label="Số ngày miễn phí" placeholder="e.g., 10" />
          </div>
          <div className="flex justify-end">
            {(!isEdit || (isEdit && form.formState.isDirty)) && (
              <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={mealPlanMutation.isPending} />
            )}
          </div>
        </form>
      </Form>
      <EditDialog
        title="Chọn Chế độ ăn"
        description="Chọn một chế độ ăn đã có hoặc tạo mới để liên kết với thực đơn này."
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
      <EditDialog
        title="Chọn Calorie"
        description="Chọn một calorie đã có hoặc tạo mới để liên kết với thực đơn này."
        open={openCaloriesTable}
        onOpenChange={setOpenCaloriesTable}
      >
        <CaloriesTable
          onConfirmRowSelection={(row) => {
            if (row.length > 1) {
              toast.error('Vui lòng chỉ chọn một calorie')
              return
            }
            setSelectedCalorie(row[0])
            form.setValue('calorie_id', row[0].id, { shouldDirty: true })
            form.trigger('calorie_id')
            setOpenCaloriesTable(false)
          }}
        />
      </EditDialog>
      <EditDialog
        title="Chọn Mục tiêu"
        description="Chọn một mục tiêu đã có hoặc tạo mới để liên kết với thực đơn này."
        open={openGoalsTable}
        onOpenChange={setOpenGoalsTable}
      >
        <GoalTable
          onConfirmRowSelection={(row) => {
            if (row.length > 1) {
              toast.error('Vui lòng chỉ chọn một mục tiêu')
              return
            }
            setSelectedGoal(row[0])
            form.setValue('meal_plan_goal_id', row[0].id, { shouldDirty: true })
            form.trigger('meal_plan_goal_id')
            setOpenGoalsTable(false)
          }}
        />
      </EditDialog>
    </>
  )
}
