"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import ImageTitle from "@/assets/image/ImageTitle.png"
import { Checkbox } from "@/components/ui/checkbox"
import Body from "@/assets/image/Body.png"
import MenuDetail from "@/assets/image/MenuDetail.png"

export default function BodyQuiz() {
  const form = useForm({})

  const onSubmit = (data: any) => {
    console.log("Form Data:", data)
  }
  return (
    <div className="p-14 max-w-screen-3xl mx-auto mb-20">
      <div className="bg-[#FFF7F8] p-8 rounded-[10px] pb-28">
        <div className="relative w-full aspect-[9/4]">
          <Image src="/body-quiz-image.jpg" alt="Body Quiz Image" fill objectFit="cover" className="rounded-[10px]" />
        </div>
        <div className="w-full flex flex-col gap-5 mt-20">
          <div className="xl:w-[400px] max-lg:w-full mb-10">
            <div className="font-[family-name:var(--font-coiny)] text-3xl text-text">Shefit.vn Body Quiz 1:1</div>
            <p className="text-gray-500">
              Khách hàng vui lòng trả lời các câu hỏi sau để HLV Shefit có thể lên Giáo Trình Tập & Thực Đơn cá nhân hóa
              phù hợp nhất. Đảm bảo đạt được body tỷ lệ đẹp nhất với phom dáng người.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-normal">1. Tên của bạn?</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">2. Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">
                      3. Chị vui lòng trả lời về tính trạng thai sản? 
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">4. Chiều Cao Của Chị (cm) ?</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">5. Tuổi của chị ?</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">6. Cân Nặng Hiện Tại Của Chị (kg)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">7. Mục Tiêu Của Chị Về Cân Nặng</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">8. Vóc Dáng Hiện Tại Của Chị?</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-14 mx-auto mt-6">
                        {Array.from({ length: 12 }).map((_, index) => (
                          <div key={`image-${index}`} className="flex items-center flex-col">
                            <Image src={ImageTitle} alt="" className="aspect-[3/3] object-cover rounded-xl" />
                            <Checkbox className="mt-2 size-8" />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">9. Vóc Dáng Mong Muốn Của Chị?</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-14 mx-auto mt-6">
                        {Array.from({ length: 12 }).map((_, index) => (
                          <div key={`image-${index}`} className="flex items-center flex-col">
                            <Image src={ImageTitle} alt="" className="aspect-[3/3] object-cover rounded-xl" />
                            <Checkbox className="mt-2 size-8" />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full mb-10">
                <div className="font-[family-name:var(--font-coiny)] text-3xl text-text">Số đo các vòng</div>
                <p className="">
                  Hãy chuẩn bị 1 thước dây để đo chính xác nhất các vòng, điều này sẽ giúp HLV Shefit xác định phom dáng
                  của chị
                </p>
                <Image
                  src={Body}
                  alt=""
                  className="mt-5 aspect-[3/3] object-cover rounded-xl xl:size-[875px] mx-auto"
                />
              </div>
              <div>
                <div className="font-[family-name:var(--font-coiny)] text-3xl text-text">Câu hỏi phần thực đơn</div>
                <Image src={MenuDetail} alt="" className="mt-5 aspect-[8/2] object-cover rounded-3xl" />
              </div>
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">11. Chị Có Bị Dị Ứng Với Thức Ăn Nào Không?</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">12. Chị Thường Ăn Nhiều Thành Phần Gì?</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">
                      13. Trong quá khứ chị đã từng thử ăn kiêng theo chế độ nào?
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl  font-normal">
                      14. Chị Có Hay Ăn Vặt Không?  (Bánh Tráng Trộn, Trà Sữa, Bánh Ngọt...)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Câu trả lời" className="text-lg text-gray-500 bg-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-button text-white py-2 px-4 rounded-full w-full xl:h-20 text-xl">
                Gửi
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
