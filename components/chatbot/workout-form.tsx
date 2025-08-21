import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import styles from './chatbot.module.css'

const workoutFormSchema = z.object({
  age: z.number().min(1, 'Tuổi phải lớn hơn 0'),
  height: z.number().min(1, 'Chiều cao phải lớn hơn 0'),
  weight: z.number().min(1, 'Cân nặng phải lớn hơn 0'),
  measurements: z.string().min(1, 'Vui lòng nhập số đo 3 vòng'),
  bellyMeasurement: z.number().min(1, 'Số đo bụng dưới phải lớn hơn 0'),
  isExperienced: z.boolean(),
  injuries: z.string(),
  weeklyDays: z.number().min(1, 'Ít nhất 1 ngày').max(7, 'Tối đa 7 ngày'),
})

type WorkoutFormValues = z.infer<typeof workoutFormSchema>

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormValues) => void
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
      isExperienced: false,
      injuries: '',
      weeklyDays: 3,
    },
  })

  const handleSubmit = (data: WorkoutFormValues) => {
    onSubmit(data)
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
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuổi</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chiều cao (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="160"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cân nặng (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="55"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bellyMeasurement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số đo bụng dưới (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="70"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="measurements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số đo 3 vòng</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: 90-70-95" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isExperienced"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chị đã biết tập chưa hay người mới?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value ? 'true' : 'false'}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="experienced" />
                      <Label htmlFor="experienced">Đã biết tập</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="beginner" />
                      <Label htmlFor="beginner">Người mới</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="injuries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chị có bị chấn thương hay đau vùng nào không?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả tình trạng sức khỏe hoặc chấn thương (nếu có)" {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weeklyDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Một tuần muốn tập mấy ngày?</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn số ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day} ngày
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
