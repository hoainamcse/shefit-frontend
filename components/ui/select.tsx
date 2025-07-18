'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Enhanced Multi-Select Components
export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  maxDisplay?: number
  selectAllLabel?: string
  selectAllValue?: string
}

interface EnhancedSelectProps extends MultiSelectProps {
  mode?: 'single' | 'multiple'
  singleValue?: string
  onSingleChange?: (value: string) => void
}

const MultiSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> & {
    value?: string[]
    placeholder?: string
    maxDisplay?: number
    options: MultiSelectOption[]
    selectAllLabel?: string
  }
>(({ className, value = [], placeholder, maxDisplay = 2, options, selectAllLabel = 'Tất cả', ...props }, ref) => {
  const displayText = React.useMemo(() => {
    if (value.length === 0) return placeholder || 'Chọn các lựa chọn...'

    // Check if all options are selected
    const allOptionValues = options.map((opt) => opt.value)
    const isAllSelected = allOptionValues.every((val) => value.includes(val))

    if (isAllSelected) {
      return selectAllLabel
    }

    // Return empty string for selected items as we'll show tags instead
    return ''
  }, [value, options, placeholder, selectAllLabel])

  const allOptionValues = options.map((opt) => opt.value)
  const isAllSelected = allOptionValues.every((val) => value.includes(val))

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <div className="flex-1 flex items-center gap-1 overflow-hidden min-w-0 w-full">
        {displayText && <span className="truncate text-left">{displayText}</span>}
        {value.length > 0 && !isAllSelected && (
          <div className="flex items-center gap-1 flex-wrap min-w-0 w-full">
            {value.slice(0, maxDisplay).map((v) => {
              const option = options.find((opt) => opt.value === v)
              return (
                <span
                  key={v}
                  className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-xs min-w-0 truncate shrink-0"
                  style={{ maxWidth: `calc(90% / ${maxDisplay + 1 / 2})` }}
                  title={option?.label || v}
                >
                  {option?.label || v}
                </span>
              )
            })}
            {value.length > maxDisplay && (
              <span
                className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-xs min-w-0 truncate flex-1 shrink-0"
                style={{ maxWidth: `calc(90% / (${maxDisplay + 1 / 2}) * (1/2))` }}
                title={value
                  .slice(maxDisplay)
                  .map((v) => options.find((opt) => opt.value === v)?.label || v)
                  .join(', ')}
              >
                +{value.length - maxDisplay}
              </span>
            )}
          </div>
        )}
      </div>
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
    </button>
  )
})
MultiSelectTrigger.displayName = 'MultiSelectTrigger'

const MultiSelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute top-full left-0 right-0 z-50 mt-1 max-h-96 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
)
MultiSelectContent.displayName = 'MultiSelectContent'

const MultiSelectItem = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
    value: string
    selected?: boolean
    onItemSelect?: (value: string) => void
    disabled?: boolean
  }
>(({ className, children, value, selected, onItemSelect, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
      selected && 'bg-accent text-accent-foreground',
      disabled && 'pointer-events-none opacity-50',
      className
    )}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        onItemSelect?.(value)
      }
    }}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      {selected && <Check className="h-4 w-4" />}
    </span>
    <span className="flex-1">{children}</span>
  </div>
))
MultiSelectItem.displayName = 'MultiSelectItem'

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      defaultValue = [],
      onValueChange,
      placeholder,
      disabled,
      className,
      maxDisplay = 3,
      selectAllLabel = 'Tất cả',
      selectAllValue = '__select_all__',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)

    // Close dropdown when clicking outside
    const containerRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [ref]
    )

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const currentValue = value || internalValue
    const allOptionValues = options.map((opt) => opt.value)
    const isAllSelected = allOptionValues.every((val) => currentValue.includes(val))

    const handleValueChange = (newValue: string[]) => {
      if (onValueChange) {
        onValueChange(newValue)
      } else {
        setInternalValue(newValue)
      }
    }

    const handleSelectAll = () => {
      if (isAllSelected) {
        handleValueChange([])
      } else {
        handleValueChange(allOptionValues)
      }
    }

    const handleItemSelect = (itemValue: string) => {
      const newValue = currentValue.includes(itemValue)
        ? currentValue.filter((v) => v !== itemValue)
        : [...currentValue, itemValue]

      handleValueChange(newValue)
    }

    return (
      <div ref={combinedRef} className={cn('relative', className)} {...props}>
        <MultiSelectTrigger
          value={currentValue}
          placeholder={placeholder}
          maxDisplay={maxDisplay}
          options={options}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
        />

        {isOpen && (
          <MultiSelectContent>
            <MultiSelectItem value={selectAllValue} selected={isAllSelected} onItemSelect={handleSelectAll}>
              {selectAllLabel}
            </MultiSelectItem>

            <SelectSeparator />

            {options.map((option) => (
              <MultiSelectItem
                key={option.value}
                value={option.value}
                selected={currentValue.includes(option.value)}
                onItemSelect={() => handleItemSelect(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </MultiSelectItem>
            ))}
          </MultiSelectContent>
        )}
      </div>
    )
  }
)
MultiSelect.displayName = 'MultiSelect'

const EnhancedSelect = React.forwardRef<HTMLDivElement, EnhancedSelectProps>(
  ({ mode = 'single', singleValue, onSingleChange, ...props }, ref) => {
    if (mode === 'multiple') {
      return <MultiSelect ref={ref} {...props} />
    }

    return (
      <Select value={singleValue} onValueChange={onSingleChange}>
        <SelectTrigger className={props.className}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)
EnhancedSelect.displayName = 'EnhancedSelect'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectItem,
  EnhancedSelect,
  type MultiSelectProps,
  type EnhancedSelectProps,
}
