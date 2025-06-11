'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { DashboardContent } from '@/components/admin-panel/dashboard/dashboard-content'
import { useAuth } from '@/components/providers/auth-context'
import { Dashboard } from '@/models/dashboard'
import { getDashboard } from '@/network/server/dashboard'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { accessToken } = useAuth()
  if (!accessToken) return
  const [res, setRes] = useState<Dashboard>()

  useEffect(() => {
    const data = getDashboard(accessToken)
    data.then((res) => {
      setRes(res.data)
    })
  }, [])

  return <ContentLayout title="Dashboard">{res && <DashboardContent data={res} />}</ContentLayout>
}
