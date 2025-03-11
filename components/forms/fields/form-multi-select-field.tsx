import * as React from 'react'
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

type SelectOption = {
  value: string
  label: string
  group?: string
}

interface FormMultiSelectFieldProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  required?: boolean
  placeholder?: string
  description?: string | React.JSX.Element
  options: SelectOption[]
}

export function FormMultiSelectField({
  form,
  name,
  label,
  required = false,
  placeholder,
  description,
  options = [],
}: FormMultiSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
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
                {renderMultiSelectOptions(options)}
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
