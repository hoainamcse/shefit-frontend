import * as React from 'react'
import { type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type FormNumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>
  name: Path<TFieldValues>
  label?: string
  description?: string
  withAsterisk?: boolean
} & Omit<React.ComponentPropsWithoutRef<typeof Input>, 'form' | 'name'>

export function FormNumberField<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  form,
  name,
  label,
  description,
  withAsterisk = false,
  ...inputProps
}: FormNumberFieldProps<TFieldValues, TContext, TTransformedValues>) {
  return (
    <FormField
      control={form.control as any}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {withAsterisk && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...inputProps}
              type="number"
              min={0}
              // Apply field props but ensure our custom handlers take precedence
              value={field.value}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              // Improved key down handler to prevent negative numbers
              onKeyDown={(event) => {
                // Prevent typing the minus sign, 'e', or any non-numeric keys except allowed control keys
                if (event.key === '-' || event.key === 'e' || event.key === '+') {
                  event.preventDefault()
                }

                // Allow input props onKeyDown to still work if provided
                inputProps.onKeyDown?.(event)
              }}
              // Improved onChange handler with stricter validation
              onChange={(event) => {
                let value = event.target.value

                // Remove any minus signs that might have been entered through pasting
                value = value.replace(/-/g, '')

                // Ensure we have a valid number or empty string
                const numericValue = value === '' ? value : Math.max(0, parseFloat(value))

                // Update the field value
                field.onChange(numericValue)

                // Also call any onChange from inputProps if it exists
                inputProps.onChange?.(event)
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
