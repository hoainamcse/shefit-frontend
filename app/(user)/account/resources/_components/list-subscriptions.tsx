'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UserSubscription } from '@/models/user-subscriptions'
import { useSession } from '@/hooks/use-session'
import { useSubscription } from './subscription-provider'
import { isActiveSubscription } from '@/utils/business'

export default function ListSubscriptions() {
  const { session } = useSession()
  const { selectedSubscription, showFavorites, setSelectedResource, isLoading, userSubscriptions } = useSubscription()

  const handleSubscriptionChange = async (value: string) => {
    if (value === 'favorites') {
      setSelectedResource('favorites')
      return
    }

    const subscriptionId = parseInt(value)
    const subscription = userSubscriptions.find((sub: UserSubscription) => sub.id === subscriptionId)
    if (subscription) {
      setSelectedResource(subscription)
    }
  }

  const isActive = selectedSubscription
    ? isActiveSubscription(selectedSubscription.status, selectedSubscription.subscription_end_at)
    : false

  return session ? (
    <div className="flex flex-col lg:flex-row gap-5 mb-6 w-full">
      <div className="relative w-full lg:w-[370px]">
        <Select
          value={showFavorites ? 'favorites' : selectedSubscription?.id?.toString() || ''}
          onValueChange={handleSubscriptionChange}
        >
          <SelectTrigger className="w-full h-[54px] text-left">
            <SelectValue placeholder={isLoading ? 'Đang tải...' : 'Gói member của bạn'} />
          </SelectTrigger>
          <SelectContent className="w-full max-h-[300px] overflow-y-auto">
            {userSubscriptions.map((subscription: UserSubscription) => {
              const subscriptionId = subscription.id.toString()

              return (
                <SelectItem key={subscriptionId} value={subscriptionId} className="cursor-pointer hover:bg-gray-100">
                  {subscription.subscription.name}
                </SelectItem>
              )
            })}
            <SelectItem key="favorites" value="favorites">
              Yêu thích
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!showFavorites && (
        <>
          {isActive ? (
            <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#13D8A7] text-base rounded-none border border-[#000000]">
              Còn hạn
            </Button>
          ) : (
            <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#E61417] text-base rounded-none border border-[#000000]">
              Hết hạn
            </Button>
          )}

          <div className="flex lg:flex-row gap-5 mt-auto text-base justify-between text-[#737373] font-bold">
            <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
              <div className="flex gap-2">
                <div>Ngày bắt đầu:</div>
                <span>
                  {selectedSubscription?.subscription_start_at
                    ? new Date(selectedSubscription.subscription_start_at).toLocaleDateString('vi-VN')
                    : ''}
                </span>
              </div>
              <div className="flex gap-2">
                <div>Ngày kết thúc:</div>
                <span>
                  {selectedSubscription?.subscription_end_at
                    ? new Date(selectedSubscription.subscription_end_at).toLocaleDateString('vi-VN')
                    : ''}
                </span>
              </div>
            </div>
            {selectedSubscription?.coupon && (
              <div className="flex gap-2">
                <div>Promocode:</div>
                <span>{selectedSubscription?.coupon.code}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  ) : null
}
