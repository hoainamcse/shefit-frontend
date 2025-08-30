'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { X, Image as ImageIcon, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { EditDialog } from '@/components/data-table/edit-dialog'
import { ImageManager, type ImageItem } from '@/components/image-manager'

export interface FormImageSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control: Control<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  maxImages?: number
  className?: string
}

export function FormImageSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  description,
  placeholder,
  disabled,
  maxImages = 1,
  className,
}: FormImageSelectFieldProps<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = useState(false)

  // React hook form controller
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  // Convert field value to standard format
  const fieldValue = field.value as string | string[] | undefined

  // Normalize field value to array of image objects for internal use
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([])

  // Handle image selection from the manager component
  const handleImagesSelected = (images: ImageItem[]) => {
    setSelectedImages(images)
    // Update form field with array of URLs
    const urls = images.map((img) => img.url)
    field.onChange(maxImages === 1 && urls.length === 1 ? urls[0] : urls.length > 0 ? urls : undefined)
    setIsOpen(false)
  }

  // Remove a selected image
  const handleRemoveImage = (indexToRemove: number) => {
    if (disabled) return

    setSelectedImages((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove)
      const urls = updated.map((img) => img.url)
      field.onChange(maxImages === 1 && urls.length === 1 ? urls[0] : urls.length > 0 ? urls : undefined)
      return updated
    })
  }

  // Initialize selected images from field value
  useEffect(() => {
    const initializeFromValue = () => {
      if (!fieldValue) {
        setSelectedImages([])
        return
      }

      // Extract image name from URL
      const extractNameFromUrl = (url: string) => {
        const nameParts = url.split('/')
        return nameParts[nameParts.length - 1]
      }

      if (typeof fieldValue === 'string') {
        // Single value
        const name = extractNameFromUrl(fieldValue)
        setSelectedImages([{ id: name, url: fieldValue, name }])
      } else if (Array.isArray(fieldValue)) {
        // Multiple values
        setSelectedImages(
          fieldValue.map((url) => {
            const name = extractNameFromUrl(url)
            return { id: name, url, name }
          })
        )
      }
    }

    // Call immediately on mount and when field value changes
    initializeFromValue()
  }, [fieldValue])

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label and selected images count */}
      <div className="flex justify-between items-baseline">
        {label && <Label htmlFor={name}>{label}</Label>}
        {selectedImages.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {selectedImages.length} hình được chọn
            {maxImages > 0 ? ` (tối đa ${maxImages})` : ''}
          </span>
        )}
      </div>

      {/* Selected images display - Moved to the top */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedImages.length > 0 ? (
          selectedImages.map((image, index) => (
            <div
              key={image.id || `img-${index}`}
              className="relative group border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img src={image.url} alt={image.name} className="w-20 h-20 object-cover" />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 opacity-70 hover:opacity-100"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-20 w-full bg-muted/30 rounded-md border border-dashed">
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mb-1" />
              <span className="text-sm">{placeholder || 'Không có hình ảnh được chọn'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Button to open image selection dialog */}
      <div>
        <Button type="button" variant="outline" onClick={() => setIsOpen(true)} disabled={disabled} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Chọn hình ảnh
        </Button>
      </div>

      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      {error?.message && <p className="text-sm font-medium text-destructive">{error.message}</p>}

      {/* Image selection dialog */}
      <EditDialog
        title={`Chọn hình ảnh${maxImages > 0 ? ` (tối đa ${maxImages})` : ''}`}
        description="Chọn từ hình đã tải lên hoặc tải hình mới"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <ImageManager maxSelect={maxImages} onConfirmSelectedImages={handleImagesSelected} />
      </EditDialog>
    </div>
  )
}
