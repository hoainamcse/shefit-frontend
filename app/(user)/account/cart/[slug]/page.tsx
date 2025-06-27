import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import FormCartDetail from '@/app/(user)/account/_components/FormCartDetail'
import { getCart } from '@/network/server/cart'
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
                <div className="font-medium text-lg lg:text-xl">{products[index]?.data?.name || 'Sản phẩm'}</div>
                <div className="text-[#737373] text-lg lg:text-xl">{variant.color.name}</div>
                <div className="text-[#737373] text-lg lg:text-xl">Size: {variant.size.size}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[#737373] text-lg lg:text-xl">
                  <span>{products[index]?.data?.price?.toLocaleString() || 0}</span> VNĐ
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-10 text-2xl">
            <div>Tổng tiền</div>
            <div className="text-[#00C7BE] font-semibold">
              {(cart.data.total - cart.data.shipping_fee).toLocaleString()} vnđ
            </div>
          </div>
        </div>
        <FormCartDetail params={{ slug: slug.toString() }} />
      </div>
    </div>
  )
}
