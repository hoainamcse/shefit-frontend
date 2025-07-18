'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/image-uploader'
import { FileMetadata, getFiles, getS3FileUrl } from '@/network/client/upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Copy } from 'lucide-react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { useQuery } from '@tanstack/react-query'
import { sortByKey } from '@/lib/helpers'
import { useClipboard } from '@/hooks/use-clipboard'

interface FormData {
  images: string[]
}

export default function ImagesPage() {
  const form = useForm<FormData>({
    defaultValues: {
      images: [],
    },
  })

  const {
    data: uploadedImages = [],
    isLoading: loading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const response = await getFiles()
      if (response.status === 'success') {
        return response.data
      }
      throw new Error('Failed to fetch images')
    },
    select: (data) => data.filter((file) => !file.is_deleted),
  })

  const sortedImages = sortByKey(uploadedImages, 'created_at', {
    direction: 'desc',
    transform: (val) => new Date(val).getTime(),
  })

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
                  className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={getS3FileUrl(image.s3_key)}
                      alt={image.filename}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
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
                          onClick={() => copy(getS3FileUrl(image.s3_key))}
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
        </CardContent>
      </Card>
    </ContentLayout>
  )
}
