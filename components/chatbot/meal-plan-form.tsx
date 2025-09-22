'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormNumberField, FormSelectField, FormTextareaField } from '../forms/fields'
import styles from './chatbot.module.css'

const mealFormSchema = z.object({
  age: z.number().min(1, 'Tuổi phải lớn hơn 1'),
  height: z.number().min(1, 'Chiều cao phải lớn hơn 1'),
  weight: z.number().min(1, 'Cân nặng phải lớn hơn 1'),
  goal: z.enum(['Giảm Cân', 'Giữ Cân', 'Tăng Cân'], {
    required_error: 'Vui lòng chọn mục tiêu',
  }),
  foodPreferences: z.string(),
  // foodPreferences: z.string().min(1, 'Vui lòng cho biết sở thích ăn uống'),
})

type MealPlanFormValues = z.infer<typeof mealFormSchema>

interface MealPlanForm {
  onSubmit: (msg: string) => void
  onCancel: () => void
}

export function MealPlanForm({ onSubmit, onCancel }: MealPlanForm) {
  const form = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      age: 0,
      height: 0,
      weight: 0,
      goal: undefined,
      foodPreferences: '',
    },
  })

  const handleSubmit = (data: MealPlanFormValues) => {
    const msg = `Lên thực đơn
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Mục tiêu: ${data.goal}
Sở thích ăn uống: ${data.foodPreferences}`
    onSubmit(msg)
  }

  return (
    <div className={`w-full max-h-full overflow-y-auto ${styles.promptsContainerScrollbar}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Thông tin lập thực đơn</h3>
        <p className="text-sm text-gray-600">Vui lòng điền đầy đủ thông tin để được tư vấn thực đơn phù hợp</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormNumberField name="age" form={form} label="Tuổi" placeholder="25" min={1} />
            <FormNumberField name="height" form={form} label="Chiều cao (cm)" placeholder="160" min={1} />
          </div>

          <FormNumberField name="weight" form={form} label="Cân nặng (kg)" placeholder="55" min={1} />

          <FormSelectField
            name="goal"
            form={form}
            label="Mục tiêu"
            placeholder="Chọn mục tiêu của bạn"
            data={[
              { value: 'Giảm Cân', label: 'Giảm Cân' },
              { value: 'Giữ Cân', label: 'Giữ Cân' },
              { value: 'Tăng Cân', label: 'Tăng Cân' },
            ]}
          />

          <FormTextareaField
            name="foodPreferences"
            form={form}
            label="Thích ăn gì"
            placeholder="Mô tả sở thích ăn uống, món ăn yêu thích, thực phẩm không thích hoặc dị ứng..."
            rows={4}
          />

          <div className="flex gap-3 pt-4">
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
