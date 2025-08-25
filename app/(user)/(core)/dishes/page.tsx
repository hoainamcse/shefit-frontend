import React from 'react'
import Link from 'next/link'
import { getDiet, getDietDishes } from '@/network/server/diets'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

export default async function DietDishesPage({
  searchParams,
}: {
  searchParams: Promise<{ diet_id: string; back?: string }>
}) {
  const { diet_id, back = '' } = await searchParams
  const diet = await getDiet(Number(diet_id))
  const dietDishes = await getDietDishes(Number(diet_id))

  if (!diet || !dietDishes.data) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 p-4 mt-6 md:mt-10 lg:mt-[76px]">
      <div>
        <Link
          href={back || `/gallery#dishes`}
          className="flex cursor-pointer items-center gap-2.5 font-semibold lg:hidden md:mb-7 mb-2"
        >
          <div className="w-6 h-6 pt-1 flex justify-center">
            <BackIconBlack />
          </div>
          Quay về
        </Link>
        <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-6 md:mb-10 lg:mb-[60px] xl:mb-[90px]">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
            Các món theo chế độ {diet?.data.name}
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">{diet?.data.description}</p>
        </div>
        <div className="grid grid-cols-3 sm:gap-5 gap-4">
          {dietDishes.data?.map((item, index) => (
            <Link href={`/dishes/${item.id}?diet_id=${diet_id}`} key={index}>
              <div key={`menu-${index}`} className="overflow-hidden">
                <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                  <img
                    src={item.image}
                    alt=""
                    className="object-cover rounded-[20px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                  />
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
