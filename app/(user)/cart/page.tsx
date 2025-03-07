"use client"

import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import { BinIcon } from "@/components/icons/BinIcon"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
export default function Cart() {
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
  //TODO Use this slug later on for fetching data
  return (
    <div className="xl:flex mt-10 w-full justify-between gap-20">
      <div className="w-full text-2xl max-lg:mb-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
            <Image src={ShoppingImage} alt="" className="size-[148px]" />
            <div>
              <div className="font-medium">Áo Jump Suit V12</div>
              <div className="text-[#737373]">Size L</div>
            </div>
            <div className="text-[#737373]">
              <span>350.000</span> vnđ
            </div>
            <Button className="flex gap-2 bg-white hover:bg-white shadow-none items-center">
              <BinIcon />
              <p className="text-xl text-[#DA1515] items-center">Xóa</p>
            </Button>
          </div>
        ))}
        <div className="flex justify-between mt-10">
          <div>Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold">1.150.000 vnđ</div>
        </div>
      </div>
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
                      15.000 <span>vnđ</span>
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
                      1.165.000 <span>vnđ</span>
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
    </div>
  )
}
