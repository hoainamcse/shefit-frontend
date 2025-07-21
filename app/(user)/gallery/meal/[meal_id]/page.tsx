import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getDishes } from '@/network/server/dishes'
import { getDiets } from '@/network/server/diets'
export default async function Food({ params }: { params: Promise<{ meal_id: string }> }) {
  const { meal_id } = await params
  const dish = await getDishes()
  const diet = await getDiets()

  const selectedDiet = diet.data?.find((item) => item.id.toString() === meal_id)

  return (
    <div className="flex flex-col gap-10 mt-6 md:mt-10 lg:mt-[76px]">
      <div>
        <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-6 md:mb-10 lg:mb-[60px] xl:mb-[90px]">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
            Các món theo chế độ {selectedDiet?.name}
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">{selectedDiet?.description}</p>
        </div>
        <div className="grid grid-cols-3 sm:gap-5 gap-4">
          {dish.data
            ?.filter((item) => item.diet && item.diet.id.toString() === meal_id)
            .map((item, index) => (
              <Link href={`/gallery/meal/${meal_id}/${item.id}`} key={index}>
                <div key={`menu-${index}`} className="overflow-hidden">
                  <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                    <img src={item.image} alt="" className="object-cover rounded-[20px] w-full h-full" />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-[20px]" />
                  </div>
                  <p className="font-medium lg:font-bold text-sm lg:text-lg">{item.name}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
