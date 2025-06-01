"use client"

import { useState, useEffect } from "react"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { getCarts } from "@/network/server/cart"

export default function FormDelivery() {
  const [carts, setCarts] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      address: "",
      note: "",
    },
  })
  const onSubmit = (data: any) => {
    console.log("Form Data:", data)
  }
  useEffect(() => {
    async function fetchCartData() {
      const cartsRes = await getCarts()
      setCarts(cartsRes)
      setLoading(false)
    }
    fetchCartData()
  }, [])
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="font-[family-name:var(--font-coiny)] text-3xl">Thông tin vận chuyển</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Tên</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập tên của bạn" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập số điện thoại của bạn" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Thành phố</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập thành phố của bạn" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Địa chỉ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập địa chỉ của bạn" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-xl">Phí ship</FormLabel>
                <FormControl>
                  <div className="text-[#8E8E93] text-xl">
                    {carts?.data?.[0]?.shipping_fee?.toLocaleString()} <span>VNĐ</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-xl font-semibold">Tổng tiền</FormLabel>
                <FormControl>
                  <div className="text-[#00C7BE] text-2xl font-semibold">
                    {carts?.data?.[0]?.total?.toLocaleString()} <span>VNĐ</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-xl font-semibold">Phương thức</FormLabel>
                <FormControl>
                  <div className="flex gap-2 item-center">
                    <div className="text-[#737373] text-xl leading-8 items-center">Thanh toán khi nhận hàng</div>
                    <Checkbox className="size-8" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="note"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Ghi chú thêm</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập ghi chú của bạn cho shop" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-[#13D8A7] hover:bg-[#11c296] rounded-full h-16 text-2xl">
            Mua ngay
          </Button>
        </form>
      </Form>
    </div>
  )
}
