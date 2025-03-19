import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type RadioOption = {
  value: string
  label: string
}

interface FormRadioFieldProps {
  form: UseFormReturn<any>
  name: string
  data: RadioOption[]
  label?: string
  description?: string
  withAsterisk?: boolean
}

function FormRadioField({ form, data: items, name, label, description, withAsterisk = false }: FormRadioFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div>
            {label && (
              <FormLabel>
                {label} {withAsterisk && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
              {items.map((item) => (
                <FormItem key={item.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={item.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{item.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormRadioField }
