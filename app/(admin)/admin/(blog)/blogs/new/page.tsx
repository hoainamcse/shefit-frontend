import { getTopics } from '@/network/server/topics'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditBlogForm } from '@/components/forms/edit-blog-form'

export default async function CreateBlogPage() {
  const topics = await getTopics()

  return (
    <ContentLayout title="Thêm bài viết">
      <EditBlogForm topics={topics.data} />
    </ContentLayout>
  )
}
