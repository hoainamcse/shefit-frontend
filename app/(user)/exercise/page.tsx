import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
export default function Exercise() {
  return (
    <div className="space-y-10">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-3xl text-text font-[family-name:var(--font-coiny)] hover:no-underline">
            Khóa tập của bạn
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-500 text-xl">Bạn chưa có khóa tập nào</div>
            <Button className="bg-button text-white text-xl w-full rounded-full h-14">Thêm khóa tập</Button>
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
            <Button className="bg-button text-white text-xl w-full rounded-full h-14">Thêm thực đơn</Button>
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
            <Button className="bg-button text-white text-xl w-full rounded-full h-14">Thêm động tác</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
