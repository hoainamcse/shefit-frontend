'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CurrentCart from './current-cart'
import PurchasedOrder from './purchased-order'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

export default function Cart() {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()

  if (!session) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <p className="text-lg">HÃY ĐĂNG NHẬP ĐỂ XEM GIỎ HÀNG</p>
        <div className="flex gap-4 justify-center w-full px-10">
          <Button className="bg-[#13D8A7] rounded-full w-full text-lg max-w-[200px]" onClick={redirectToLogin}>
            Đăng nhập
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-3xl mx-auto px-4 lg:px-14">
      <Tabs defaultValue="current-cart">
        <TabsList className="w-full bg-background gap-x-20 mb-10">
          <TabsTrigger value="current-cart" className="w-1/2 !shadow-none text-xl lg:text-2xl text-ring">
            Giỏ hàng
          </TabsTrigger>
          <TabsTrigger value="purchased-order" className="w-1/2 !shadow-none text-xl lg:text-2xl text-ring">
            Đơn hàng đã mua
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current-cart">
          <CurrentCart />
        </TabsContent>
        <TabsContent value="purchased-order">
          <PurchasedOrder />
        </TabsContent>
      </Tabs>
    </div>
  )
}
