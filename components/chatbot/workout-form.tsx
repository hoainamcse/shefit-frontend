'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormInputField, FormNumberField, FormRadioField, FormSelectField, FormTextareaField } from '../forms/fields'
import styles from './chatbot.module.css'

const workoutFormSchema = z.object({
  age: z.number().min(1, 'Tuổi phải lớn hơn 0'),
  height: z.number().min(1, 'Chiều cao phải lớn hơn 0'),
  weight: z.number().min(1, 'Cân nặng phải lớn hơn 0'),
  measurements: z.string().min(1, 'Vui lòng nhập số đo 3 vòng'),
  bellyMeasurement: z.number().min(1, 'Số đo bụng dưới phải lớn hơn 0'),
  isExperienced: z.enum(['true', 'false']),
  injuries: z.string(),
  weeklyDays: z.number().min(1, 'Ít nhất 1 ngày').max(7, 'Tối đa 7 ngày'),
})

type WorkoutFormValues = z.infer<typeof workoutFormSchema>

interface WorkoutFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function WorkoutForm({ onSubmit, onCancel }: WorkoutFormProps) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      age: 0,
      height: 0,
      weight: 0,
      measurements: '',
      bellyMeasurement: 0,
      isExperienced: 'false',
      injuries: '',
      weeklyDays: 3,
    },
  })

  const handleSubmit = (data: WorkoutFormValues) => {
    onSubmit({ ...data, isExperienced: data.isExperienced === 'true' })
  }

  return (
    <div className={`w-full max-h-full overflow-y-auto ${styles.promptsContainerScrollbar}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Thông tin lập kế hoạch tập luyện</h3>
        <p className="text-sm text-gray-600">Vui lòng điền đầy đủ thông tin để được tư vấn tốt nhất</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormNumberField name="age" form={form} label="Tuổi" placeholder="25" min={1} />
            <FormNumberField name="height" form={form} label="Chiều cao (cm)" placeholder="160" min={1} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormNumberField name="weight" form={form} label="Cân nặng (kg)" placeholder="55" min={1} />

            <FormNumberField
              name="bellyMeasurement"
              form={form}
              label="Số đo bụng dưới (cm)"
              min={1}
              placeholder="70"
            />
          </div>

          <FormInputField name="measurements" form={form} placeholder="Ví dụ: 90-70-95" label="Số đo 3 vòng" />

          <FormRadioField
            name="isExperienced"
            form={form}
            label="Chị đã biết tập chưa hay người mới?"
            data={[
              { value: 'true', label: 'Đã biết tập' },
              { value: 'false', label: 'Người mới' },
            ]}
            direction="horizontal"
          />

          <FormTextareaField
            name="injuries"
            form={form}
            label="Chị có bị chấn thương hay đau vùng nào không?"
            placeholder="Mô tả tình trạng sức khỏe hoặc chấn thương (nếu có)"
            rows={4}
          />

          <FormSelectField
            name="weeklyDays"
            form={form}
            label="Một tuần muốn tập mấy ngày?"
            placeholder="Chọn số ngày"
            data={[
              { value: '1', label: '1 ngày' },
              { value: '2', label: '2 ngày' },
              { value: '3', label: '3 ngày' },
              { value: '4', label: '4 ngày' },
              { value: '5', label: '5 ngày' },
              { value: '6', label: '6 ngày' },
              { value: '7', label: '7 ngày' },
            ]}
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
