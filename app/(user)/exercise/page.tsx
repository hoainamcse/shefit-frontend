import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
export default function Exercise() {
  return (
    <div className="space-y-10 px-14">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-3xl text-text font-[family-name:var(--font-coiny)] hover:no-underline">
            Khóa tập của bạn
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-500 text-xl">Bạn chưa có khóa tập nào</div>
            <Link href="/exercise/detail">
              <Button className="bg-button text-white text-xl w-full rounded-full h-14">Thêm khóa tập</Button>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-3xl text-text font-[family-name:var(--font-coiny)] hover:no-underline">
            Thực đơn của bạn
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-500 text-xl">Bạn chưa có thực đơn nào</div>
            <Link href="/exercise/detail">
              <Button className="bg-button text-white text-xl w-full rounded-full h-14">Thêm thực đơn</Button>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-3xl text-text font-[family-name:var(--font-coiny)] hover:no-underline">
            Động tác
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-500 text-xl">Bạn chưa có động tác nào</div>
            <Link href="/exercise/detail">
              <Button className="bg-button text-white text-xl w-full rounded-full h-14">Thêm động tác</Button>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
