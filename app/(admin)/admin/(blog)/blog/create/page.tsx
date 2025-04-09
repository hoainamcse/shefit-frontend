'use client'

import * as React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateBlogForm } from '@/components/forms/create-blog-form'

export default function CreateBlogPage() {
  

  return (
    <ContentLayout title="Tạo bài viết">
      <CreateBlogForm typeForm="create" onSuccess={() => {}} />
    </ContentLayout>
  )
}