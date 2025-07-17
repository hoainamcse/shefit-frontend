import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import FormCartDetail from '@/app/(user)/account/_components/FormCartDetail'
import { getCart } from '@/network/server/carts'
import { getProduct } from '@/network/server/products'

export default async function CartDetail({ params }: { params: Promise<{ slug: number }> }) {
  const { slug } = await params
  const cart = await getCart(slug)
  const productVariants = cart.data.product_variants || []
  const products = await Promise.all(productVariants.map((variant: any) => getProduct(variant.product_id.toString())))

  return (
    <div className="max-w-screen-3xl mx-auto px-2 lg:px-14">
      <Link href="/account?tab=cart">
        <Button className="bg-white hover:bg-white shadow-none items-center text-black my-10">
          <BackIconBlack /> <div className="text-xl items-center">Chi tiết đơn hàng</div>
        </Button>
      </Link>
      <div className="xl:flex mt-10 w-full justify-between gap-20">
        <div className="w-full max-lg:mb-20">
          {productVariants.map((variant: any, index: number) => (
            <div key={`menu-${variant.id}`} className="flex gap-2 w-full mb-5">
              <img
                src={products[index]?.data?.image_urls[0]}
                alt=""
                className="size-[148px] rounded-lg flex-shrink-0"
              />
              <div className="flex flex-col gap-3">
                <div className="font-medium text-base lg:text-xl">{products[index]?.data?.name}</div>
                <div className="text-[#737373] text-base lg:text-xl">{variant.color.name}</div>
                <div className="text-[#737373] text-base lg:text-xl">Size: {variant.size.size}</div>
                <div className="text-[#737373] text-base lg:text-xl">Số lượng: {variant.quantity}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[#737373] text-base lg:text-xl">
                  <span>{products[index]?.data?.price?.toLocaleString() || 0}</span> VNĐ
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-10 text-2xl items-center">
            <div className="flex justify-between w-full">
              <div className="text-base lg:text-xl">Phí vận chuyển</div>
              <div className="text-[#737373] text-base lg:text-xl">{cart.data.shipping_fee.toLocaleString()} VNĐ</div>
            </div>
            <div className="flex justify-between w-full">
              <div className="text-base lg:text-xl">Tổng tiền</div>
              <div className="text-[#00C7BE] font-semibold text-xl lg:text-2xl">
                {cart.data.total.toLocaleString()} VNĐ
              </div>
            </div>
          </div>
        </div>
        <FormCartDetail params={{ slug: slug.toString() }} />
      </div>
    </div>
  )
}
