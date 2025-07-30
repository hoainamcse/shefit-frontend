'use client'

import * as React from 'react'
import { FileText, Upload, X } from 'lucide-react'
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone'
import { type UseFormReturn, type FieldValues, type Path, type PathValue, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { getS3FileUrl, uploadImageApi } from '@/network/client/upload'

import { cn } from '@/lib/utils'
import { formatBytes } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ImageUploaderProps<TFieldValues extends FieldValues>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop' | 'onError'> {
  /**
   * React Hook Form's form instance.
   */
  form: UseFormReturn<TFieldValues>

  /**
   * Name of the field in the form.
   */
  name: Path<TFieldValues>

  /**
   * Function to be called when files are selected for upload.
   * It should handle the upload process and return a Promise that resolves to:
   * - A single string (URL) if maxFileCount is 1.
   * - An array of strings (URLs) if maxFileCount > 1.
   * - null if the upload failed or the value should be cleared.
   * - undefined if no change to the form value should occur.
   */

  label?: string
  progresses?: Record<string, number>
  accept?: DropzoneProps['accept']
  maxSize?: DropzoneProps['maxSize']
  maxFileCount?: DropzoneProps['maxFiles']
  disabled?: boolean
}

export function ImageUploader<TFieldValues extends FieldValues>(props: ImageUploaderProps<TFieldValues>) {
  const {
    form,
    name,
    label,
    progresses,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 4, // 4MB default
    maxFileCount = 1,
    disabled = false,
    className,
    ...dropzoneProps
  } = props

  // Local state for files selected for upload (previews)
  const [localFiles, setLocalFiles] = React.useState<File[]>([])

  const handleUploadLogic = React.useCallback(
    async (files: File[]): Promise<string | string[] | null | undefined> => {
      if (maxFileCount === 1) {
        const file = files[0]
        if (!file) return undefined

        try {
          const response = await uploadImageApi(file)
          if (response.status === 'success' && response.data.file.s3_key) {
            const imageUrl = getS3FileUrl(response.data.file.s3_key)
            return imageUrl
          } else {
            console.error('Image upload failed for file:', file.name, response)
            return undefined
          }
        } catch (error) {
          console.error('Error during file upload process for file:', file.name, error)
          return undefined
        }
      } else {
        // Multiple files
        const uploadedUrls: string[] = []
        for (const file of files) {
          try {
            const response = await uploadImageApi(file)
            if (response.status === 'success' && response.data.file.s3_key) {
              const imageUrl = getS3FileUrl(response.data.file.s3_key)
              uploadedUrls.push(imageUrl)
            } else {
              console.error('Image upload failed for file:', file.name, response)
              // Continue with other files even if one fails
            }
          } catch (error) {
            console.error('Error during file upload for file:', file.name, error)
            // Continue with other files on error
          }
        }
        return uploadedUrls.length > 0 ? uploadedUrls : undefined
      }
    },
    [maxFileCount]
  )

  const handleOnDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot select more than 1 file at a time.')
        return
      }

      const currentFormValue = form.watch(name)
      let formImageCount = 0
      if (typeof currentFormValue === 'string' && currentFormValue) {
        formImageCount = 1
      } else if (Array.isArray(currentFormValue)) {
        formImageCount = currentFormValue.filter(Boolean).length
      }

      // Total potential files = images already in form + local previews + newly accepted files
      // This logic might need refinement if replacing existing form images directly with new selections
      if (formImageCount + localFiles.length + acceptedFiles.length > maxFileCount && maxFileCount > 0) {
        toast.error(
          `Cannot upload more than ${maxFileCount} file(s). Remove existing images first or adjust selection.`
        )
        return
      }

      const newLocalFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
      // If maxFileCount is 1, new selection replaces old local files
      const updatedLocalFiles = maxFileCount === 1 ? newLocalFiles : [...localFiles, ...newLocalFiles]
      setLocalFiles(updatedLocalFiles.slice(0, maxFileCount)) // Ensure local files don't exceed max count

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          const message = errors[0]?.message || `File ${file.name} was rejected.`
          toast.error(message)
        })
      }

      // If onUpload is provided, attempt to upload the currently selected local files
      if (updatedLocalFiles.length > 0) {
        const filesToUpload = maxFileCount === 1 ? [updatedLocalFiles[0]] : updatedLocalFiles
        const target = filesToUpload.length > 1 ? `${filesToUpload.length} files` : `file`

        toast.promise(handleUploadLogic(filesToUpload), {
          loading: `Uploading images...`,
          success: (newUrlOrUrls) => {
            console.log('[ImageUploader.handleOnDrop] Received newUrlOrUrls from onUpload:', newUrlOrUrls)
            if (newUrlOrUrls !== undefined) {
              // Covers string, string[], null
              if (maxFileCount === 1) {
                // Single file: set string value
                const singleUrl =
                  typeof newUrlOrUrls === 'string'
                    ? newUrlOrUrls
                    : Array.isArray(newUrlOrUrls) && newUrlOrUrls.length > 0
                    ? newUrlOrUrls[0]
                    : ''
                form.setValue(name, singleUrl as PathValue<TFieldValues, Path<TFieldValues>>, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              } else {
                // Multiple files: merge new URLs with existing form values
                const existingVal = form.getValues(name)
                let existingUrls: string[] = []
                if (Array.isArray(existingVal)) {
                  existingUrls = existingVal
                } else if (typeof existingVal === 'string' && existingVal) {
                  existingUrls = [existingVal]
                }
                const newUrlsArray: string[] = Array.isArray(newUrlOrUrls)
                  ? newUrlOrUrls
                  : typeof newUrlOrUrls === 'string'
                  ? [newUrlOrUrls]
                  : []
                const combinedUrls = [...existingUrls, ...newUrlsArray].slice(0, maxFileCount)
                form.setValue(name, combinedUrls as PathValue<TFieldValues, Path<TFieldValues>>, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              setLocalFiles([]) // Clear local previews

              // More specific success message
              const isSingleValidUrl = typeof newUrlOrUrls === 'string' && newUrlOrUrls.trim() !== ''
              const isArrayWithValidUrls =
                Array.isArray(newUrlOrUrls) &&
                newUrlOrUrls.length > 0 &&
                newUrlOrUrls.every((url) => typeof url === 'string' && url.trim() !== '')

              if (isSingleValidUrl || isArrayWithValidUrls) {
                return `${target} uploaded and form updated with new image(s).`
              } else if (
                newUrlOrUrls === null ||
                (typeof newUrlOrUrls === 'string' && newUrlOrUrls.trim() === '') ||
                (Array.isArray(newUrlOrUrls) && newUrlOrUrls.length === 0)
              ) {
                return `Image field cleared in form.`
              } else {
                // Fallback for cases like empty array from onUpload if not explicitly handled as 'cleared'
                return `Form updated for ${target}. Review displayed image.`
              }
            } else {
              // newUrlOrUrls is undefined
              return `Upload process completed`
            }
          },
          error: (err) => {
            // Don't clear local files on error, user might want to retry or save them
            return `Failed to upload ${target}: ${err.message || 'Unknown error'}`
          },
        })
      }
    },
    [form, name, localFiles, maxFileCount, setLocalFiles]
  )

  const handleRemoveLocalFile = (index: number) => {
    if (disabled) return
    const updatedLocalFiles = localFiles.filter((_, i) => i !== index)
    // Simply update local previews
    setLocalFiles(updatedLocalFiles)

    // If all local files have been removed, optionally set a placeholder back on the form
    if (updatedLocalFiles.length === 0) {
      form.setValue(
        name,
        'https://placehold.co/400?text=shefit.vn&font=Oswald' as PathValue<TFieldValues, Path<TFieldValues>>,
        { shouldValidate: true, shouldDirty: true }
      )
    }
  }

  const handleRemoveFormImage = (index?: number) => {
    if (disabled) return
    const placeholder = 'https://placehold.co/400?text=shefit.vn&font=Oswald'
    const currentFormValue = form.watch(name)

    if (maxFileCount === 1 || typeof index === 'undefined' || !Array.isArray(currentFormValue)) {
      // Either single-upload mode or we didn't get a specific index
      form.setValue(name, placeholder as PathValue<TFieldValues, Path<TFieldValues>>, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } else if (Array.isArray(currentFormValue) && typeof index === 'number') {
      // Multi-upload: remove the item at the given index
      const newFormUrls = currentFormValue.filter((_: unknown, i: number) => i !== index)

      form.setValue(
        name,
        (newFormUrls.length > 0 ? newFormUrls : placeholder) as PathValue<TFieldValues, Path<TFieldValues>>,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      )
    }
    toast.info('Image removed from form.')
  }

  React.useEffect(() => {
    // Revoke object URLs on unmount or when localFiles change
    return () => {
      localFiles.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [localFiles]) // Rerun if localFiles array instance changes

  const watchedFormValue = useWatch({
    control: form.control,
    name,
  })
  console.log('[ImageUploader] Watched form value (useWatch) for field', name, ':', watchedFormValue)

  React.useEffect(() => {
    console.log('[ImageUploader] useEffect detected change in watchedFormValue:', watchedFormValue)
  }, [watchedFormValue])
  let displayedFormImageUrls: string[] = []

  if (typeof watchedFormValue === 'string' && watchedFormValue) {
    displayedFormImageUrls = [watchedFormValue]
  } else if (Array.isArray(watchedFormValue)) {
    displayedFormImageUrls = watchedFormValue.filter(
      (url: unknown): url is string => typeof url === 'string' && url.length > 0
    )
  }

  const totalDisplayedImages = displayedFormImageUrls.length + localFiles.length
  const isUploaderDisabled = disabled || (maxFileCount > 0 && totalDisplayedImages >= maxFileCount)

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Dropzone
        onDrop={handleOnDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount > 0 ? maxFileCount - displayedFormImageUrls.length - localFiles.length : 0} // Dynamically adjust how many new files can be selected
        multiple={maxFileCount > 1}
        disabled={isUploaderDisabled}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isUploaderDisabled && 'pointer-events-none opacity-60',
              className
            )}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Upload className="size-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="font-medium text-muted-foreground">
                  Drag {`'n'`} drop files here, or click to select files
                </p>
                <p className="text-sm text-muted-foreground/70">
                  {maxFileCount > 0
                    ? maxFileCount > 1
                      ? `Upload up to ${maxFileCount} files. `
                      : `Upload 1 file. `
                    : 'Upload files. '}
                  Max size: {formatBytes(maxSize ?? 0)}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Upload className="size-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="space-y-px">
                  <p className="font-medium text-muted-foreground">
                    Drag {`'n'`} drop files here, or click to select files
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    {maxFileCount > 0
                      ? maxFileCount > 1
                        ? `Upload up to ${maxFileCount} files. `
                        : `Upload 1 file. `
                      : 'Upload files. '}
                    Max size: {formatBytes(maxSize ?? 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </Dropzone>
      {(form.formState.errors as Record<string, any>)[name as string]?.message && (
        <p className="mt-1 text-sm text-destructive">
          {(form.formState.errors as Record<string, any>)[name as string]?.message}
        </p>
      )}

      {/* Display Area for Form Images and Local Previews */}
      {(displayedFormImageUrls.length > 0 || localFiles.length > 0) && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {displayedFormImageUrls.length + localFiles.length} /{' '}
            {maxFileCount === undefined ? 'unlimited' : maxFileCount} files uploaded
          </p>
          <ScrollArea className="h-fit w-full px-3">
            <div className="max-h-80 space-y-4">
              {/* Display images from form state */}
              {displayedFormImageUrls.map((url, index) => (
                <div key={`form-img-${index}-${url}`} className="relative flex items-center space-x-4">
                  <div className="flex flex-1 space-x-4 items-center">
                    <img // Using <img> tag for consistency
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="aspect-square shrink-0 rounded-md object-cover"
                    />
                    <div className="flex flex-col flex-grow min-w-0">
                      <p className="line-clamp-1 text-sm font-medium text-foreground/80 break-all">
                        {url.substring(url.lastIndexOf('/') + 1) || `Image ${index + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">Current value</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() => handleRemoveFormImage(maxFileCount > 1 ? index : undefined)}
                      disabled={disabled}
                      aria-label={`Remove image ${index + 1} from form`}
                      tabIndex={0}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Display newly selected local file previews */}
              {localFiles.map((file, index) => (
                <FileCard
                  key={`local-preview-${index}-${file.name}`}
                  file={file}
                  onRemove={() => handleRemoveLocalFile(index)}
                  progress={progresses?.[file.name]}
                  disabled={disabled}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

interface FileCardProps {
  file: File // Expect File object, potentially with preview
  onRemove: () => void
  progress?: number
  disabled?: boolean
}

function FileCard({ file, progress, onRemove, disabled }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4 items-center">
        {isFileWithPreview(file) ? (
          <img
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : (
          <FileText className="size-12 aspect-square shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
        <div className="flex flex-col flex-grow min-w-0">
          <p className="line-clamp-1 text-sm font-medium text-foreground/80 break-all">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {typeof progress === 'number' && <Progress value={progress} className="h-1 w-20" />}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove preview for ${file.name}`}
          tabIndex={0}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

// Type guard to check if a file object has a preview URL string
function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof (file as any).preview === 'string'
}
