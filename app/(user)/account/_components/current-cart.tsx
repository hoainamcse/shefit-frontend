import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import { BinIcon } from "@/components/icons/BinIcon"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import FormDelivery from "./FormDelivery"
import { getCarts } from "@/network/server/cart"
import { getProduct } from "@/network/server/products"

export default async function CurrentCart() {
  const carts = await getCarts()
  if (!carts.data || !carts.data.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 w-full">
        <p className="text-2xl mb-6 text-center">Bạn chưa có sản phẩm nào, xem sản phẩm của chúng tôi</p>
        <Link href="/equipment">
          <Button className=" h-[60px] w-[586px] bg-button text-white px-6 py-2 rounded-full text-lg transition-colors">
            Mua ngay
          </Button>
        </Link>
      </div>
    )
  }
  const products = await Promise.all(carts.data[0].product_variants.map((variant) => getProduct(variant.id.toString())))
  return (
    <div className="xl:flex mt-10 w-full justify-between gap-20">
      <div className="w-full text-2xl max-lg:mb-20">
        {carts.data[0].product_variants.map((variant, index) => (
          <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
            <Image src={ShoppingImage} alt="" className="size-[148px]" />
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
            <Button className="flex gap-2 bg-white hover:bg-white shadow-none items-center">
              <BinIcon />
              <p className="text-xl text-[#DA1515] items-center">Xóa</p>
            </Button>
          </div>
        ))}
        <div className="flex justify-between mt-20">
          <div>Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold">{carts.data[0].total - carts.data[0].shipping_fee} vnđ</div>
        </div>
      </div>
      <FormDelivery />
    </div>
  )
}
