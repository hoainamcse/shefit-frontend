import Image from "next/image";

import { Button } from "@/components/ui/button";
import { RightArrowIcon } from "@/components/icons/right-arrow-icon";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BodyQuiz() {
  return (
    <div>
      <div className="bg-[#FFAEB01A] py-[33px] px-[87px]">
        <div className="text-center text-[#000000] text-[30px] leading-[33px] font-[Coiny] mb-7">
          Body Quiz
        </div>
        <div className="text-center text-[#737373] text-[20px] leading-[30px] px-20 mb-7">
          Làm bảng câu hỏi để Shefit giúp chị hiểu rõ mình thuộc loại nào trong
          5 loại phom dáng, các chỉ số hình thể cần cải thiện và lộ trình “độ
          dáng” phù hợp nhất
        </div>

        <div className="relative w-full aspect-[9/2]">
          <Image
            src="/body-quiz-image.jpg"
            alt="Body Quiz Image"
            fill
            objectFit="cover"
          />
        </div>

        <div className="text-center mt-7">
          <Link href="/account/quiz">
            <Button className="bg-[#13D8A7] w-[238px] h-[45px] text-[20px] leading-[30px] font-normal pt-[10px] pb-[6px]">
              Làm Quiz
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-20 px-[60px]">
        <div className="text-[#FF7873] text-[30px] leading-[33px] font-[Coiny] mb-10">
          Kết quả
        </div>
        <div className="flex flex-col gap-[18px]">
          <Accordion
            type="single"
            collapsible
            className="w-full border border-[#E2E2E2] rounded-[10px] px-2.5"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-[13px]">
                <div className="text-xl font-normal">Kết quả ngày 7/3/2025</div>
              </AccordionTrigger>
              <AccordionContent>
                <div>Content</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            className="w-full border border-[#E2E2E2] rounded-[10px] px-2.5"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-[13px]">
                <div className="text-xl font-normal">Kết quả ngày 7/3/2025</div>
              </AccordionTrigger>
              <AccordionContent>
                <div>Content</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
