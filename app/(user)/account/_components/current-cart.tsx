"use client"
import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import { BinIcon } from "@/components/icons/BinIcon"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import FormDelivery from "./FormDelivery"
import { getCarts, removeCart } from "@/network/server/cart"
import { getProduct } from "@/network/server/products"
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
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCartData() {
      const cartsRes = await getCarts()
      setCarts(cartsRes)
      if (cartsRes.data && cartsRes.data.length > 0) {
        const productList = await Promise.all(
          cartsRes.data[0].product_variants.map((variant: any) => getProduct(variant.id.toString()))
        )
        setProducts(productList)
      }
      setLoading(false)
    }
    fetchCartData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!products?.length) {
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
  const totalPrice = (carts.data[0].total - carts.data[0].shipping_fee).toLocaleString()

  const handleRemove = async (variantId: number) => {
    try {
      await removeCart(carts.data[0].id, variantId)
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!")
      setLoading(true)
      const cartsRes = await getCarts()
      setCarts(cartsRes)
      if (cartsRes.data && cartsRes.data.length > 0) {
        const productList = await Promise.all(
          cartsRes.data[0].product_variants.map((variant: any) => getProduct(variant.id.toString()))
        )
        setProducts(productList)
      } else {
        setProducts([])
      }
      setLoading(false)
    } catch (error: any) {
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại!")
    }
  }

  return (
    <div className="xl:flex mt-10 w-full justify-between gap-20">
      <div className="w-full text-2xl max-lg:mb-20">
        {carts.data[0].product_variants.map((variant: any, index: number) => (
          <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
            <Image src={ShoppingImage} alt="" className="size-[148px]" />
            <div>
              <div className="font-medium">{products[index]?.data?.name}</div>
              <div className="text-[#737373]">Size: {variant.size.size}</div>
            </div>
            <div className="text-[#737373]">
              <div>
                <span>{products[index]?.data?.price?.toLocaleString()}</span> VNĐ
              </div>
              <div>Color: {variant.color.name}</div>
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
