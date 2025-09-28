'use client'

import * as React from 'react'
import { CheckCircle, FileText, Upload, X, Loader2 } from 'lucide-react'
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone'
import { toast } from 'sonner'
import { getS3FileUrl, uploadImageApi } from '@/network/client/upload'

import { cn } from '@/lib/utils'
import { formatBytes } from '@/utils/helpers'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface UploadedImage {
  id: string
  url: string
  name: string
}

// Represents a file with additional properties like preview URL
interface PreviewFile extends File {
  preview: string
}

interface ImageUploaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop' | 'onError'> {
  /**
   * Label for the image uploader
   */
  label?: string

  /**
   * Type of files to accept
   */
  accept?: DropzoneProps['accept']

  /**
   * Maximum file size in bytes
   */
  maxSize?: number

  /**
   * Whether the uploader is disabled
   */
  disabled?: boolean

  /**
   * Initial uploaded images
   */
  initialImages?: UploadedImage[]

  /**
   * Callback when upload is successful
   */
  onSuccess?: (images: UploadedImage[]) => void

  /**
   * Callback when an image is removed
   */
  onRemove?: (image: UploadedImage) => void
}

export function ImageUploader({
  label,
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024 * 4, // 4MB default
  disabled = false,
  initialImages = [],
  onSuccess,
  onRemove,
  className,
  ...dropzoneProps
}: ImageUploaderProps) {
  // State for images in preview (not yet uploaded)
  const [previewFiles, setPreviewFiles] = React.useState<PreviewFile[]>([])

  // State for uploaded images
  const [uploadedImages, setUploadedImages] = React.useState<UploadedImage[]>(initialImages)

  // Loading states
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const [uploadingFiles, setUploadingFiles] = React.useState<Set<string>>(new Set())
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({})

  // Track upload errors for specific files
  const [fileErrors, setFileErrors] = React.useState<Record<string, string>>({})

  // Check if uploader is disabled
  const isUploaderDisabled = disabled || isUploading

  // Handle file drop from dropzone
  const handleOnDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Create preview URLs for accepted files
      const newPreviewFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ) as PreviewFile[]

      // Update preview files state
      setPreviewFiles((prev) => [...prev, ...newPreviewFiles])

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          const message = errors[0]?.message || `File ${file.name} was rejected.`
          toast.error(message)
        })
      }
    },
    [previewFiles]
  )

  // Remove a file from preview
  const handleRemovePreviewFile = (index: number) => {
    if (disabled || isUploading) return

    const fileToRemove = previewFiles[index]

    // First update the preview files state without revoking URL
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index))

    // Create a small delay before revoking the URL to ensure React has processed state updates
    // This prevents accidentally affecting other images that might be using similar object URLs
    setTimeout(() => {
      URL.revokeObjectURL(fileToRemove.preview)
    }, 100)

    // Clear any errors for this file
    if (fileErrors[fileToRemove.name]) {
      setFileErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fileToRemove.name]
        return newErrors
      })
    }
  }

  // Remove an uploaded image
  const handleRemoveUploadedImage = (image: UploadedImage) => {
    if (disabled || isUploading) return

    setUploadedImages((prev) => prev.filter((img) => img.id !== image.id))
    toast.info('Image removed.')

    // Call the onRemove callback if provided
    if (onRemove) {
      onRemove(image)
    }
  }

  // Upload a single file
  const handleUploadSingleFile = async (file: PreviewFile, index: number) => {
    if (disabled || uploadingFiles.has(file.name)) return

    const newUploadingFiles = new Set(uploadingFiles)
    newUploadingFiles.add(file.name)
    setUploadingFiles(newUploadingFiles)

    // Clear existing errors
    setFileErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[file.name]
      return newErrors
    })

    // Set initial progress
    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[file.name] || 0
        if (currentProgress < 90) {
          return { ...prev, [file.name]: currentProgress + 10 }
        }
        return prev
      })
    }, 300)

    try {
      // Upload the file
      const response = await uploadImageApi(file)

      // Clear the interval
      clearInterval(progressInterval)

      if (response.status === 'success' && response.data.file.s3_key) {
        // Set progress to 100%
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))

        const imageUrl = getS3FileUrl(response.data.file.s3_key)
        const newImage: UploadedImage = {
          id: response.data.file.s3_key,
          url: imageUrl,
          name: file.name,
        }

        // Add to uploaded images
        setUploadedImages((prev) => [...prev, newImage])

        // Remove from preview
        setPreviewFiles((prev) => prev.filter((_, i) => i !== index))

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess([...uploadedImages, newImage])
        }

        // Show success toast
        toast.success(`${file.name} uploaded successfully!`)
      } else {
        setFileErrors((prev) => ({ ...prev, [file.name]: 'Upload failed' }))
        setUploadProgress((prev) => ({ ...prev, [file.name]: -1 })) // -1 indicates error
        toast.error(`Failed to upload ${file.name}`)
      }
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Error uploading file:', file.name, error)
      setFileErrors((prev) => ({
        ...prev,
        [file.name]: error instanceof Error ? error.message : 'Unknown error',
      }))
      setUploadProgress((prev) => ({ ...prev, [file.name]: -1 }))
      toast.error(`Error uploading ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      const newUploadingFiles = new Set(uploadingFiles)
      newUploadingFiles.delete(file.name)
      setUploadingFiles(newUploadingFiles)
    }
  }

  // Upload all files after confirmation
  const handleConfirmUpload = async () => {
    if (previewFiles.length === 0) return

    setIsUploading(true)
    setFileErrors({})

    const newUploadedImages: UploadedImage[] = []
    const errors: Record<string, string> = {}

    // Upload each file
    for (const file of previewFiles) {
      try {
        // Set initial progress
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[file.name] || 0
            if (currentProgress < 90) {
              return { ...prev, [file.name]: currentProgress + 10 }
            }
            return prev
          })
        }, 300)

        // Upload the file
        const response = await uploadImageApi(file)

        // Clear the interval
        clearInterval(progressInterval)

        if (response.status === 'success' && response.data.file.s3_key) {
          // Set progress to 100%
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))

          const imageUrl = getS3FileUrl(response.data.file.s3_key)
          const newImage: UploadedImage = {
            id: response.data.file.s3_key,
            url: imageUrl,
            name: file.name,
          }

          newUploadedImages.push(newImage)
        } else {
          errors[file.name] = 'Upload failed'
          setUploadProgress((prev) => ({ ...prev, [file.name]: -1 })) // -1 indicates error
        }
      } catch (error) {
        console.error('Error uploading file:', file.name, error)
        errors[file.name] = error instanceof Error ? error.message : 'Unknown error'
        setUploadProgress((prev) => ({ ...prev, [file.name]: -1 }))
      }
    }

    // Update uploaded images and file errors
    if (newUploadedImages.length > 0) {
      const updatedImages = [...uploadedImages, ...newUploadedImages]

      setUploadedImages(updatedImages)

      // Clean up preview files that were successfully uploaded
      const successfullyUploadedFileNames = newUploadedImages.map((img) => img.name)
      const remainingPreviewFiles = previewFiles.filter((file) => !successfullyUploadedFileNames.includes(file.name))

      // Set remaining preview files
      setPreviewFiles(remainingPreviewFiles)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(updatedImages)
      }

      // Show success toast
      if (newUploadedImages.length === previewFiles.length) {
        toast.success('All images uploaded successfully!')
      } else {
        toast.success(`${newUploadedImages.length} of ${previewFiles.length} images uploaded successfully.`)
      }
    }

    // Set file errors
    if (Object.keys(errors).length > 0) {
      setFileErrors(errors)
      toast.error(`Failed to upload ${Object.keys(errors).length} image(s).`)
    }

    setIsUploading(false)
    setUploadProgress({})
  }

  // Clean up preview URLs only on component unmount
  // Using previewFiles as a dependency can cause issues with URLs being revoked too early
  React.useEffect(() => {
    return () => {
      // Only run on unmount, don't depend on previewFiles changes
      previewFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview)
      })
    }
  }, [])

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      {/* Label */}
      {label && <h3 className="text-base font-semibold">{label}</h3>}

      {/* Dropzone */}
      <Dropzone
        onDrop={handleOnDrop}
        accept={accept}
        maxSize={maxSize}
        multiple={true}
        disabled={isUploaderDisabled}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50 bg-muted/20',
              isUploaderDisabled && 'pointer-events-none opacity-60',
              className
            )}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full bg-primary/10 border-primary/20 border border-dashed p-4">
                  <Upload className="size-8 text-primary" aria-hidden="true" />
                </div>
                <p className="font-medium text-primary">Thả tệp của bạn ở đây</p>
                <p className="text-sm text-muted-foreground/70">Kích thước tối đa: {formatBytes(maxSize ?? 0)}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full bg-muted/50 border border-dashed p-4">
                  <Upload className="size-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Thả tệp ở đây, hoặc nhấn vào để chọn tệp</p>
                  <p className="text-sm text-muted-foreground">Kích thước tối đa: {formatBytes(maxSize ?? 0)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>

      {/* Preview files section */}
      {previewFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-medium">Xem trước ({previewFiles.length})</h4>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  // Store URLs to revoke after state update
                  const urlsToRevoke = previewFiles.map((file) => file.preview)

                  // Clear preview files state
                  setPreviewFiles([])

                  // Revoke URLs after a short delay
                  setTimeout(() => {
                    urlsToRevoke.forEach((url) => URL.revokeObjectURL(url))
                  }, 100)
                }}
                variant="outline"
                disabled={isUploading || disabled}
              >
                Xoá tất cả
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmUpload}
                disabled={isUploading || disabled || previewFiles.length === 0}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>Tải lên tất cả ({previewFiles.length})</>
                )}
              </Button>
            </div>
          </div>
          <ScrollArea className="h-fit max-h-60 w-full rounded-md border p-2">
            <div className="space-y-3">
              {previewFiles.map((file, index) => (
                <PreviewFileCard
                  key={`preview-${index}-${file.name}`}
                  file={file}
                  onRemove={() => handleRemovePreviewFile(index)}
                  onUpload={() => handleUploadSingleFile(file, index)}
                  progress={uploadProgress[file.name]}
                  error={fileErrors[file.name]}
                  isUploading={uploadingFiles.has(file.name)}
                  disabled={disabled || isUploading}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Separator between sections */}
      {previewFiles.length > 0 && uploadedImages.length > 0 && <Separator className="my-2" />}

      {/* Uploaded images section */}
      {uploadedImages.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-medium">Đã tải lên ({uploadedImages.length})</h4>
          </div>
          <ScrollArea className="h-fit max-h-60 w-full rounded-md border p-2">
            <div className="space-y-3">
              {uploadedImages.map((image) => (
                <UploadedImageCard
                  key={image.id}
                  image={image}
                  onRemove={() => handleRemoveUploadedImage(image)}
                  disabled={disabled || isUploading}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Show guidance if no files */}
      {previewFiles.length === 0 && uploadedImages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Không có hình ảnh được chọn. Thả tệp vào bên trên để bắt đầu.
        </p>
      )}
    </div>
  )
}

// Type guard to check if a file object has a preview URL string
function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof (file as any).preview === 'string'
}

// Preview File Card Component
interface PreviewFileCardProps {
  file: PreviewFile
  onRemove: () => void
  onUpload: () => void
  progress?: number
  error?: string
  isUploading?: boolean
  disabled?: boolean
}

function PreviewFileCard({ file, progress, error, onRemove, onUpload, isUploading, disabled }: PreviewFileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4 items-center">
        <img
          src={file.preview}
          alt={file.name}
          width={48}
          height={48}
          loading="lazy"
          className="aspect-square shrink-0 rounded-md object-cover"
        />
        <div className="flex flex-col flex-grow min-w-0">
          <p className="line-clamp-1 text-sm font-medium text-foreground/80 break-all">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {typeof progress === 'number' && (
          <>
            {progress === -1 ? (
              <X className="size-4 text-destructive" />
            ) : progress === 100 ? (
              <CheckCircle className="size-4 text-green-500" />
            ) : (
              <Progress value={progress} className="h-1 w-20" />
            )}
          </>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onUpload}
          disabled={disabled || isUploading}
          className="h-7 px-2"
        >
          {isUploading ? <Loader2 className="size-3 animate-spin" /> : 'Tải lên'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
          disabled={disabled || isUploading}
          aria-label={`Remove preview for ${file.name}`}
          tabIndex={0}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

// Uploaded Image Card Component
interface UploadedImageCardProps {
  image: UploadedImage
  onRemove: () => void
  disabled?: boolean
}

function UploadedImageCard({ image, onRemove, disabled }: UploadedImageCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4 items-center">
        <img
          src={image.url}
          alt={image.name}
          width={48}
          height={48}
          loading="lazy"
          className="aspect-square shrink-0 rounded-md object-cover"
        />
        <div className="flex flex-col flex-grow min-w-0">
          <p className="line-clamp-1 text-sm font-medium text-foreground/80 break-all">{image.name}</p>
          <p className="text-xs text-muted-foreground">Đã tải lên</p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove uploaded image ${image.name}`}
          tabIndex={0}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
