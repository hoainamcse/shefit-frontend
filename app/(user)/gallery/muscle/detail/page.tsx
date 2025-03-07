import React from "react"
import Image from "next/image"
import VideoCard from "@/assets/image/ImageIntro.png"
import { Button } from "@/components/ui/button"

export default function MuscleDetail() {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <Image src={VideoCard} alt="" className="h-[680px]" />
      <div>
        <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5">
          Thông tin bài tập
        </div>
        <div className="text-[#737373] text-xl">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
          nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus bibendum ad
          curae consequat. Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam
          primis. Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar
          penatibus bibendum ad curae consequat.Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin
          scelerisque proin etiam primis. Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis
          risus pulvinar penatibus bibendum ad curae consequat.Lorem ipsum odor amet, consectetuer adipiscing elit. Ac
          tempor proin scelerisque proin etiam primis. Molestie nascetur justo sit accumsan nunc quam tincidunt blandit.
          Arcu iaculis risus pulvinar penatibus bibendum ad curae consequat.Lorem ipsum odor amet, consectetuer
          adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie nascetur justo sit accumsan nunc
          quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus bibendum ad curae consequat.
        </div>
      </div>
      <div>
        <ol className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5">Dụng cụ</ol>
        <li className="text-xl text-[#737373]">Tạ</li>
        <li className="text-xl text-[#737373]">Thảm</li>
        <li className="text-xl text-[#737373]">Máy chạy bộ</li>
        <li className="text-xl text-[#737373]">Massage bụng</li>
      </div>
      <Button className="bg-button hover:bg-[#11c296] p-4 mt-6 text-xl rounded-[100px]">Lưu</Button>
    </div>
  )
}
