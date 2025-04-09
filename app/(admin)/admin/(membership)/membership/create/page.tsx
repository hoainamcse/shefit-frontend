'use client'

import * as React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateMembershipForm } from '@/components/forms/create-membership-form'

export default function CreateMembershipPage() {
  

  return (
    <ContentLayout title="Tạo gói thành viên">
      <CreateMembershipForm typeForm="create" onSuccess={() => {}} />
    </ContentLayout>
  )
}