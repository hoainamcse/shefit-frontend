'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { UsersTable } from '@/components/data-table/users-table'

export default function UsersPage() {
  return (
    <ContentLayout title="Danh sách tài khoản">
      <UsersTable />
    </ContentLayout>
  )
}
