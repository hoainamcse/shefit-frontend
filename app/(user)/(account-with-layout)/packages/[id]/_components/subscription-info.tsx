import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { verifySession } from '@/lib/dal'
import { getUserSubscriptions } from '@/network/server/users'

export default async function SubscriptionInfo({ subscriptionId }: { subscriptionId: string }) {
  const session = await verifySession()

  if (!session) return null

  const { data: userSubscriptions } = await getUserSubscriptions(session?.userId || 0)

  const userSubscription = userSubscriptions.find((sub) => sub.subscription.id === Number(subscriptionId))

  if (!userSubscription) return null

  return (
    <div>
      <div className="flex items-center mb-2">
        {isActiveSubscription(userSubscription.status, userSubscription.subscription_end_at) ? (
          <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#13D8A7] text-base rounded-none border border-[#000000]">
            Còn hạn
          </Button>
        ) : (
          <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#E61417] text-base rounded-none border border-[#000000]">
            Hết hạn
          </Button>
        )}
      </div>
      <div className="flex gap-2 items-center mb-2 text-[#737373] text-sm lg:text-lg">
        <span>Ngày bắt đầu:</span>
        <span>{format(new Date(userSubscription.subscription_start_at), 'dd/MM/yyyy')}</span>
      </div>
      <div className="flex gap-2 items-center mb-2 text-[#737373] text-sm lg:text-lg">
        <span>Ngày kết thúc:</span>
        <span>{format(new Date(userSubscription.subscription_end_at), 'dd/MM/yyyy')}</span>
      </div>
      {userSubscription.coupon && (
        <div className="flex gap-2 items-center mb-2 text-[#737373] text-sm lg:text-lg">
          <span>Promocode:</span>
          <span>{userSubscription.coupon.code}</span>
        </div>
      )}
    </div>
  )
}

function isActiveSubscription(status: string, endDate: string) {
  const now = new Date()
  const end = new Date(endDate)
  return status === 'active' && end > now
}
