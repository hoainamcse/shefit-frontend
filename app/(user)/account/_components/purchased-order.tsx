"use client"

import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function PurchasedOrder() {
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
                        <Link href="/account/cart/1" className="flex gap-2 bg-white hover:bg-white shadow-none items-center">
                            <p className="text-xl text-[#00C7BE] items-center">Xem chi tiết</p>
                        </Link>
                    </div>
                ))}
                <div className="flex justify-between mt-10">
                    <div>Tổng tiền</div>
                    <div className="text-[#00C7BE] font-semibold">1.150.000 vnđ</div>
                </div>
            </div>
        </div>
    )
}
