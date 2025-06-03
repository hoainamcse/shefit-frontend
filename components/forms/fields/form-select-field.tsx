import { type UseFormReturn } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SelectOption = {
  value: string
  label: string
}

interface FormSelectFieldProps {
  form: UseFormReturn<any>
  name: string
  data?: SelectOption[]
  label?: string
  description?: string
  withAsterisk?: boolean
  placeholder?: string
}

function FormSelectField({
  form,
  name,
  label,
  withAsterisk = false,
  placeholder,
  description,
  data = [],
}: FormSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {withAsterisk && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
            <FormControl>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {data.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                {data.length === 0 && <div className="py-6 text-center text-sm">Không tìm thấy kết quả</div>}
              </SelectGroup>
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormSelectField }
