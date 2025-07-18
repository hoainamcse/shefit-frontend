import { cn } from '@/lib/utils'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMuscleGroupExercises, getMuscleGroups } from '@/network/server/muscle-groups'
import { getYoutubeThumbnail } from '@/lib/youtube'
import { Skeleton } from '@/components/ui/skeleton'

export default async function Muscle({ params }: { params: Promise<{ muscle_id: string }> }) {
  const resolvedParams = await params
  const { muscle_id } = resolvedParams
  const muscleGroups = await getMuscleGroups()
  const muscleGroupExercises = await getMuscleGroupExercises(muscle_id)

  const selectedMuscleGroup = muscleGroups.data?.find((group) => group.id.toString() === muscle_id)

  // Loading state
  if (!selectedMuscleGroup || !muscleGroupExercises.data) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-10 pt-10 lg:pt-16 xl:pt-[93px] animate-fade-in">
      <div>
        <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-3 sm:mb-6 md:mb-10 lg:mb-[60px]">
          <div className="font-[family-name:var(--font-coiny)] text-ring text-3xl lg:text-[40px] font-bold">
            Các bài tập nhóm {selectedMuscleGroup?.name}
          </div>
          <p className="text-[#737373] text-base lg:text-xl">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie
          </p>
        </div>
        <div>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex sm:justify-center mb-3 sm:mb-6 md:mb-10 lg:mb-[60px]">
              <TabsList className="bg-white sm:mx-auto">
                <TabsTrigger
                  value="all"
                  className={cn(
                    'underline text-base lg:text-xl text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                  )}
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="with-equipment"
                  className={cn(
                    'underline text-base lg:text-xl text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                  )}
                >
                  Có dụng cụ
                </TabsTrigger>
                <TabsTrigger
                  value="no-equipment"
                  className={cn(
                    'underline text-base lg:text-xl text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                  )}
                >
                  Không có dụng cụ
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <div className="grid grid-cols-3 sm:gap-5 gap-4">
                {muscleGroupExercises.data?.map((exercise) => (
                  <Link href={`/gallery/muscle/${muscle_id}/${exercise.id}`} key={exercise.id}>
                    <div key={`menu-${exercise.id}`} className="text-xl overflow-hidden">
                      <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                        <img
                          src={getYoutubeThumbnail(exercise.youtube_url)}
                          alt={exercise.name}
                          className="object-cover rounded-[20px] w-full h-full"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-[20px]" />
                      </div>
                      <p className="font-medium lg:font-bold text-base lg:text-xl">{exercise.name}</p>
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
                    <Link href={`/gallery/muscle/${muscle_id}/${exercise.id}`} key={exercise.id}>
                      <div key={`menu-${exercise.id}`} className="text-xl overflow-hidden">
                        <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                          <img
                            src={getYoutubeThumbnail(exercise.youtube_url)}
                            alt={exercise.name}
                            className="object-cover rounded-[20px] w-full h-full"
                          />
                          <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-[20px]" />
                        </div>
                        <p className="font-medium lg:font-bold text-base lg:text-xl">{exercise.name}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="no-equipment">
              <div className="grid grid-cols-3 sm:gap-5 gap-4">
                {muscleGroupExercises.data
                  ?.filter((exercise) => !exercise.equipments || exercise.equipments.length === 0)
                  .map((exercise) => (
                    <Link href={`/gallery/muscle/${muscle_id}/${exercise.id}`} key={exercise.id}>
                      <div key={`menu-${exercise.id}`} className="text-xl overflow-hidden">
                        <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[585/373]">
                          <img
                            src={getYoutubeThumbnail(exercise.youtube_url)}
                            alt={exercise.name}
                            className="object-cover rounded-[20px] w-full h-full"
                            width={585}
                            height={373}
                          />
                          <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-[20px]" />
                        </div>
                        <p className="font-medium lg:font-bold text-base lg:text-xl">{exercise.name}</p>
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
