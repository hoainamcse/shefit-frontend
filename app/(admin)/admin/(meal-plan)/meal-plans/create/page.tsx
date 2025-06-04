'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditMealPlanForm } from '@/components/forms/edit-meal-plan-form'
import { useRouter } from 'next/navigation'

export default function CreateMealPlanPage() {
  const router = useRouter()
  return (
    <ContentLayout title="Tạo thực đơn">
      <EditMealPlanForm onSuccess={(data) => router.push(`/admin/meal-plans/${data.id}`)} />
    </ContentLayout>
  )
}
