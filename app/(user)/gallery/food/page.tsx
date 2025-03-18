import React from "react"
import Image from "next/image"
import Link from "next/link"

export default function Food() {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div>
        <div className="flex flex-col justify-center text-center gap-5 mb-14">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5">
            Các món theo chế độ Keto
          </div>
          <p className="text-[#737373] text-xl">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <Link href="/gallery/food/detail" key={index}>
              <div key={`menu-${index}`} className="text-xl">
                <div className="relative group">
                  <Image src="/temp/Food.png" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" width={585} height={373} />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">Keto</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
