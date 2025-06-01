import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackIconBlack } from "@/components/icons/BackIconBlack"
import FormCartDetail from "@/app/(user)/account/_components/FormCartDetail"
import { getCart } from "@/network/server/cart"
import { getProduct } from "@/network/server/products"

export default async function CartDetail({ params }: { params: Promise<{ slug: number }> }) {
  const { slug } = await params
  const cart = await getCart(slug)
  const productVariants = cart.data.product_variants || []
  const products = await Promise.all(productVariants.map((variant: any) => getProduct(variant.id.toString())))

  return (
    <div className="max-w-screen-3xl mx-auto px-14">
      <Link href="/account?tab=cart">
        <Button className="bg-white hover:bg-white shadow-none items-center text-black my-10">
          <BackIconBlack /> <div className="text-xl items-center">Chi tiết đơn hàng</div>
        </Button>
      </Link>
      <div className="xl:flex mt-10 w-full justify-between gap-20">
        <div className="w-full text-2xl max-lg:mb-20">
          {productVariants.map((variant: any, index: number) => (
            <div key={`menu-${variant.id}`} className="flex justify-between items-center mb-5">
              <img src={products[index]?.data?.image_urls[0]} alt="" className="size-[148px] rounded-lg" />
              <div>
                <div className="font-medium">{products[index]?.data?.name || "Sản phẩm"}</div>
                <div className="text-[#737373]">Size: {variant.size.size}</div>
              </div>
              <div>
                <div className="text-[#737373]">
                  <span>{products[index]?.data?.price?.toLocaleString() || 0}</span> vnđ
                </div>
                <div className="text-[#737373]">Color: {variant.color.name}</div>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-10">
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
