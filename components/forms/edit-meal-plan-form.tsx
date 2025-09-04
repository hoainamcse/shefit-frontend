'use client'

import type { MealPlan, MealPlanPayload } from '@/models/meal-plan'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createMealPlan, updateMealPlan } from '@/network/client/meal-plans'
import { Form } from '../ui/form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { AddButton } from '../buttons/add-button'
import { GoalTable } from '../data-table/goal-table'
import { EditSheet } from '../data-table/edit-sheet'
import { MainButton } from '../buttons/main-button'
import { EditDialog } from '../data-table/edit-dialog'
import { DietsTable } from '../data-table/diets-table'
import { CaloriesTable } from '../data-table/calories-table'
import { FormImageSelectField, FormInputField, FormNumberField, FormRichTextField, FormSwitchField, FormTextareaField } from './fields'

// ! Follow MealPlanPayload model in models/meal-plan.ts
const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề thực đơn không được để trống'),
  subtitle: z.string(),
  chef_name: z.string(),
  meal_plan_goal_id: z.number().nullable(),
  assets: z.object({
    thumbnail: z.string().url().optional(),
    mobile_cover: z.string().url().optional(),
    desktop_cover: z.string().url().optional(),
    youtube_cover: z.string().url().optional(),
    homepage_thumbnail: z.string().url().optional(),
  }),
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
  display_order: z.number().min(0),
})

type FormValue = z.infer<typeof formSchema>

interface EditMealPlanFormProps {
  data?: MealPlan
  onSuccess?: (data: MealPlan) => void
}

const DEFAULT_IMAGE_URL = 'https://placehold.co/400?text=shefit.vn&font=Oswald'
const DEFAULT_YOUTUBE_URL = 'https://youtu.be/EngW7tLk6R8?si=gesFcAqfOVJB3EMy'

export function EditMealPlanForm({ data, onSuccess }: EditMealPlanFormProps) {
  const isEdit = !!data
  const defaultValue = {
    title: '',
    subtitle: '',
    chef_name: '',
    meal_plan_goal_id: null,
    assets: {
      thumbnail: DEFAULT_IMAGE_URL,
      mobile_cover: DEFAULT_IMAGE_URL,
    },
    description: '',
    meal_ingredients: [],
    is_public: true,
    is_free: false,
    free_days: 0,
    diet_id: null,
    calorie_id: null,
    description_homepage_1: '',
    display_order: 1,
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: data.title,
          subtitle: data.subtitle,
          chef_name: data.chef_name,
          meal_plan_goal_id: data.meal_plan_goal?.id || null,
          assets: data.assets,
          description: data.description,
          meal_ingredients: data.meal_ingredients,
          is_public: data.is_public,
          is_free: data.is_free,
          free_days: data.free_days,
          calorie_id: data.calorie?.id || null,
          diet_id: data.diet?.id || null,
          description_homepage_1: data.description_homepage_1 || '',
          display_order: data.display_order || 0,
        }
      : defaultValue,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'meal_ingredients',
  })

  const mealPlanMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit ? updateMealPlan(data.id, values as MealPlanPayload) : createMealPlan(values as MealPlanPayload),
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
    mealPlanMutation.mutate(values)
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
          <div className="grid grid-cols-2 gap-4">
            <FormInputField
              form={form}
              name="title"
              label="Tên thực đơn"
              withAsterisk
              placeholder="Nhập tên thực đơn"
            />
            <FormNumberField form={form} name="display_order" label="Thứ tự hiển thị" placeholder="e.g., 10" />
          </div>

          <FormTextareaField form={form} name="subtitle" label="Tóm tắt" placeholder="Nhập tóm tắt" />
          <FormRichTextField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
          <FormTextareaField
            form={form}
            name="description_homepage_1"
            label="Mô tả homepage 1"
            placeholder="Nhập mô tả"
          />
          <EditMealPlanAssets form={form} />
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
                onClick={() => append({ name: '', image: 'https://placehold.co/400?text=shefit.vn&font=Oswald' })}
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

                    <FormImageSelectField
                      control={form.control}
                      name={`meal_ingredients.${index}.image`}
                      label={`Hình ảnh`}
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

function EditMealPlanAssets({ form }: { form: ReturnType<typeof useForm<FormValue>> }) {
  const [openEditSheet, setOpenEditSheet] = useState(false)
  return (
    <>
      <MainButton text="Assets của thực đơn" variant="outline" type="button" onClick={() => setOpenEditSheet(true)} />
      <EditSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        title="Chỉnh sửa thực đơn"
        description="Chỉnh sửa các thông tin liên quan đến thực đơn"
      >
        <div className="space-y-4">
          <FormImageSelectField control={form.control} name="assets.thumbnail" label="Hình ảnh đại diện" />
          <FormImageSelectField
            control={form.control}
            name="assets.homepage_thumbnail"
            label="Hình ảnh đại diện (Homepage)"
            description="Ảnh đại diện (mặc định) sẽ được sử dụng nếu không đặt"
          />
          <Separator />
          <FormImageSelectField control={form.control} name="assets.mobile_cover" label="Hình ảnh bìa (Mobile)" />
          <FormImageSelectField
            control={form.control}
            name="assets.desktop_cover"
            label="Hình ảnh bìa (Desktop)"
            description="Ảnh bìa mobile sẽ được sử dụng nếu không đặt"
          />
          <FormInputField
            form={form}
            name="assets.youtube_cover"
            label="Video bìa (YouTube)"
            placeholder="Nhập URL video YouTube"
            // defaultValue={DEFAULT_YOUTUBE_URL}
            description="Ảnh bìa mobile sẽ được sử dụng nếu không đặt"
          />
        </div>
      </EditSheet>
    </>
  )
}
