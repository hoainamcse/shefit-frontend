"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getUserSubscriptions } from "@/network/server/user-subscriptions"
import { getSubscription } from "@/network/server/subscriptions"
import { useAuth } from "@/components/providers/auth-context"
import { useEffect, useState } from "react"

export default function ListSubscriptions() {
  const { userId } = useAuth()
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([])
  const [subscriptionNames, setSubscriptionNames] = useState<{ [key: number]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
  const isLoggedIn = !!userId

  useEffect(() => {
    async function fetchData() {
      if (!isLoggedIn) return

      try {
        const userSubsResponse = await getUserSubscriptions(userId)
        if (userSubsResponse.data && userSubsResponse.data.length > 0) {
          setUserSubscriptions(userSubsResponse.data)
          setSelectedSubscription(userSubsResponse.data[0])

          const namesPromises = userSubsResponse.data.map(async (sub) => {
            if (sub.subscription_id) {
              const subResponse = await getSubscription(sub.subscription_id)
              return { id: sub.subscription_id, name: subResponse.data?.name }
            }
            return null
          })

          const subscriptionData = await Promise.all(namesPromises)
          const namesMap: { [key: number]: string } = {}

          subscriptionData.forEach((item) => {
            if (item && item.id && item.name) {
              namesMap[item.id] = item.name
            }
          })

          setSubscriptionNames(namesMap)
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isLoggedIn])

  const handleSubscriptionChange = (value: string) => {
    const subscriptionId = parseInt(value)
    const subscription = userSubscriptions.find((sub) => sub.subscription_id === subscriptionId)
    if (subscription) {
      setSelectedSubscription(subscription)
    }
  }

  const isActive = selectedSubscription?.status === "active"
  const currentDate = new Date()
  const endDate = selectedSubscription?.subscription_end_at ? new Date(selectedSubscription.subscription_end_at) : null
  const isExpired = endDate ? currentDate > endDate : false

  return isLoggedIn ? (
    <div className="flex gap-5 mb-6">
      <Select
        disabled={isLoading}
        onValueChange={handleSubscriptionChange}
        defaultValue={selectedSubscription?.subscription_id?.toString()}
      >
        <SelectTrigger className="w-[370px] h-[54px] ">
          <SelectValue placeholder={isLoading ? "Đang tải..." : "Gói member của bạn"} />
        </SelectTrigger>
        <SelectContent>
          {userSubscriptions.map((subscription) => (
            <SelectItem key={subscription?.id} value={subscription?.subscription_id?.toString()}>
              {subscriptionNames[subscription?.subscription_id] || "Đang tải..."}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isActive ? (
        <Button className="w-[160px] h-[54px] bg-[#13D8A7] text-lg">Còn hạn</Button>
      ) : (
        <Button className="w-[160px] h-[54px] bg-[#E61417] text-lg">Hết hạn</Button>
      )}

      <div className="flex flex-col justify-center text-[#737373] font-bold">
        <div>
          Ngày bắt đầu:
          <span>
            {selectedSubscription?.subscription_start_at
              ? new Date(selectedSubscription.subscription_start_at).toLocaleDateString("vi-VN")
              : ""}
          </span>
        </div>
        <div>
          Ngày kết thúc:
          <span>
            {selectedSubscription?.subscription_end_at
              ? new Date(selectedSubscription.subscription_end_at).toLocaleDateString("vi-VN")
              : ""}
          </span>
        </div>
      </div>
    </div>
  ) : null
}
