import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import styles from './chatbot.module.css'

const mealFormSchema = z.object({
  age: z.number().min(1, 'Tuổi phải lớn hơn 0'),
  height: z.number().min(1, 'Chiều cao phải lớn hơn 0'),
  weight: z.number().min(1, 'Cân nặng phải lớn hơn 0'),
  goal: z.enum(['Giảm Cân', 'Giữ Cân', 'Tăng Cân'], {
    required_error: 'Vui lòng chọn mục tiêu',
  }),
  foodPreferences: z.string().min(1, 'Vui lòng cho biết sở thích ăn uống'),
})

type MealFormValues = z.infer<typeof mealFormSchema>

interface MealFormProps {
  onSubmit: (data: MealFormValues) => void
  onCancel: () => void
}

export function MealForm({ onSubmit, onCancel }: MealFormProps) {
  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      age: 0,
      height: 0,
      weight: 0,
      goal: undefined,
      foodPreferences: '',
    },
  })

  const handleSubmit = (data: MealFormValues) => {
    onSubmit(data)
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
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mục tiêu</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mục tiêu của bạn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Giảm Cân">Giảm Cân</SelectItem>
                      <SelectItem value="Giữ Cân">Giữ Cân</SelectItem>
                      <SelectItem value="Tăng Cân">Tăng Cân</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foodPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thích ăn gì</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả sở thích ăn uống, món ăn yêu thích, thực phẩm không thích hoặc dị ứng..."
                    {...field}
                    rows={4}
                  />
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
