import { UseFormReturn } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

type Option = {
  value: string
  label: string
}

interface FormCheckboxFieldProps {
  form: UseFormReturn<any>
  data: Option[]
  name: string
  label?: string
  description?: string
  required?: boolean
}

export function FormCheckboxField({ form, data: items, name, label, description, required }: FormCheckboxFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-4">
            {label && (
              <FormLabel>
                {label} {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          {items.map((item) => (
            <FormField
              key={item.value}
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem key={item.value} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange(field.value ? [...field.value, item.value] : [item.value])
                            : field.onChange(field.value?.filter((value: any) => value !== item.value))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
