import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateAccountForm from '@/components/forms/create-account-form'
import { CreateCourseForm } from '@/components/forms/create-course-form'
import { getUserById } from '@/network/server/user'

export default async function AccountPage({ params }: { params: Promise<{ account_id: string }> }) {
  const { account_id } = await params
  const account = await getUserById(account_id)

  return (
    <ContentLayout title="Cập nhật tài khoản">
      <CreateAccountForm data={account.data || {}} />
    </ContentLayout>
  )
}
