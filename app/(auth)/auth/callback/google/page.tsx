'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { handleGoogleCallback, signIn } from '@/network/server/auth'
import { toast } from 'sonner'
import { Suspense } from 'react'

function GoogleCallback() {
  const searchParams = useSearchParams()
  const query = searchParams ? `?${searchParams.toString()}` : ''
  const redirectUri = searchParams?.get('redirect')

  const handleCallback = async () => {
    try {
      const res = await handleGoogleCallback(
        query + `&redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`)}`
      )
      await signIn(res)

      if (redirectUri) {
        window.location.href = redirectUri
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      console.error(error)
      toast.error('Đăng nhập thất bại!')
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
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      }
    >
      <GoogleCallback />
    </Suspense>
  )
}
