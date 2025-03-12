import EducatorAvatar from "@/assets/image/EducatorAvatar.png"
import React from "react"
import Image from "next/image"
import { MainButton } from "@/components/buttons/main-button"

export default function TrainersPage() {
  return (
    <div>
      <div className="max-w-screen-xl mx-auto">
        <p className="font-[family-name:var(--font-coiny)] sm:text-center text-text text-3xl my-2 sm:my-4">
          Các HLV của Shefit
        </p>
        <p className="sm:text-center text-[#737373] text-xl mb-20">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
          nascetur justo sit.
        </p>
      </div>
      <div className="flex flex-col mx-auto mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`menu-${index}`} className="flex items-center justify-between">
            {index % 2 === 1 ? (
              <div className="flex max-sm:flex-col items-center gap-20">
                <div className="bg-primary max-sm:bg-white xl:text-[40px] lg:text-2xl text-gray-500 rounded-[55px] xl:p-10 lg:p-10 md:p-8 sm:p-6 max-sm:text-base">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
                  Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar
                  penatibus bibendum ad curae consequat.
                </div>
                <div className="text-center">
                  <Image src={EducatorAvatar} alt="" className="mb-4" />
                  <div className="xl:w-1/2 max-lg:w-full mx-auto">
                    <p className="font-medium xl:text-xl max-lg:text-base">
                      HLV <span>Thanh Trang</span>
                    </p>
                    <p className="text-gray-500 max-lg:text-sm">Chuyên kháng lực và định hình đường cong.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex max-sm:flex-col items-center gap-20">
                <div className="text-center">
                  <Image src={EducatorAvatar} alt="" className="mb-4" />
                  <div className="xl:w-1/2 max-lg:w-full mx-auto">
                    <p className="font-medium xl:text-xl max-lg:text-base">
                      HLV <span>Thanh Trang</span>
                    </p>
                    <p className="text-gray-500 max-lg:text-sm">Chuyên kháng lực và định hình đường cong.</p>
                  </div>
                </div>
                <div className="bg-primary max-sm:bg-white xl:text-[40px] lg:text-2xl text-gray-500 rounded-[55px] xl:p-10 lg:p-10 md:p-8 sm:p-6 max-sm:text-base">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
                  Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar
                  penatibus bibendum ad curae consequat.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
