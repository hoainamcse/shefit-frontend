'use client'

import { useRouter } from 'next/navigation'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditMealPlanForm } from '@/components/forms/edit-meal-plan-form'

export default function CreateBlogPage() {
  const router = useRouter()
  return (
    <ContentLayout title="Thêm bài viết">
      <EditMealPlanForm onSuccess={() => router.push(`/admin/blogs`)} />
    </ContentLayout>
  )
}
