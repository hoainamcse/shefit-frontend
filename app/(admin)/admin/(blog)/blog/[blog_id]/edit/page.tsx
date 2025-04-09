'use client'

import * as React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateBlogForm } from '@/components/forms/create-blog-form'
import { useParams } from 'next/navigation';
import { mockBlogs } from '../../page';

export default function EditBlogPage() {
  

  const params = useParams();
        const blogId = params.blog_id as string;
        
        // Find the blog with the matching ID
    const blog = mockBlogs.find(blog => blog.id === blogId);
  return (
    <ContentLayout title="Bài viết">
      <CreateBlogForm data={blog} typeForm="edit" onSuccess={() => {}} />
    </ContentLayout>
  )
}
