import { Metadata } from 'next'

import { getCourses } from '@/network/server/courses'
import { ContentLayout } from '@/components/admin-panel/content-layout'

import VideoClassesPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Quản lý khoá học Video',
  description: '',
}

export default async function VideoClassesPage() {
  const data = await getCourses()

  return (
    <ContentLayout title="Khoá học Video">
      <VideoClassesPageClient data={data} />
    </ContentLayout>
  )
}
