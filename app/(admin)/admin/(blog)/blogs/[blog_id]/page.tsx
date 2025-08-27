import type { Blog } from '@/models/blog'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditBlogForm } from '@/components/forms/edit-blog-form'
import { getBlog } from '@/network/server/blogs'
import { getTopics } from '@/network/server/topics'

export default async function EditBlogPage({ params }: { params: Promise<{ blog_id: Blog['id'] }> }) {
  const { blog_id } = await params
  const [blog, topics] = await Promise.all([getBlog(blog_id), getTopics()])

  return (
    <ContentLayout title="Chỉnh sửa bài viết">
      <EditBlogForm data={blog.data} topics={topics.data} />
    </ContentLayout>
  )
}
