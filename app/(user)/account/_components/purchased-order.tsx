import Image from "next/image"
import Link from "next/link"
import { getCarts } from "@/network/server/cart"
import { getProduct } from "@/network/server/products"
import { Button } from "@/components/ui/button"

export default async function PurchasedOrder() {
  const carts = await getCarts()
  const deliveredCarts = carts.data.filter((cart) => cart.status === "delivered")
  if (!deliveredCarts.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 w-full">
        <p className="text-2xl mb-6 text-center">Bạn chưa có sản phẩm nào, xem sản phẩm của chúng tôi</p>
        <Link href="/products">
          <Button className=" h-[60px] w-[586px] bg-[#13D8A7] text-white px-6 py-2 rounded-full text-lg transition-colors">
            Mua ngay
          </Button>
        </Link>
      </div>
    )
  }
  const products = await Promise.all(
    deliveredCarts[0].product_variants.map((variant) => getProduct(variant.id.toString()))
  )
  return (
    <div className="xl:flex mt-20 w-full justify-between gap-20">
      <div className="w-full text-2xl max-lg:mb-20">
        {deliveredCarts[0].product_variants.map((variant, index) => (
          <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
            <Image src={variant.image_urls[0]} alt="" className="size-[148px]" />
            <div>
              <div className="font-medium">{products[index].data.name}</div>
              <div className="text-[#737373]">Size: {variant.size.size}</div>
            </div>
            <div className="text-[#737373]">
              <div>
                <span>{products[index].data.price}</span> vnđ
              </div>
              <div>Color: {variant.color.name}</div>
            </div>
            <Link
              href={`/account/cart/${deliveredCarts[0].id}`}
              className="flex gap-2 bg-white hover:bg-white shadow-none items-center"
            >
              <p className="text-xl text-[#00C7BE] items-center">Xem chi tiết</p>
            </Link>
          </div>
        ))}
        <div className="flex justify-between mt-20">
          <div>Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold">
            {deliveredCarts[0].total - deliveredCarts[0].shipping_fee} vnđ
          </div>
        </div>
      </div>
    </div>
  )
}
