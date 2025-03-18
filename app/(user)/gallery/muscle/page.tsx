"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import Link from "next/link"

export default function Muscle() {
  const [isSelected, setIsSelected] = useState("video")
  //TODO Use this slug later on for fetching data
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-14">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5">
            Các bài tập nhóm cơ bụng
          </div>
          <p className="text-[#737373] text-xl">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie
          </p>
        </div>
        <div className="flex justify-center gap-4 mb-20">
          <p
            className={cn("cursor-pointer", isSelected === "video" ? "underline text-text" : "text-[#737373]")}
            onClick={() => setIsSelected("video")}
          >
            Có dụng cụ
          </p>
          <p
            className={cn("cursor-pointer", isSelected === "zoom" ? "underline text-text" : "text-[#737373]")}
            onClick={() => setIsSelected("zoom")}
          >
            Không có dụng cụ
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <Link href="/gallery/muscle/detail" key={index}>
              <div key={`menu-${index}`} className="text-xl">
                <div className="relative group">
                  <Image src="/temp/VideoCard.jpg" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" width={585} height={373}/>
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">Cơ bụng</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
