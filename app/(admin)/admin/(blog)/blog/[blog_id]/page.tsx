
import * as React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateBlogForm } from '@/components/forms/create-blog-form'
import { mockBlogs } from '../mockData';

export default async function DetailBlogPage({params}: {
  params: Promise<{ blog_id: string }>
}) {
  
  const { blog_id } = await params
        
        // Find the blog with the matching ID
    const blog = mockBlogs.find(blog => blog.id === blog_id);
  return (
    <ContentLayout title="Bài viết">
      <CreateBlogForm data={blog} typeForm="view" onSuccess={() => {}} />
    </ContentLayout>
  )
}