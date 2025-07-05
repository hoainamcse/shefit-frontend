import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateAccountForm from '@/components/forms/create-account-form'
import { getUser } from '@/network/server/users'

export default async function UserPage({ params }: { params: Promise<{ user_id: string }> }) {
  const { user_id } = await params
  const data = await getUser(user_id)

  return (
    <ContentLayout title="Chỉnh sửa tài khoản">
      {data.data && <CreateAccountForm data={data.data} />}
    </ContentLayout>
  )
}
