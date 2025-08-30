'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CurrentCart from './_components/current-cart'
import PurchasedOrder from './_components/purchased-order'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { useState, useEffect } from 'react'

export default function Cart() {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [activeTab, setActiveTab] = useState('current-cart')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSessionReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!isSessionReady) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <p className="text-base">HÃY ĐĂNG NHẬP ĐỂ XEM GIỎ HÀNG</p>
        <div className="flex gap-4 justify-center w-full px-10">
          <Button className="bg-[#13D8A7] rounded-full w-full text-base max-w-[200px]" onClick={redirectToLogin}>
            Đăng nhập
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-3xl mx-auto px-4 lg:px-14">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-background gap-x-20 mb-10">
          <TabsTrigger value="current-cart" className="w-1/2 !shadow-none text-lg lg:text-xl text-ring">
            Giỏ hàng
          </TabsTrigger>
          <TabsTrigger value="purchased-order" className="w-1/2 !shadow-none text-lg lg:text-xl text-ring">
            Đơn hàng đã mua
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current-cart">
          <CurrentCart key="current-cart" />
        </TabsContent>
        <TabsContent value="purchased-order">
          <PurchasedOrder key="purchased-order" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
