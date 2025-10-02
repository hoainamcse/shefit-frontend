import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { auth } from '@/auth'
import { isActiveSubscription } from '@/utils/business'
import { getUserSubscriptions } from '@/network/server/users'

export default async function SubscriptionInfo({ subscriptionId }: { subscriptionId: string }) {
  const session = await auth()

  if (!session?.user) return null

  const { data: userSubscriptions } = await getUserSubscriptions(Number(session.user.id))

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
