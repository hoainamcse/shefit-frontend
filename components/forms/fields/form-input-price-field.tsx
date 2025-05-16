import * as React from 'react'
import { type UseFormReturn, type FieldValues, type Path } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type FormInputPriceFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>
  name: Path<TFieldValues>
  label?: string
  description?: string
  withAsterisk?: boolean
} & Omit<React.ComponentPropsWithoutRef<typeof Input>, 'form' | 'name' | 'value' | 'onChange'>

function FormInputPriceField<
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
}: FormInputPriceFieldProps<TFieldValues, TContext, TTransformedValues>) {
  return (
    <FormField
      control={form.control as any}
      name={name}
      render={({ field }) => {
        // Convert the field value to a number for formatting
        const numericValue = field.value ? Number(field.value) : 0

        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label} {withAsterisk && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <Input
                type="text"
                value={numericValue ? new Intl.NumberFormat('vi-VN').format(numericValue) : ''}
                onChange={(e) => {
                  // Remove all non-digit characters
                  const value = e.target.value.replace(/[^\d]/g, '')
                  // Convert to number or 0 if empty
                  const numericValue = value ? parseInt(value, 10) : 0
                  // Update the form field value
                  field.onChange(numericValue)
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                placeholder="Nhập giá tiền"
                {...inputProps}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export { FormInputPriceField }
