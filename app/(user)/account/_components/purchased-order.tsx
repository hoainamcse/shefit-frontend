import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import Link from "next/link"
import { getCarts } from "@/network/server/cart"
import { getProduct } from "@/network/server/products"

export default async function PurchasedOrder() {
  const carts = await getCarts()
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
            <Link
              href={`/account/cart/${carts.data[0].id}`}
              className="flex gap-2 bg-white hover:bg-white shadow-none items-center"
            >
              <p className="text-xl text-[#00C7BE] items-center">Xem chi tiết</p>
            </Link>
          </div>
        ))}
        <div className="flex justify-between mt-10">
          <div>Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold">{carts.data[0].total - carts.data[0].shipping_fee} vnđ</div>
        </div>
      </div>
    </div>
  )
}
