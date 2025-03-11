import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"

export default async function Zoom({ params }: { params: Promise<{ slug: string }> }) {
  //TODO Use this slug later on for fetching data
  const { slug } = await params
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="p-6 max-w-screen-2xl mx-auto mb-20 flex flex-col gap-10">
        <img src="/temp/courseDetail.png" alt={`${slug}`} className=" rounded-xl mb-4" />
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Easy Slim - Video</p>
            <p className="text-[#737373]">Độ Mông Đào</p>
            <p className="text-[#737373]">Miss Vi Salano - 4 Tuần</p>
          </div>
          <p className="text-[#737373]">Dáng quả lê</p>
        </div>
        <div className="bg-primary rounded-xl my-4 p-4">
          <p className="text-white text-center text-2xl">Tóm tắt khoá học</p>
          <ul className="text-white list-disc pl-8">
            <li>Torem ipsum dolor sit amet</li>
            <li>Torem ipsum dolor sit amet</li>
            <li>Torem ipsum dolor sit amet</li>
          </ul>
        </div>
        <div>
          <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px]">Thông tin khoá </p>
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </p>
        </div>
        <div>
          <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px]">Dụng cụ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex w-max space-x-4 py-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <figure key={`equipment-${slug}-${index}`} className="shrink-0">
                  <div className="overflow-hidden rounded-md">
                    <img src="/temp/equipment.png" alt="/temp/equipment.png" width={168} height={175} />
                  </div>
                  <figcaption className="pt-2 font-semibold text-xs text-muted-foreground">Equipment</figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div>
          <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl xl:text-[40px]">Nhóm cơ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex w-max space-x-4 py-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <figure key={`equipment-${slug}-${index}`} className="shrink-0">
                  <div className="overflow-hidden rounded-md">
                    <img src="/temp/muscle.png" alt="/temp/equipment.png" width={168} height={175} />
                  </div>
                  <figcaption className="pt-2 font-semibold text-xs text-muted-foreground">Equipment</figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="flex justify-center gap-4">
          <Link href={`/training-courses/video/detail`} className="rounded-full w-1/3 bg-button hover:bg-[#11c296]">
            <Button className="w-full rounded-full bg-button hover:bg-[#11c296] h-14">Bắt đầu</Button>
          </Link>
          <Button variant="secondary" className="border-button text-button rounded-full w-1/3 bg-white h-14">
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}
