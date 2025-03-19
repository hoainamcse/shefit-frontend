import { type UseFormReturn } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
} from '@/components/multi-select'

type MultiSelectOption = {
  value: string
  label: string
  group?: string
}

interface FormMultiSelectFieldProps {
  form: UseFormReturn<any>
  name: string
  data: MultiSelectOption[]
  label?: string
  description?: string
  withAsterisk?: boolean
  placeholder?: string
}

export function FormMultiSelectField({
  form,
  name,
  label,
  withAsterisk = false,
  placeholder,
  description,
  data = [],
}: FormMultiSelectFieldProps) {
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
          <MultiSelect onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <MultiSelectTrigger>
                <MultiSelectValue placeholder={placeholder} />
              </MultiSelectTrigger>
            </FormControl>
            <MultiSelectContent>
              <MultiSelectList>
                {renderMultiSelectOptions(data)}
                <MultiSelectEmpty>{'No results found'}</MultiSelectEmpty>
              </MultiSelectList>
            </MultiSelectContent>
          </MultiSelect>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
