import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import FormCartDetail from './_components/form-cart-detail'
import { getCart } from '@/network/server/carts'

export default async function CartDetail({ params }: { params: Promise<{ id: number }> }) {
  const { id: cartID } = await params
  const cart = await getCart(cartID)
  const productVariants = cart.data.product_variants || []

  return (
    <div className="max-w-screen-3xl mx-auto px-2 lg:px-14">
      <Link href="/account/carts">
        <Button className="bg-white hover:bg-white shadow-none items-center text-black my-10">
          <BackIconBlack /> <div className="text-lg items-center">Chi tiết đơn hàng</div>
        </Button>
      </Link>
      <div className="xl:flex mt-10 w-full justify-between gap-20">
        <div className="w-full max-lg:mb-20">
          {productVariants.map((variant: any, index: number) => (
            <div key={`menu-${variant.id}`} className="flex gap-2 w-full mb-5">
              <img
                src={variant.image_urls[0]}
                alt=""
                className="size-[148px] rounded-lg flex-shrink-0"
              />
              <div className="flex flex-col gap-3">
                <div className="font-medium text-sm lg:text-lg">{variant.name}</div>
                <div className="text-[#737373] text-sm lg:text-lg">{variant.color?.name}</div>
                <div className="text-[#737373] text-sm lg:text-lg">Size: {variant.size?.size}</div>
                <div className="text-[#737373] text-sm lg:text-lg">Số lượng: {variant.quantity}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[#737373] text-sm lg:text-lg">
                  <span>{variant.price.toLocaleString() || 0}</span> VNĐ
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-10 text-xl items-center">
            <div className="flex justify-between w-full">
              <div className="text-sm lg:text-lg">Phí vận chuyển</div>
              <div className="text-[#737373] text-sm lg:text-lg">{cart.data.shipping_fee.toLocaleString()} VNĐ</div>
            </div>
            <div className="flex justify-between w-full">
              <div className="text-sm lg:text-lg">Tổng tiền</div>
              <div className="text-[#00C7BE] font-semibold text-lg lg:text-xl">
                {cart.data.total.toLocaleString()} VNĐ
              </div>
            </div>
          </div>
        </div>
        <FormCartDetail params={{ id: cartID.toString() }} />
      </div>
    </div>
  )
}
