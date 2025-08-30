import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ImageManager } from '@/components/image-manager'

export default function ImagesPage() {
  return (
    <ContentLayout title="Thư viện Hình ảnh">
      <ImageManager pageSize={30} />
    </ContentLayout>
  )
}
