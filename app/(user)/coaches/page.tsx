import React from "react"
import { getCoaches } from "@/network/server/coaches"
import { Coach } from "@/models/coach"

export const dynamic = "force-dynamic"

export default async function CoachesPage() {
  const coaches = await getCoaches()
  return (
    <div>
      <div className="max-w-screen-xl mx-auto">
        <p className="font-[family-name:var(--font-coiny)] font-bold sm:text-center text-ring text-3xl my-2 sm:my-4">
          Các HLV của Shefit
        </p>
        <p className="sm:text-center text-[#737373] text-xl mb-20">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
          nascetur justo sit.
        </p>
      </div>
      <div className="flex flex-col mx-auto mt-6">
        {coaches.data.map((coach: Coach, index: number) => (
          <div key={`menu-${index}`} className="flex items-center justify-between">
            {index % 2 === 1 ? (
              <div className="flex max-sm:flex-col items-center gap-20">
                <div className="bg-primary max-sm:bg-white xl:text-4xl lg:text-2xl text-gray-500 rounded-[55px] xl:p-10 lg:p-10 md:p-8 sm:p-6 max-sm:text-base">
                  {coach.description}
                </div>
                <div className="text-center">
                  <img src={coach.image} alt="" className="mb-4" />
                  <div className="max-lg:w-full mx-auto">
                    <p className="font-medium xl:text-xl max-lg:text-base">
                      HLV <span>{coach.name}</span>
                    </p>
                    <p className="text-gray-500 max-lg:text-sm w-2/3 text-center mx-auto">{coach.detail}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex max-sm:flex-col items-center gap-20">
                <div className="text-center">
                  <img src={coach.image} alt="" className="mb-4" />
                  <div className="max-lg:w-full mx-auto">
                    <p className="font-medium xl:text-xl max-lg:text-base">
                      HLV <span>{coach.name}</span>
                    </p>
                    <p className="text-gray-500 max-lg:text-sm w-2/3 text-center mx-auto">{coach.detail}</p>
                  </div>
                </div>
                <div className="bg-primary max-sm:bg-white xl:text-4xl lg:text-2xl text-gray-500 rounded-[55px] xl:p-10 lg:p-10 md:p-8 sm:p-6 max-sm:text-base">
                  {coach.description}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
