import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"
import { getCourse } from "@/network/server/courses"
import { getEquipments } from "@/network/server/equipments"
import { getMuscleGroups } from "@/network/server/muscle-group"

export default async function VideoDetail({ params }: { params: Promise<{ video_id: string }> }) {
  const { video_id } = await params
  const course = await getCourse(video_id)
  const equipment = await getEquipments()
  const muscleGroup = await getMuscleGroups()
  return (
    <div className="flex max-w-screen-2xl mx-auto flex-col gap-10 mt-10 w-full">
      <div className="p-6 mb-20 flex flex-col gap-10">
        <img src={course.data.thumbnail_image} alt={`${video_id}`} className="rounded-xl mb-4 w-full h-[680px] object-cover" />
        <div className="flex justify-between">
          <div>
            <p className="font-medium">{course.data.course_name}</p>
            <p className="text-[#737373]">{course.data.difficulty_level}</p>
            <p className="text-[#737373]">{course.data.trainer}</p>
          </div>
          <p className="text-[#737373]">{course.data.form_categories}</p>
        </div>
        <div className="bg-primary rounded-xl my-4 p-4">
          <p className="text-white text-center text-2xl">Tóm tắt khoá học</p>
          <ul className="text-white list-disc pl-8">
            <li>{course.data.description}</li>
          </ul>
        </div>
        <div>
          <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px] mb-4">Thông tin khoá</p>
          <p>
            {course.data.description}
          </p>
        </div>
        <div>
          <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px]">Dụng cụ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex space-x-4 py-4 w-full">
              {equipment.data.map((equipment, index) => (
                <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img src={equipment.image} alt={equipment.name} className="w-[168px] h-[175px] object-cover rounded-xl" />
                  </div>
                  <figcaption className="pt-2 font-semibold text-lg max-lg:text-base text-muted-foreground w-full">{equipment.name}</figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div>
          <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px]">Nhóm cơ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex w-full space-x-4 py-4">
              {muscleGroup.data.map((muscleGroup, index) => (
                <figure key={`muscleGroup-${muscleGroup.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img src={muscleGroup.image} alt={muscleGroup.name} className="w-[168px] h-[175px] object-cover rounded-xl" />
                  </div>
                  <figcaption className="pt-2 font-semibold text-xl max-lg:text-base text-muted-foreground w-full">{muscleGroup.name}</figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="flex justify-center gap-4">
          <Link href={`/courses/videos/${video_id}/schedule`} className="rounded-full w-1/3 bg-button hover:bg-[#11c296]">
            <Button className="w-full rounded-full bg-button hover:bg-[#11c296] h-14">Bắt đầu</Button>
          </Link>
          <Button variant="secondary" className="text-button rounded-full w-1/3 bg-white h-14 border-2 border-button">
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}
