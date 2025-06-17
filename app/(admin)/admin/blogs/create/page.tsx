'use client'

import { useRouter } from 'next/navigation'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditBlogForm } from '@/components/forms/edit-blog-form'

export default function CreateBlogPage() {
  const router = useRouter()
  return (
    <ContentLayout title="Thêm bài viết">
      <EditBlogForm onSuccess={() => router.push(`/admin/blogs`)} />
    </ContentLayout>
  )
}
