"use client"
import { BinIcon } from "@/components/icons/BinIcon"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import FormDelivery from "./FormDelivery"
import { removeCart } from "@/network/server/cart"
import { getUserCart } from "@/network/server/user-cart"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

export default function CurrentCart() {
  const [carts, setCarts] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchCartData() {
      const cartsRes = await getUserCart(1)
      console.log("cartsRes", cartsRes)
      setCarts(cartsRes)
      setLoading(false)
    }
    fetchCartData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!carts?.data?.length || !carts?.data[0]?.cart?.product_variants?.length) {
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

  const cartData = carts?.data[0]?.cart
  const totalPrice = (cartData?.total - cartData?.shipping_fee).toLocaleString()

  const handleRemove = async (variantId: number) => {
    try {
      setLoading(true)
      console.log(`Removing product variant ${variantId} from cart ${cartData?.id}`)
      await removeCart(cartData?.id, variantId)
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!")

      const cartsRes = await getUserCart(1)
      setCarts(cartsRes)
      setLoading(false)
    } catch (error: any) {
      console.error("Error removing item from cart:", error)
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại!")
      setLoading(false)
    }
  }

  return (
    <div className="xl:flex mt-10 w-full justify-between gap-20">
      <div className="w-full text-2xl max-lg:mb-20">
        {cartData?.product_variants.map((variant: any, index: number) => (
          <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
            <img
              src={variant.image_urls?.[0]}
              alt={variant.name || ""}
              className="size-[148px] rounded-lg max-lg:w-[100px] mr-5"
            />
            <div className="w-full text-xl lg:text-md">
              <div className="font-medium">{variant.name || "Sản phẩm"}</div>
              <div className="text-[#737373]">Size: {variant.size?.size}</div>
              <div className="text-[#737373]">Số lượng: {variant.quantity}</div>
            </div>
            <div className="text-[#737373] w-full text-xl lg:text-md">
              <div>
                <span>{variant.price?.toLocaleString()}</span> VNĐ
              </div>
              <div>
                Color: <span>{variant.color?.name}</span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-2 bg-white hover:bg-white shadow-none items-center">
                  <BinIcon />
                  <p className="text-xl text-[#DA1515] items-center">Xóa</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] w-[350px]">
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa sản phẩm?</DialogTitle>
                  <DialogDescription>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button className="bg-primary text-white" onClick={() => handleRemove(variant.id)}>
                      Xóa
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
        <div className="flex justify-between mt-20">
          <div>Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold">{totalPrice} VNĐ</div>
        </div>
      </div>
      <FormDelivery />
    </div>
  )
}
