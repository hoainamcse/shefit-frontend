import { UseFormReturn } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

type CheckboxOption = {
  value: string
  label: string
}

interface FormCheckboxFieldProps {
  form: UseFormReturn<any>
  name: string
  data: CheckboxOption[]
  label?: string
  description?: string
  withAsterisk?: boolean
}

function FormCheckboxField({ form, data, name, label, description, withAsterisk = false }: FormCheckboxFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div>
            {label && (
              <FormLabel>
                {label} {withAsterisk && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          {data.map((item) => (
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

export { FormCheckboxField }
