"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { handleGoogleCallback } from "@/network/server/auth"
import { toast } from "sonner"
import { Suspense } from "react"

function GoogleCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleCallback = async () => {
    try {
      const res = await handleGoogleCallback(
        searchParams.toString() +
          `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL || "")}`
      )
      localStorage.setItem("access_token", res.access_token)
      localStorage.setItem("refresh_token", res.refresh_token)
      router.push("/")
    } catch (error) {
      console.error(error)
      toast.error("Đăng nhập thất bại!")
    }
  }
  useEffect(() => {
    if (searchParams) {
      handleCallback()
    }
  }, [searchParams])

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Đang xác thực...</p>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <p>Đang tải...</p>
        </div>
      }
    >
      <GoogleCallback />
    </Suspense>
  )
}
