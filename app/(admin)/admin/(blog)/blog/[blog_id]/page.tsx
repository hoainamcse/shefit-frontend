import * as React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateBlogForm } from '@/components/forms/create-blog-form'
import { getDetailBlog } from '@/network/server/blog'

export default async function EditBlogPage({ params }: { params: Promise<{ blog_id: string }> }) {
  const { blog_id } = await params
  const blog = await getDetailBlog(blog_id)

  return (
    <ContentLayout title="Bài viết">
      <CreateBlogForm data={blog.data} isEdit={true} />
    </ContentLayout>
  )
}
