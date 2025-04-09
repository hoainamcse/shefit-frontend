import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { MainButton } from '../buttons/main-button'

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  type: z.enum(['percentage', 'money']),
  value: z.number().min(1, "Giá trị không được để trống")
})

export type Promotion = z.infer<typeof formSchema>

export function CreatePromotionForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<Promotion>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'percentage',
      value: 0
    }
  })

  function onSubmit(values: Promotion) {
    // TODO: Implement API call to create promotion
    console.log(values)
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên khuyến mãi</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên khuyến mãi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại khuyến mãi</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại khuyến mãi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="percentage">Phần trăm</SelectItem>
                  <SelectItem value="money">Tiền mặt</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá trị</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập giá trị"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                {form.getValues('type') === 'percentage' ? 'Phần trăm (%)' : 'VNĐ'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <MainButton text="Tạo khuyến mãi" type="submit" className="w-full"/>
      </form>
    </Form>
  )
}