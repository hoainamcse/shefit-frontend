import Image from "next/image"
import { cn } from "@/lib/utils"
import React from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMuscleGroups } from "@/network/server/muscle-group"

export default async function Muscle() {
  const muscleGroups = await getMuscleGroups()
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-14">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5">
            Các bài tập nhóm cơ bụng
          </div>
          <p className="text-[#737373] text-xl">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie
          </p>
        </div>
        <div className="flex justify-center mb-20">
          <Tabs defaultValue="video">
            <TabsList>
              <TabsTrigger value="video" className={cn("underline text-text")}>
                Có dụng cụ
              </TabsTrigger>
              <TabsTrigger value="zoom" className={cn("underline text-text")}>
                Không có dụng cụ
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {muscleGroups.data?.map((muscleGroup) => (
            <Link href="/gallery/muscle/detail" key={muscleGroup.id}>
              <div key={`menu-${muscleGroup.id}`} className="text-xl">
                <div className="relative group">
                  <img src={muscleGroup.image} alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" width={585} height={373} />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">{muscleGroup.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
