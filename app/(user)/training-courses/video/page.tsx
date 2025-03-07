import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"

export default async function Video() {
  //TODO Use this slug later on for fetching data
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">
            Circuit 1: Cardio Đốt Mỡ
          </div>
          <p className="text-[#737373] text-xl">
            Cycle 1: complete all excercises, 1 mins per excercises, no rest between each excercises Rest 30-45s after
            one Cycle Repeat Cycle 2, Cycle 3
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={`menu-${index}`} className="text-xl">
              <div className="relative group">
                <Image src="/temp/VideoCard.jpg" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <div className="flex justify-between">
                <div className="w-3/4">
                  <p className="font-bold">Title bài 1</p>
                  <p className="text-[#737373]">
                    Thực hiện 30s với nhịp điệu vừa phải nhịp tim vừa phải.Chú ý gồng bụng và giữ phom đúng.
                  </p>
                </div>
                <Checkbox className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">
            Circuit 2: Thân Trên
          </div>
          <p className="text-[#737373] text-xl">
            Cycle 1: complete all excercises, 1 mins per excercises, no rest between each excercises Rest 30-45s after
            one Cycle Repeat Cycle 2, Cycle 3
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={`menu-${index}`} className="text-xl">
              <div className="relative group">
                <Image src="/temp/VideoCard.jpg" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <div className="flex justify-between">
                <div className="w-3/4">
                  <p className="font-bold">Title bài 1</p>
                  <p className="text-[#737373]">
                    Thực hiện 30s với nhịp điệu vừa phải nhịp tim vừa phải.Chú ý gồng bụng và giữ phom đúng.
                  </p>
                </div>
                <Checkbox className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
