'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { getUserById } from '@/network/server/user'

export default function UserGreeting() {
  const { session } = useSession()
  const [fullname, setFullname] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        try {
          const userData = await getUserById(session.userId)
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
    <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-[30px] sm:text-[40px] leading-[33px] sm:leading-[60px] font-bold mb-8 sm:mb-10">
      {loading ? <div>Loading...</div> : `Xin chào ${fullname || 'chị'}`}
    </div>
  )
}
