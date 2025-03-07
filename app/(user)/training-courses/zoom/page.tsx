import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"

export default async function Zoom({ params }: { params: Promise<{ slug: string }> }) {
  //TODO Use this slug later on for fetching data
  const { slug } = await params
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div>
        <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl">Tất cả khoá tập</p>
        <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
          nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus bibendum ad
          curae consequat.
        </p>
      </div>
      <div>
        <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl">Dụng cụ</p>
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
        <p className=" font-[family-name:var(--font-coiny)] text-text text-2xl">Nhóm cơ</p>
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
        <Link href={`/training-courses/zoom/slug`} className="rounded-full w-1/3 bg-button hover:bg-[#11c296]">
          <Button className="w-full rounded-full bg-button hover:bg-[#11c296]">Bắt đầu</Button>
        </Link>
        <Button variant="secondary" className="border-button text-button rounded-full w-1/3 bg-white">
          Lưu
        </Button>
      </div>
    </div>
  )
}
