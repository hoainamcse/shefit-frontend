'use client'

import * as React from 'react'
import { ChevronDownIcon, CalendarIcon } from 'lucide-react'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FormFieldError } from './form-field-error'
import { Matcher } from 'react-day-picker'

interface FormDatePickerFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control: Control<TFieldValues>
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  calendarDisabled?: Matcher | Matcher[]
  required?: boolean
  dateFormat?: string
}

export function FormDatePickerField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  placeholder = 'Select date',
  className,
  disabled = false,
  calendarDisabled,
  required = false,
  dateFormat = 'dd/MM/yyyy',
}: FormDatePickerFieldProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false)

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? 'This field is required' : false },
  })

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={name} className="px-1">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              error && 'border-destructive'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), dateFormat) : placeholder}
            <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              // Convert Date to ISO string for form value
              onChange(date ? date.toISOString() : null)
              setOpen(false)
            }}
            disabled={disabled || calendarDisabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <FormFieldError error={error} />}
    </div>
  )
}
