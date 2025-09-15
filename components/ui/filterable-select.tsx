import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface FilterableSelectOption {
  value: string
  label: string
}

interface FilterableSelectProps {
  value: string
  onValueChange: (value: string | undefined) => void
  options: FilterableSelectOption[]
  placeholder: string
  className?: string
  showClearButton?: boolean
  clearButtonLabel?: string
  disabled?: boolean
}

export function FilterableSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className = 'w-56',
  showClearButton = true,
  clearButtonLabel = 'Bỏ chọn',
  disabled = false,
}: FilterableSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onValueChange(value || undefined)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
        {value && showClearButton && (
          <>
            <SelectSeparator />
            <Button
              className="w-full px-2"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onValueChange(undefined)
              }}
            >
              {clearButtonLabel}
            </Button>
          </>
        )}
      </SelectContent>
    </Select>
  )
}
