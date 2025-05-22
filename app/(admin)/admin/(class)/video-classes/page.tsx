import { Metadata } from 'next'

import { ContentLayout } from '@/components/admin-panel/content-layout'

import VideoClassesPageClient from './page-client'
import { getCourses } from '@/network/server/courses-admin'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Quản lý khoá học Video',
  description: '',
}

export default async function VideoClassesPage() {
  const data = await getCourses('video', false)

  return (
    <ContentLayout title="Khoá học Video">
      <VideoClassesPageClient data={data} />
    </ContentLayout>
  )
}
