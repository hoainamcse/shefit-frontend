"use client"

import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function Equipment() {
  const [isSelected, setIsSelected] = useState("size")
  const [quantity, setQuantity] = useState(1)
  return (
    <div className="flex flex-col gap-10">
      <div className="mb-20 p-6 mt-20">
        <div className="xl:w-[80%] max-lg:w-full xl:flex justify-between mb-20 max-lg:block">
          <div className="xl:w-3/4 max-lg:w-full">
            <Image
              src={ShoppingImage}
              alt=""
              className="xl:aspect-[5/3] max-lg:aspect-1 object-cover rounded-xl mb-4"
            />
          </div>
          <div className="xl:w-1/5 max-lg:w-full xl:text-xl flex flex-col gap-3">
            <div className="flex gap-2 mb-2">
              <Button className="rounded-full w-8 h-8 bg-[#000000]"></Button>
              <Button className="rounded-full w-8 h-8 bg-[#AFA69F]"></Button>
            </div>
            <p className="font-medium xl:text-[30px] max-lg:text-xl">Áo Jump Suit V12</p>
            <p className="text-[#737373]">Đen</p>
            <p className="text-[#00C7BE] text-2xl font-semibold">350.000 vnđ</p>
            <div className="flex gap-3 items-center text-xl">
              <div>Size:</div>
              <Button
                className={
                  isSelected === "S"
                    ? "bg-primary text-white hover:bg-[#fda1a2]"
                    : "bg-white text-[#737373] border-[#737373] hover:bg-[#dbdbdb]"
                }
                onClick={() => setIsSelected("S")}
              >
                S
              </Button>
              <Button
                className={
                  isSelected === "M"
                    ? "bg-primary text-white hover:bg-[#fda1a2]"
                    : "bg-white text-[#737373] border-[#737373] hover:bg-[#dbdbdb]"
                }
                onClick={() => setIsSelected("M")}
              >
                M
              </Button>
              <Button
                className={
                  isSelected === "L"
                    ? "bg-primary text-white hover:bg-[#fda1a2]"
                    : "bg-white text-[#737373] border-[#737373] hover:bg-[#dbdbdb]"
                }
                onClick={() => setIsSelected("L")}
              >
                L
              </Button>
            </div>
            <div className="flex gap-3 items-center">
              <div className="text-nowrap">Số lượng:</div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] size-9 text-xl font-bold items-center flex"
                  onClick={() => setQuantity(quantity - 1)}
                >
                  -
                </Button>
                <Input
                  className="w-40"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <Button
                  className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] size-9 text-xl font-bold items-center flex"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="w-full flex gap-3 justify-center">
              <Button className="w-full rounded-full bg-button hover:bg-[#11c296]">Mua ngay</Button>
              <Button className="border-button text-button rounded-full w-full bg-white hover:bg-[#11c29628]">
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] max-lg:text-[30px]">
            Title
          </div>
          <p className="text-[#737373] xl:text-xl max-lg:text-base">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat. <br />
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat. <br />
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </p>
        </div>
        <div>
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5 max-lg:text-[30px]">
            Tính năng
          </div>
          <div className="grid xl:grid-cols-12 lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-10">
            {Array.from({ length: 10 }).map((_, index) => (
              <Link href={`/equipment/${index}`} key={index}>
                <div key={`menu-${index}`} className="xl:text-xl max-lg:text-base">
                  <div className="relative group">
                    <Image src={ShoppingImage} alt="" className="aspect-1 object-cover rounded-xl mb-4" />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <div className="font-medium">Cơ bụng</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
