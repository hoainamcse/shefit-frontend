'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormMultiSelectField, FormNumberField, FormSelectField } from '../forms/fields'
import styles from './chatbot.module.css'

// Define enums for better type safety
const GoalOptions = {
  LOSE_WEIGHT: 'Giảm Cân',
  MAINTAIN_WEIGHT: 'Giữ Cân',
  GAIN_WEIGHT: 'Tăng Cân',
} as const

const PlanDaysOptions = {
  SEVEN: '7',
  FOURTEEN: '14',
  TWENTY_ONE: '21',
  TWENTY_EIGHT: '28',
} as const

// Food preferences as a constant
const FOOD_PREFERENCE_OPTIONS = [
  { value: 'Thịt Heo', label: 'Thịt Heo' },
  { value: 'Thịt Bò', label: 'Thịt Bò' },
  { value: 'Cá', label: 'Cá' },
  { value: 'Hải Sản', label: 'Hải Sản' },
  { value: 'Rau Xanh', label: 'Rau Xanh' },
  { value: 'Củ', label: 'Củ' },
  { value: 'Hạt', label: 'Hạt' },
  { value: 'Ngũ Cốc', label: 'Ngũ Cốc' },
  { value: 'Sữa', label: 'Sữa' },
  { value: 'Hạn Chế Tinh Bột', label: 'Hạn Chế Tinh Bột' },
  { value: 'Ăn tinh bột nhưng ít lại', label: 'Ăn tinh bột nhưng ít lại' },
]

const mealFormSchema = z.object({
  age: z.number({ invalid_type_error: 'Tuổi phải là số' }).min(18, 'Tuổi tối thiểu 18').max(80, 'Tuổi tối đa 80'),
  height: z
    .number({ invalid_type_error: 'Chiều cao phải là số' })
    .min(140, 'Chiều cao tối thiểu 140cm')
    .max(200, 'Chiều cao tối đa 200cm'),
  weight: z
    .number({ invalid_type_error: 'Cân nặng phải là số' })
    .min(40, 'Cân nặng tối thiểu 40kg')
    .max(150, 'Cân nặng tối đa 150kg'),
  goal: z.enum([GoalOptions.LOSE_WEIGHT, GoalOptions.MAINTAIN_WEIGHT, GoalOptions.GAIN_WEIGHT], {
    required_error: 'Vui lòng chọn mục tiêu',
  }),
  foodPreferences: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một sở thích ăn uống'),
  planDays: z.enum(
    [PlanDaysOptions.SEVEN, PlanDaysOptions.FOURTEEN, PlanDaysOptions.TWENTY_ONE, PlanDaysOptions.TWENTY_EIGHT],
    {
      required_error: 'Vui lòng chọn thời gian thực đơn',
    }
  ),
})

type MealPlanFormValues = z.infer<typeof mealFormSchema>

interface MealPlanFormProps {
  onSubmit: (msg: string) => void
  onCancel: () => void
}

// Define goal options as a constant
const goalOptions = [
  { value: GoalOptions.LOSE_WEIGHT, label: 'Giảm Cân' },
  { value: GoalOptions.MAINTAIN_WEIGHT, label: 'Giữ Cân' },
  { value: GoalOptions.GAIN_WEIGHT, label: 'Tăng Cân' },
]

// Define plan days options as a constant
const planDaysOptions = [
  { value: PlanDaysOptions.SEVEN, label: '7 ngày' },
  { value: PlanDaysOptions.FOURTEEN, label: '14 ngày' },
  { value: PlanDaysOptions.TWENTY_ONE, label: '21 ngày' },
  { value: PlanDaysOptions.TWENTY_EIGHT, label: '28 ngày' },
]

export function MealPlanForm({ onSubmit, onCancel }: MealPlanFormProps) {
  const form = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      age: 18,
      height: 140,
      weight: 40,
      goal: undefined,
      foodPreferences: [],
      planDays: undefined,
    },
  })

  const handleSubmit = (data: MealPlanFormValues) => {
    const msg = `Lên thực đơn
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Mục tiêu: ${data.goal}
Sở thích ăn uống: ${data.foodPreferences.join(', ')}
Thời gian thực đơn: ${data.planDays} ngày`
    onSubmit(msg)
  }

  return (
    <div className={`w-full max-h-full overflow-y-auto my-3 ${styles.promptsContainerScrollbar}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Thông tin lập thực đơn</h3>
        <p className="text-sm text-gray-600">Vui lòng điền đầy đủ thông tin để được tư vấn thực đơn phù hợp</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormNumberField name="age" form={form} label="Tuổi" placeholder="25" min={18} max={80} />
            <FormNumberField name="height" form={form} label="Chiều cao (cm)" placeholder="160" min={140} max={200} />
          </div>

          <FormNumberField name="weight" form={form} label="Cân nặng (kg)" placeholder="55" min={40} max={150} />

          <FormSelectField
            name="goal"
            form={form}
            label="Mục tiêu"
            placeholder="Chọn mục tiêu của bạn"
            data={goalOptions}
          />

          <FormMultiSelectField
            name="foodPreferences"
            form={form}
            label="Thích ăn gì"
            placeholder="Chọn sở thích ăn uống của bạn"
            data={FOOD_PREFERENCE_OPTIONS}
          />

          <FormSelectField
            name="planDays"
            form={form}
            label="Plan thực đơn cho bao nhiêu ngày"
            placeholder="Chọn số ngày"
            data={planDaysOptions}
          />

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Gửi thông tin
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
