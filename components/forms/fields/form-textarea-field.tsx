import * as React from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface FormTextareaFieldProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  required?: boolean
  placeholder?: string
  description?: string | React.JSX.Element
  readOnly?: boolean
}

export function FormTextareaField({
  form,
  name,
  label,
  required = false,
  placeholder,
  description,
  readOnly = false,
}: FormTextareaFieldProps) {
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
          <FormControl>
            <Textarea placeholder={placeholder} {...field} readOnly={readOnly} rows={3} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
