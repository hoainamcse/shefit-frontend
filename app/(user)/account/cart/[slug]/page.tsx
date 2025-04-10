"use client"

import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackIconBlack } from "@/components/icons/BackIconBlack"
export default function CartDetail() {
    const form = useForm({
        defaultValues: {
            name: "Shefit",
            phone: "0909090909",
            city: "Hồ Chí Minh",
            address: "1 Lạc Long Quân, Hồ Chí Minh",
        },
    })

    const onSubmit = (data: any) => {
        console.log("Form Data:", data)
    }
    return (
        <div className="max-w-screen-3xl mx-auto px-14">
            <Link href="/account?tab=cart">
                <Button className="bg-white hover:bg-white shadow-none items-center text-black my-10">
                    <BackIconBlack /> <div className="text-xl items-center">Chi tiết đơn hàng</div>
                </Button>
            </Link>
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
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
