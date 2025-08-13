import { BoxIcon, HouseIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getUser } from '@/network/server/users'
import EditAccountForm from '@/components/forms/edit-account-form'
import { UserSubscriptionView } from './user-subscription-view'

export default async function EditUserPage({ params }: { params: Promise<{ user_id: string }> }) {
  const { user_id } = await params
  const data = await getUser(user_id)

  return (
    <ContentLayout title="Chỉnh sửa tài khoản">
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <HouseIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Thông tin tài khoản người dùng
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <BoxIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Thông tin các gói tập của người dùng
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="tab-1">
          <EditAccountForm data={data.data} />
        </TabsContent>

        <TabsContent value="tab-2">
          <UserSubscriptionView userID={Number(user_id)} userRole={data.data.role} />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  )
}
