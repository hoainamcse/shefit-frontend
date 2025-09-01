import { cn } from '@/lib/utils'
import React from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMuscleGroup, getMuscleGroupExercises } from '@/network/server/muscle-groups'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

export default async function MuscleGroupExercises({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const _searchParams = await searchParams
  const muscleGroupId = typeof _searchParams.muscle_group_id === 'string' ? _searchParams.muscle_group_id : ''
  const back = typeof _searchParams.back === 'string' ? _searchParams.back : ''
  const muscleGroup = await getMuscleGroup(muscleGroupId)
  const muscleGroupExercises = await getMuscleGroupExercises(muscleGroupId)

  if (!muscleGroup || !muscleGroupExercises.data) {
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
          href={back || `/gallery`}
          className="flex cursor-pointer items-center gap-2.5 font-semibold lg:hidden md:mb-7 mb-2"
        >
          <div className="w-6 h-6 pt-1 flex justify-center">
            <BackIconBlack />
          </div>
          Quay về
        </Link>
        <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-3 sm:mb-6 md:mb-10 lg:mb-[60px]">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
            Các động tác nhóm {muscleGroup?.data.name}
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">
            Tại Shefit, chúng tôi cung cấp một loạt các động tác chuyên biệt cho từng nhóm cơ, giúp bạn xây dựng sức
            mạnh và sự linh hoạt. Mỗi động tác được thiết kế để tối ưu hóa hiệu quả luyện tập, phù hợp với mọi trình độ
            từ người mới bắt đầu đến chuyên nghiệp.
          </p>
        </div>
        <div>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex sm:justify-center mb-3 sm:mb-6 md:mb-10 lg:mb-[60px]">
              <TabsList className="bg-white sm:mx-auto">
                <TabsTrigger
                  value="all"
                  className={cn(
                    'underline text-sm lg:text-lg text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                  )}
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="with-equipment"
                  className={cn(
                    'underline text-sm lg:text-lg text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                  )}
                >
                  Có dụng cụ
                </TabsTrigger>
                <TabsTrigger
                  value="no-equipment"
                  className={cn(
                    'underline text-sm lg:text-lg text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                  )}
                >
                  Không có dụng cụ
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <div className="grid grid-cols-3 sm:gap-5 gap-4">
                {muscleGroupExercises.data?.map((exercise) => (
                  <Link href={`/exercises/${exercise.id}?muscle_group_id=${muscleGroupId}`} key={exercise.id}>
                    <div key={`menu-${exercise.id}`} className="text-lg overflow-hidden">
                      <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                        <img
                          src={
                            getYouTubeThumbnail(exercise.youtube_url) ||
                            'https://placehold.co/400?text=shefit.vn&font=Oswald'
                          }
                          alt={exercise.name}
                          className="object-cover rounded-[20px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                      <p className="font-medium lg:font-bold text-sm lg:text-lg">{exercise.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="with-equipment">
              <div className="grid grid-cols-3 sm:gap-5 gap-4">
                {muscleGroupExercises.data
                  ?.filter((exercise) => exercise.equipments && exercise.equipments.length > 0)
                  .map((exercise) => (
                    <Link href={`/exercises/${exercise.id}?muscle_group_id=${muscleGroupId}`} key={exercise.id}>
                      <div key={`menu-${exercise.id}`} className="text-lg overflow-hidden">
                        <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                          <img
                            src={
                              getYouTubeThumbnail(exercise.youtube_url) ||
                              'https://placehold.co/400?text=shefit.vn&font=Oswald'
                            }
                            alt={exercise.name}
                            className="object-cover rounded-[20px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                          />
                        </div>
                        <p className="font-medium lg:font-bold text-sm lg:text-lg">{exercise.name}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="no-equipment">
              <div className="grid grid-cols-3 sm:gap-5 gap-4">
                {muscleGroupExercises.data
                  ?.filter((exercise) => exercise.equipments?.some((equipment) => equipment.name === 'Tay Không'))
                  .map((exercise) => (
                    <Link href={`/exercises/${exercise.id}?muscle_group_id=${muscleGroupId}`} key={exercise.id}>
                      <div key={`menu-${exercise.id}`} className="text-lg overflow-hidden">
                        <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                          <img
                            src={
                              getYouTubeThumbnail(exercise.youtube_url) ||
                              'https://placehold.co/400?text=shefit.vn&font=Oswald'
                            }
                            alt={exercise.name}
                            className="object-cover rounded-[20px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                            width={585}
                            height={373}
                          />
                        </div>
                        <p className="font-medium lg:font-bold text-sm lg:text-lg">{exercise.name}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
