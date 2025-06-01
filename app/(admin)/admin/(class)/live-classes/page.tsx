import { Metadata } from 'next'

import { ContentLayout } from '@/components/admin-panel/content-layout'

import LiveClassesPageClient from './page-client'
import { getCourses } from '@/network/server/courses-admin'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Quản lý khoá tập Zoom',
  description: '',
}

export default async function LiveClassesPage() {
  const data = await getCourses('live', false)

  return (
    <ContentLayout title="Khoá tập Zoom">
      <LiveClassesPageClient data={data} />
    </ContentLayout>
  )
}
