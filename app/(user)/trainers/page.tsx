import EducatorAvatar from "@/assets/image/EducatorAvatar.png"
import React from "react"
import Image from "next/image"
import { MainButton } from "@/components/buttons/main-button"

export default function TrainersPage() {
  return (
    <div>
      <div className="max-w-screen-md mx-auto">
        <p className="font-[family-name:var(--font-coiny)] sm:text-center text-text text-2xl sm:text-3xl my-2 sm:my-4">
          Các HLV của Shefit
        </p>
        <p className="sm:text-center text-[#737373] text-base mb-20">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
          nascetur justo sit.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-20 mx-auto mt-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={`menu-${index}`} className="text-center mb-20">
            <div className="relative group">
              <Image src={EducatorAvatar} alt="" className="mb-4" />
              <div className="absolute inset-0 transition-opacity rounded-xl" />
            </div>
            <div className="xl:w-1/2 max-lg:w-full mx-auto">
              <p className="font-medium xl:text-xl max-lg:text-base">
                HLV <span>Thanh Trang</span>
              </p>
              <p className="text-gray-500 max-lg:text-sm">Chuyên kháng lực và định hình đường cong.</p>
              <MainButton className="w-full mt-4 rounded-full text-xl" text="Liên hệ" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
