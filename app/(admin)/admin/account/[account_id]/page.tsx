import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateAccountForm from '@/components/forms/create-account-form'
import { CreateCourseForm } from '@/components/forms/create-course-form'

export default async function AccountPage({ params }: { params: Promise<{ account_id: string }> }) {
  const { account_id } = await params

  return (
    <ContentLayout title="Live Class">
      <CreateAccountForm />
      {/* <CreateCourseForm format="live" /> */}
    </ContentLayout>
  )
}
