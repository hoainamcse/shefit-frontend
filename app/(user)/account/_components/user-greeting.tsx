'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { getUser } from '@/network/client/users'

export default function UserGreeting() {
  const { session } = useSession()
  const [fullname, setFullname] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        try {
          const userData = await getUser(session.userId)
          setFullname(userData?.data?.fullname || '')
        } catch (error) {
          console.error('Failed to fetch user:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchUser()
  }, [session])

  return (
    <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-[#FF7873] text-2xl lg:text-4xl leading-[33px] lg:leading-[60px] mb-4 md:mb-10">
      {loading ? <div>Loading...</div> : `Xin chào ${fullname || 'chị'}`}
    </div>
  )
}
