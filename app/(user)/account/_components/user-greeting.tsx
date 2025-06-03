"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-context"
import { getUserById } from "@/network/server/user"

export default function UserGreeting() {
  const { userId } = useAuth()
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userData = await getUserById(userId)
          setUsername(userData?.data?.username || "")
        } catch (error) {
          console.error("Failed to fetch user:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return (
    <div className="font-[Coiny] text-[#FF7873] text-[30px] sm:text-[40px] leading-[33px] sm:leading-[60px] font-bold mb-8 sm:mb-10 ">
      {loading ? <div>Loading...</div> : `Xin chào ${username || "chị"}`}
    </div>
  )
}
