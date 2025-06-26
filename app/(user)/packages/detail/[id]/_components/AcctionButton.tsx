'use client'

import { Button } from '@/components/ui/button'
import { useSession } from '@/components/providers/session-provider'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function AcctionButton() {
  const { session } = useSession()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    async function fetchUserSubscriptions() {
      if (!session) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const subscriptionId = Number(params?.id)
        const response = await getUserSubscriptions(session.userId.toString())
        const hasSubscription =
          response.data?.some((subscription) => subscription.subscription.id === subscriptionId) ?? false

        setIsSubscribed(hasSubscription)
      } catch (error) {
        console.error('Error fetching user subscriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserSubscriptions()
  }, [session, params?.id])

  if (isLoading) {
    return (
      <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] w-full px-5 mx-auto" disabled>
        Đang tải...
      </Button>
    )
  }

  if (isSubscribed) {
    return (
      <Link href={`/packages/${params?.id}`} className="mx-auto">
        <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] w-full px-5 text-lg mx-auto">
          Gia hạn gói
        </Button>
      </Link>
    )
  }
  return (
    <Link href={`/packages/${params?.id}`} className="mx-auto">
      <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] w-full px-5 text-lg mx-auto">Mua gói</Button>
    </Link>
  )
}
