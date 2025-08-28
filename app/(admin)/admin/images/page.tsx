'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/image-uploader'
import { FileMetadata, getFiles, getS3FileUrl, deleteBulkFiles } from '@/network/client/upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Copy, Trash2, Loader2 } from 'lucide-react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useClipboard } from '@/hooks/use-clipboard'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface FormData {
  images: string[]
}

export default function ImagesPage() {
  const form = useForm<FormData>({
    defaultValues: {
      images: [],
    },
  })

  const PAGE_SIZE = 20
  const queryClient = useQueryClient()
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    data,
    isLoading: loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getFiles({ page: pageParam, per_page: PAGE_SIZE })
      if (response.status === 'success') {
        return response
      }
      throw new Error('Failed to fetch images')
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.paging || typeof lastPage.paging.total !== 'number') {
        return undefined
      }
      const totalPages = Math.ceil(lastPage.paging.total / PAGE_SIZE)
      const nextPage = allPages.length
      return nextPage < totalPages ? nextPage : undefined
    },
    initialPageParam: 0,
  })

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteBulkFiles(ids),
    onSuccess: () => {
      toast.success('Xóa hình ảnh thành công')
      setSelectedImages([])
      queryClient.invalidateQueries({ queryKey: ['images'] })
    },
    onError: (error) => {
      toast.error('Không thể xóa hình ảnh: ' + (error as Error).message)
    },
  })

  const handleDeleteImages = () => {
    if (selectedImages.length > 0) {
      deleteMutation.mutate(selectedImages)
      setIsDeleteDialogOpen(false)
    }
  }

  const toggleSelectImage = (id: number) => {
    setSelectedImages((prev) => (prev.includes(id) ? prev.filter((imageId) => imageId !== id) : [...prev, id]))
  }

  // Flatten the pages data into a single array of images
  const uploadedImages = data?.pages.flatMap((page) => page.data.filter((file: FileMetadata) => !file.is_deleted)) || []

  // Sort images by created_at in descending order
  const sortedImages = [...uploadedImages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const handleRefresh = () => {
    refetch()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const { copy, copied } = useClipboard()

  useEffect(() => {
    if (copied) {
      toast.success('Đã sao chép liên kết hình ảnh vào bộ nhớ tạm')
    }
  }, [copied])

  return (
    <ContentLayout
      title="Quản lý hình ảnh"
      rightSection={
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Tải lại
        </Button>
      }
    >
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tải lên hình ảnh mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <ImageUploader
              form={form}
              name="images"
              label="Chọn hình ảnh để tải lên"
              maxFileCount={5}
              maxSize={5 * 1024 * 1024} // 5MB
              accept={{ 'image/*': ['.jpeg', '.png', '.webp', '.gif'] }}
            />
          </form>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Hình ảnh đã tải lên ({sortedImages.length})</span>
            <div className="flex items-center gap-2">
              {selectedImages.length > 0 && (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa {selectedImages.length} hình ảnh
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {`Thao tác này sẽ xóa ${selectedImages.length} hình ảnh đã chọn và không thể hoàn tác.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteImages}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 text-center py-8">
              <p>Không thể tải hình ảnh. Vui lòng thử lại sau.</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Đang tải hình ảnh...</span>
            </div>
          ) : sortedImages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có hình ảnh nào được tải lên.</p>
              <p className="text-sm">Sử dụng trình tải lên ở trên để thêm hình ảnh mới.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedImages.map((image) => (
                <div
                  key={image.id}
                  className={`group relative border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow ${
                    selectedImages.includes(image.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleSelectImage(image.id)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={getS3FileUrl(image.s3_key)}
                      alt={image.filename}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    {selectedImages.includes(image.id) && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <p className="font-medium text-sm truncate" title={image.filename}>
                        {image.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(image.size)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(image.created_at)}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            copy(getS3FileUrl(image.s3_key))
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
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
        </CardContent>
      </Card>
    </ContentLayout>
  )
}
