import type { Blog } from '@/models/blog'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditBlogForm } from '@/components/forms/edit-blog-form'
import { getBlog } from '@/network/client/blogs'

export default async function EditBlogPage({ params }: { params: Promise<{ blog_id: Blog['id'] }> }) {
  const { blog_id } = await params
  const data = await getBlog(blog_id)

  return (
    <ContentLayout title="Chỉnh sửa bài viết">
      <EditBlogForm data={data.data} />
    </ContentLayout>
  )
}
