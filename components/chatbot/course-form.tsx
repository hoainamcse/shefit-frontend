'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FormNumberField, FormRadioField, FormSelectField, FormTextareaField } from '../forms/fields'
import styles from './chatbot.module.css'

// Define enums for better type safety
const ExperienceOptions = {
  TRUE: 'true',
  FALSE: 'false',
} as const

const WeeklyDaysOptions = {
  FOUR: '4',
  FIVE: '5',
} as const

const PlanWeeksOptions = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
} as const

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
  measurements: z
    .string()
    .min(5, 'Vui lòng nhập số đo 3 vòng')
    .regex(/^\d{2,3}-\d{2,3}-\d{2,3}$/, 'Định dạng số đo không đúng, ví dụ: 90-70-95'),
  bellyMeasurement: z.number().min(1, 'Số đo bụng dưới phải lớn hơn 1'),
  isExperienced: z.enum([ExperienceOptions.TRUE, ExperienceOptions.FALSE]),
  injuries: z.string().optional(),
  weeklyDays: z.enum([WeeklyDaysOptions.FOUR, WeeklyDaysOptions.FIVE]),
  planWeeks: z.enum([PlanWeeksOptions.ONE, PlanWeeksOptions.TWO, PlanWeeksOptions.THREE, PlanWeeksOptions.FOUR]),
})

type CourseFormValues = z.infer<typeof workoutFormSchema>

interface CourseFormProps {
  onSubmit: (msg: string) => void
  onCancel: () => void
}

// Define radio options as a constant
const experienceOptions = [
  { value: ExperienceOptions.TRUE, label: 'Đã biết tập' },
  { value: ExperienceOptions.FALSE, label: 'Người mới' },
]

// Define weekly days options as a constant
const weeklyDaysOptions = [
  { value: WeeklyDaysOptions.FOUR, label: '4 ngày' },
  { value: WeeklyDaysOptions.FIVE, label: '5 ngày' },
]

// Define plan weeks options as a constant
const planWeeksOptions = [
  { value: PlanWeeksOptions.ONE, label: '1 tuần' },
  { value: PlanWeeksOptions.TWO, label: '2 tuần' },
  { value: PlanWeeksOptions.THREE, label: '3 tuần' },
  { value: PlanWeeksOptions.FOUR, label: '4 tuần' },
]

export function CourseForm({ onSubmit, onCancel }: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      age: 18,
      height: 140,
      weight: 40,
      measurements: '',
      bellyMeasurement: 0,
      isExperienced: ExperienceOptions.FALSE,
      injuries: '',
      weeklyDays: WeeklyDaysOptions.FOUR,
      planWeeks: PlanWeeksOptions.ONE,
    },
  })
  const registerWithMask = useHookFormMask(form.register)

  const handleSubmit = (data: CourseFormValues) => {
    const msg = `Lên khoá tập
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Số đo 3 vòng: ${data.measurements}cm
Số đo bụng dưới: ${data.bellyMeasurement}cm
Kinh nghiệm tập luyện: ${data.isExperienced === ExperienceOptions.TRUE ? 'Đã biết tập' : 'Người mới'}
Tình trạng sức khỏe: ${data.injuries || 'Không có vấn đề gì'}
Số ngày tập trong tuần: ${data.weeklyDays} ngày
Thời gian tập dự kiến: ${data.planWeeks} tuần`
    onSubmit(msg)
  }

  return (
    <div className={`w-full max-h-full overflow-y-auto my-3 ${styles.promptsContainerScrollbar}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Thông tin lập kế hoạch tập luyện</h3>
        <p className="text-sm text-gray-600">Vui lòng điền đầy đủ thông tin để được tư vấn tốt nhất</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormNumberField name="age" form={form} label="Tuổi" placeholder="25" min={18} max={55} />
            <FormNumberField name="height" form={form} label="Chiều cao (cm)" placeholder="160" min={140} max={175} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormNumberField name="weight" form={form} label="Cân nặng (kg)" placeholder="55" min={40} max={100} />
            <FormField
              control={form.control}
              name="measurements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số đo 3 vòng (cm)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: 90-70-95"
                      type="text"
                      {...field}
                      {...registerWithMask('measurements', ['99-99-99', '999-999-999'], {
                        required: true,
                        placeholder: '_',
                        showMaskOnHover: false,
                      })}
                    />
                  </FormControl>
                  <FormDescription>Nhập số đo 3 vòng theo định dạng: ngực-eo-mông</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormNumberField
              name="bellyMeasurement"
              form={form}
              label="Số đo bụng dưới (cm)"
              min={1}
              placeholder="70"
            />
            <FormRadioField
              name="isExperienced"
              form={form}
              label="Chị đã biết tập chưa hay người mới?"
              data={experienceOptions}
              direction="horizontal"
            />
          </div>

          <FormTextareaField
            name="injuries"
            form={form}
            label="Chị có bị chấn thương hay đau vùng nào không?"
            placeholder="Mô tả tình trạng sức khỏe hoặc chấn thương (nếu có)"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSelectField
              name="weeklyDays"
              form={form}
              label="Một tuần muốn tập mấy ngày?"
              placeholder="Chọn số ngày"
              data={weeklyDaysOptions}
            />

            <FormSelectField
              name="planWeeks"
              form={form}
              label="Plan tập trong thời gian mấy tuần?"
              placeholder="Chọn số tuần"
              data={planWeeksOptions}
            />
          </div>

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
