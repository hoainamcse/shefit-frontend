'use client'

import Link from 'next/link'
import { getMuscleGroups } from '@/network/client/muscle-groups'
import { getDiets } from '@/network/client/diets'
import { useState, useEffect } from 'react'
import { ListResponse } from '@/models/response'
import { MuscleGroup } from '@/models/muscle-group'
import { Diet } from '@/models/diet'

export const dynamic = 'force-dynamic'

export default function Gallery() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMuscleGroupsLoading, setIsMuscleGroupsLoading] = useState(true)
  const [isDietsLoading, setIsDietsLoading] = useState(true)
  const [muscleGroupsData, setMuscleGroupsData] = useState<ListResponse<MuscleGroup>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [dietsData, setDietsData] = useState<ListResponse<Diet>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })

  useEffect(() => {
    setIsLoading(isMuscleGroupsLoading || isDietsLoading)
  }, [isMuscleGroupsLoading, isDietsLoading])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (window.location.hash === '#dishes') {
          const element = document.getElementById('dishes')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  useEffect(() => {
    async function fetchMuscleGroups() {
      try {
        setIsMuscleGroupsLoading(true)
        const data = await getMuscleGroups()
        setMuscleGroupsData(data)
      } catch (error) {
        console.error('Error fetching muscle groups:', error)
      } finally {
        setIsMuscleGroupsLoading(false)
      }
    }

    fetchMuscleGroups()
  }, [])

  useEffect(() => {
    async function fetchDiets() {
      try {
        setIsDietsLoading(true)
        const data = await getDiets()
        setDietsData(data)
      } catch (error) {
        console.error('Error fetching diets:', error)
      } finally {
        setIsDietsLoading(false)
      }
    }

    fetchDiets()
  }, [])

  return (
    <div className="flex flex-col gap-10 sm:gap-16 lg:gap-[90px] pt-10 lg:pt-16 xl:pt-[93px]">
      <div>
        <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-10 lg:mb-16 xl:mb-[90px]">
          <div className="font-[family-name:var(--font-roboto-condensed)] text-ring text-2xl lg:text-4xl font-semibold">
            Động tác theo nhóm cơ
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">
            Xem video hướng dẫn chi tiết 1000+ bài đốt mỡ và cắt nét cơ theo từng vùng hình thể nữ giới
          </p>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-4 sm:gap-5 gap-4">
          {muscleGroupsData.data.map((muscleGroup) => (
            <Link href={`/exercises?muscle_group_id=${muscleGroup.id}`} key={muscleGroup.id}>
              <div key={`menu-${muscleGroup.id}`} className="overflow-hidden">
                <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square">
                  <img
                    src={muscleGroup.image ?? undefined}
                    alt=""
                    className="object-cover rounded-[8px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <p className="font-medium lg:font-bold text-sm lg:text-lg">{muscleGroup.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <div
          id="dishes"
          className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-10 lg:mb-16 xl:mb-[90px]"
        >
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
            Món theo chế độ ăn
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">
            Khám phá 500+ món ăn theo các chế độ ăn khác nhau phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-4 sm:gap-5 gap-4">
          {dietsData.data?.map((diet) => (
            <Link href={`/dishes?diet_id=${diet.id}`} key={diet.id}>
              <div key={`menu-${diet.id}`} className="text-lg overflow-hidden">
                <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square">
                  <img
                    src={diet.image}
                    alt=""
                    className="object-cover rounded-[8px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <p className="font-medium lg:font-bold text-sm lg:text-lg">{diet.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
