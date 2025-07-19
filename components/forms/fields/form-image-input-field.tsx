import * as React from 'react'
import { type UseFormReturn, type FieldValues, type Path, useFieldArray, useWatch } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AddButton } from '@/components/buttons/add-button'

type FormImageInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>
  name: Path<TFieldValues>
  label?: string
  description?: string
  withAsterisk?: boolean
  multipleLink?: boolean
} & Omit<React.ComponentPropsWithoutRef<typeof Input>, 'form' | 'name'>

const isValidImageUrl = (url: string) => {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function FormImageInputField<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  form,
  name,
  label,
  description,
  withAsterisk = false,
  multipleLink = false,
  ...inputProps
}: FormImageInputFieldProps<TFieldValues, TContext, TTransformedValues>) {
  const [inputValue, setInputValue] = React.useState('')

  // Helper for normalized duplicate check
  const normalizeUrl = (url: string) => url.trim().toLowerCase()

  // Remove button styles
  const removeBtnClass =
    'absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-offset-1'

  // SINGLE MODE
  if (!multipleLink) {
    const imageUrl: string = form.watch(name) || ''
    const handleAdd = () => {
      if (!isValidImageUrl(inputValue)) return
      form.setValue(name, inputValue as any)
      setInputValue('')
    }
    const handleRemove = () => {
      form.setValue(name, '' as any)
    }
    return (
      <FormItem>
        {label && (
          <FormLabel>
            {label} {withAsterisk && <span className="text-destructive">*</span>}
          </FormLabel>
        )}
        {description && <FormDescription>{description}</FormDescription>}
        <div className="flex items-center gap-2">
          <FormControl>
            <Input
              {...inputProps}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="url"
              inputMode="url"
              aria-label={label || name}
              tabIndex={0}
              autoComplete="off"
              placeholder={inputProps.placeholder || 'https://placehold.co/400?text=shefit.vn&font=Oswald'}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isValidImageUrl(inputValue)) {
                  e.preventDefault()
                  handleAdd()
                }
              }}
            />
          </FormControl>
          <AddButton
            size="icon"
            aria-label="Add image link"
            tabIndex={0}
            className="flex-shrink-0"
            onClick={handleAdd}
            disabled={!isValidImageUrl(inputValue)}
          />
        </div>
        {imageUrl && (
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded border border-gray-200">
                <img src={imageUrl} alt="Preview" aria-label="Image preview" className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                aria-label="Remove image"
                tabIndex={0}
                className={removeBtnClass}
                onClick={handleRemove}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleRemove()
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <FormMessage />
      </FormItem>
    )
  }

  // MULTIPLE MODE
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name as any,
  })
  const images: string[] = useWatch({ control: form.control, name }) || []
  const handleAdd = () => {
    if (!isValidImageUrl(inputValue)) return
    append(inputValue as any)
    setInputValue('')
  }
  const handleRemove = (idx: number) => {
    remove(idx)
  }
  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label} {withAsterisk && <span className="text-destructive">*</span>}
        </FormLabel>
      )}
      <div className="mb-3 flex flex-wrap gap-4">
        {fields.map((fieldItem, idx) => (
          <div key={fieldItem.id} className="relative">
            <div className="h-24 w-24 overflow-hidden rounded border border-gray-200">
              <img
                src={images[idx]}
                alt={`Preview ${idx + 1}`}
                aria-label={`Image preview ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              aria-label="Remove image"
              tabIndex={0}
              className={removeBtnClass}
              onClick={() => handleRemove(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleRemove(idx)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <FormControl>
          <Input
            {...inputProps}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="url"
            inputMode="url"
            aria-label={label || name}
            tabIndex={0}
            autoComplete="off"
            placeholder={inputProps.placeholder || 'https://placehold.co/400?text=shefit.vn&font=Oswald'}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && isValidImageUrl(inputValue)) {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
        </FormControl>
        <button
          type="button"
          aria-label="Add image link"
          tabIndex={0}
          className="rounded bg-primary px-3 py-1 text-xs text-white hover:bg-primary/80 focus:outline-none disabled:opacity-50"
          onClick={handleAdd}
          disabled={!isValidImageUrl(inputValue)}
        >
          Add
        </button>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

export { FormImageInputField }
