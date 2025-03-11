import * as React from 'react'
import { type HTMLInputTypeAttribute } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface FormTextFieldProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  required?: boolean
  placeholder?: string
  description?: string | React.JSX.Element
  readOnly?: boolean
  inputType?: HTMLInputTypeAttribute
}

export function FormTextField({
  form,
  name,
  label,
  required = false,
  placeholder,
  description,
  readOnly = false,
  inputType = 'text',
}: FormTextFieldProps) {
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
            <Input placeholder={placeholder} {...field} readOnly={readOnly} type={inputType} className="h-10" />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
