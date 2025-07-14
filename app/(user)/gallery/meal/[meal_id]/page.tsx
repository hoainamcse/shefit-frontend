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
    <div className="flex flex-col gap-10 mt-10">
      <div>
        <div className="flex flex-col justify-center text-center gap-5 mb-14">
          <div className="font-[family-name:var(--font-coiny)] text-ring text-3xl lg:text-[40px] mb-5 font-bold">
            Các món theo chế độ {selectedDiet?.name}
          </div>
          <p className="text-[#737373] text-base lg:text-xl">{selectedDiet?.description}</p>
        </div>
        <div className="grid grid-cols-3 lg:gap-10 gap-4">
          {dish.data
            ?.filter((item) => item.diet && item.diet.id.toString() === meal_id)
            .map((item, index) => (
              <Link href={`/gallery/meal/${meal_id}/${item.id}`} key={index}>
                <div key={`menu-${index}`} className="lg:w-[585px] w-[122px] max-w-[585px] overflow-hidden">
                  <div className="relative group">
                    <img
                      src={item.image}
                      alt=""
                      className="aspect-[5/3] object-cover rounded-xl mb-4 lg:w-[585px] lg:h-[373px] h-[122px] w-full"
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-bold text-base lg:text-xl">{item.name}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
