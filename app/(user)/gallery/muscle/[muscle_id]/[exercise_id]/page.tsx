import React from "react"
import Image from "next/image"
import VideoCard from "@/assets/image/ImageIntro.png"
import { getExerciseById } from "@/network/server/exercise"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import ActionButtons from "./ActionButtons"

export default async function MuscleDetail({ params }: { params: { muscle_id: string; exercise_id: string } }) {
  const exerciseId = await getExerciseById(params.exercise_id)
  return (
    <div className="flex flex-col gap-10 mt-10">
      <Image src={VideoCard} alt="" className="h-[680px]" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 mb-5">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Tên bài tập</div>
          <div className="text-[#737373] text-xl">{exerciseId.data?.name}</div>
        </div>
        <div className="flex flex-col gap-2 mb-5">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Thông tin bài tập</div>
          <div className="text-[#737373] text-xl">{exerciseId.data?.description}</div>
        </div>
      </div>

      {exerciseId.data?.equipments?.length > 0 && (
        <div className="flex flex-col gap-5">
          <p className="font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px]">Dụng cụ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex space-x-4 py-4 w-full">
              {exerciseId.data.equipments.map((equipment, index) => (
                <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={equipment.image}
                      alt={equipment.name}
                      className="w-[168px] h-[175px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2 font-semibold text-lg max-lg:text-base text-muted-foreground w-full">
                    {equipment.name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {exerciseId.data?.muscle_groups?.length > 0 && (
        <div className="flex flex-col gap-5">
          <p className="font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px]">Nhóm cơ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex w-full space-x-4 py-4">
              {exerciseId.data.muscle_groups.map((muscleGroup, index) => (
                <figure key={`muscleGroup-${muscleGroup.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={muscleGroup.image}
                      alt={muscleGroup.name}
                      className="w-[168px] h-[175px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2 font-semibold text-xl max-lg:text-base text-muted-foreground w-full">
                    {muscleGroup.name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <ActionButtons exerciseId={exerciseId.data?.id.toString()} />
    </div>
  )
}
