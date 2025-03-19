import { Metadata } from 'next'

import { getCourses } from '@/network/server/courses'
import { ContentLayout } from '@/components/admin-panel/content-layout'

import LiveClassesPageClient from './page-client'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Quản lý khoá học Zoom',
  description: '',
}

export default async function LiveClassesPage() {
  const data = await getCourses('live')

  return (
    <ContentLayout title="Khoá học Zoom">
      <LiveClassesPageClient data={data} />
    </ContentLayout>
  )
}
