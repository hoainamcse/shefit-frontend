import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import { BinIcon } from "@/components/icons/BinIcon"
import { Button } from "@/components/ui/button"
import FormDelivery from "./FormDelivery"
import { getCarts } from "@/network/server/cart"
import { getProduct } from "@/network/server/products"
export default async function CurrentCart() {
  const carts = await getCarts()
  const products = await Promise.all(carts.data[0].product_variants.map((variant) => getProduct(variant.id.toString())))
  console.log("carts", carts.data[0])
  console.log("products", products)
  console.log("product_variants", carts.data[0].product_variants)
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
        <div className="flex justify-between mt-10">
          <div>Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold">{carts.data[0].total - carts.data[0].shipping_fee} vnđ</div>
        </div>
      </div>
      <FormDelivery />
    </div>
  )
}
