'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormInputField, FormNumberField, FormRadioField, FormSelectField, FormTextareaField } from '../forms/fields'
import styles from './chatbot.module.css'

const workoutFormSchema = z.object({
  age: z.number({ invalid_type_error: 'Tuổi phải là số' }).min(18, 'Tuổi tối thiểu 18').max(55, 'Tuổi tối đa 55'),
  height: z
    .number({ invalid_type_error: 'Chiều cao phải là số' })
    .min(140, 'Chiều cao tối thiểu 140cm')
    .max(175, 'Chiều cao tối đa 175cm'),
  weight: z
    .number({ invalid_type_error: 'Cân nặng phải là số' })
    .min(40, 'Cân nặng tối thiểu 40kg')
    .max(100, 'Cân nặng tối đa 100kg'),
  measurements: z.string().min(1, 'Vui lòng nhập số đo 3 vòng'),
  bellyMeasurement: z.number().min(1, 'Số đo bụng dưới phải lớn hơn 1'),
  isExperienced: z.enum(['true', 'false']),
  injuries: z.string().optional(),
  weeklyDays: z.enum(['4', '5']),
  planWeeks: z.enum(['1', '2', '3', '4']),
})

type CourseFormValues = z.infer<typeof workoutFormSchema>

interface CourseFormProps {
  onSubmit: (msg: string) => void
  onCancel: () => void
}

export function CourseForm({ onSubmit, onCancel }: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      age: 18,
      height: 140,
      weight: 40,
      measurements: '',
      bellyMeasurement: 0,
      isExperienced: 'false',
      injuries: '',
      weeklyDays: '4',
      planWeeks: '1',
    },
  })

  const handleSubmit = (data: CourseFormValues) => {
    const msg = `Lên khoá tập
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Số đo 3 vòng: ${data.measurements}cm
Số đo bụng dưới: ${data.bellyMeasurement}cm
Kinh nghiệm tập luyện: ${data.isExperienced === 'true' ? 'Đã biết tập' : 'Người mới'}
Tình trạng sức khỏe: ${data.injuries || 'Không có vấn đề gì'}
Số ngày tập trong tuần: ${data.weeklyDays} ngày
Thời gian tập dự kiến: ${data.planWeeks} tuần`
    onSubmit(msg)
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
            <FormNumberField name="age" form={form} label="Tuổi" placeholder="25" min={18} max={55} />
            <FormNumberField name="height" form={form} label="Chiều cao (cm)" placeholder="160" min={140} max={175} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormNumberField name="weight" form={form} label="Cân nặng (kg)" placeholder="55" min={40} max={100} />
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
              { value: '4', label: '4 ngày' },
              { value: '5', label: '5 ngày' },
            ]}
          />

          <FormSelectField
            name="planWeeks"
            form={form}
            label="Plan tập trong thời gian mấy tuần?"
            placeholder="Chọn số tuần"
            data={[
              { value: '1', label: '1 tuần' },
              { value: '2', label: '2 tuần' },
              { value: '3', label: '3 tuần' },
              { value: '4', label: '4 tuần' },
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
