'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/image-uploader'
import { FileMetadata, getFiles, getS3FileUrl, deleteBulkFiles } from '@/network/client/upload'
import { Button } from '@/components/ui/button'
import { RefreshCw, Copy, Trash2, Loader2, Check } from 'lucide-react'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useClipboard } from '@/hooks/use-clipboard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { formatBytes } from '@/lib/helpers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface ImageItem {
  id: string
  url: string
  name: string
}

export interface ImageManagerProps {
  /**
   * Max number of images that can be selected, 0 for unlimited
   */
  maxSelect?: number

  /**
   * Called when images are selected
   */
  onConfirmSelectedImages?: (images: ImageItem[]) => void

  /**
   * Called when images are uploaded
   */
  onUploadSuccess?: (images: ImageItem[]) => void

  /**
   * Class name for the component
   */
  className?: string

  /**
   * Whether to show the upload tab
   */
  showUploadTab?: boolean

  /**
   * Custom page size for infinite query
   */
  pageSize?: number
}

export function ImageManager({
  maxSelect = 0,
  onConfirmSelectedImages,
  onUploadSuccess,
  className,
  showUploadTab = true,
  pageSize = 20,
}: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([])
  const isMaxSelected = maxSelect > 0 && selectedImages.length >= maxSelect

  // Handle clipboard operations
  const { copy, copied } = useClipboard()

  useEffect(() => {
    if (copied) {
      toast.success('Đường dẫn hình đã được sao chép')
    }
  }, [copied])

  // Load images with infinite query
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, error } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getFiles({ page: pageParam, per_page: pageSize })
      if (response.status === 'success') {
        return response
      }
      throw new Error('Failed to fetch images')
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.paging || typeof lastPage.paging.total !== 'number') {
        return undefined
      }
      const totalPages = Math.ceil(lastPage.paging.total / pageSize)
      const nextPage = allPages.length
      return nextPage < totalPages ? nextPage : undefined
    },
    initialPageParam: 0,
  })

  // Delete mutation for individual image deletion
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBulkFiles([id]),
    onSuccess: () => {
      toast.success('Image deleted successfully')
      refetch()
    },
    onError: (error) => {
      toast.error('Failed to delete image: ' + (error as Error).message)
    },
  })

  // Format file size
  const formatFileSize = (bytes: number) => {
    return formatBytes(bytes)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Flatten images from all pages and filter out deleted files
  const allImages = data?.pages.flatMap((page) => page.data.filter((file: FileMetadata) => !file.is_deleted)) || []

  // Sort images by date (most recent first)
  const filteredImages = allImages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Check if an image is selected
  const isImageSelected = useCallback(
    (id: string) => {
      return selectedImages.some((img) => img.id === id)
    },
    [selectedImages]
  )

  // Handle image selection
  const toggleImageSelection = useCallback(
    (image: FileMetadata) => {
      // Create the new image object
      const newImage = {
        id: image.s3_key,
        url: getS3FileUrl(image.s3_key),
        name: image.filename,
      }

      setSelectedImages((prev) => {
        const isAlreadySelected = prev.some((img) => img.id === image.s3_key)

        // If already selected, just remove it
        if (isAlreadySelected) {
          return prev.filter((img) => img.id !== image.s3_key)
        }

        // For single select (maxSelect=1), replace the current selection
        if (maxSelect === 1) {
          return [newImage]
        }

        // For multi-select with limit
        if (maxSelect > 0 && prev.length >= maxSelect) {
          toast.error(`You can only select up to ${maxSelect} images.`)
          return prev
        }

        // Default: add to selection
        return [...prev, newImage]
      })
    },
    [maxSelect]
  )

  // Handle upload success
  const handleUploadSuccess = (images: ImageItem[]) => {
    refetch()

    if (onUploadSuccess) {
      onUploadSuccess(images)
    }
  }

  // Remove automatic callback when selectedImages changes
  // We'll let the parent component handle confirmation explicitly

  // No longer need a confirmation handler as it's moved to parent component

  return (
    <div className={cn('flex flex-col h-full max-h-full', className)}>
      {/* Tabs Navigation */}
      <Tabs defaultValue="upload" className="flex flex-col h-full">
        <div className="flex justify-between items-center pb-4 flex-shrink-0 border-b">
          <TabsList>
            {showUploadTab && <TabsTrigger value="upload">Tải lên</TabsTrigger>}
            <TabsTrigger value="gallery">Thư viện</TabsTrigger>
          </TabsList>

          {onConfirmSelectedImages && selectedImages.length > 0 && (
            <Button
              size="sm"
              onClick={() => {
                onConfirmSelectedImages(selectedImages)
                setSelectedImages([])
              }}
            >
              Xác nhận ({selectedImages.length})
            </Button>
          )}
        </div>

        {/* Upload Tab */}
        {showUploadTab && (
          <TabsContent value="upload" className="flex-grow mt-0 pt-4 border-0">
            <div className="h-full">
              <ImageUploader onSuccess={handleUploadSuccess} label="Tải lên hình ảnh" className="w-full" />
            </div>
          </TabsContent>
        )}

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="flex-col flex-grow min-h-0 mt-0 pt-4 border-0 overflow-hidden">
          {/* Gallery content with proper overflow handling */}
          <div className="flex-grow min-h-0 relative">
            {error ? (
              <div className="text-red-500 text-center py-8 absolute inset-0 flex items-center justify-center">
                <p>Failed to load images. Please try again later.</p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8 absolute inset-0">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                <span>Loading images...</span>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground absolute inset-0 flex flex-col items-center justify-center">
                <p>No images uploaded yet. Go to Upload tab to add images.</p>
              </div>
            ) : (
              <ScrollArea className="h-full pr-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredImages.map((image: FileMetadata) => (
                    <div
                      key={image.id}
                      className={cn(
                        'group relative border rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-card',
                        isImageSelected(image.s3_key) && 'ring-2 ring-primary',
                        isMaxSelected && !isImageSelected(image.s3_key) && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => toggleImageSelection(image)}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={getS3FileUrl(image.s3_key)}
                          alt={image.filename}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        {isImageSelected(image.s3_key) && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        {/* Hover actions overlay - Copy URL and Delete buttons */}
                        {!onConfirmSelectedImages && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                copy(getS3FileUrl(image.s3_key))
                              }}
                              title="Copy URL"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteMutation.mutate(image.id)
                              }}
                              title="Delete image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="font-medium text-xs truncate" title={image.filename}>
                          {image.filename}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatFileSize(image.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {hasNextPage && (
                  <div className="mt-6 mb-2 flex justify-center">
                    <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang tải thêm...
                        </>
                      ) : (
                        'Tải thêm hình ảnh'
                      )}
                    </Button>
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* No footer in this component anymore - it's moved to parent */}
    </div>
  )
}
