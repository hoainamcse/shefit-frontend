import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ListMealPlans from "./_components/ListMealPlans"
import ListExercises from "./_components/ListExercises"
import ListCourses from "./_components/ListCourses"

export default function Exercise() {
  return (
    <div className="space-y-10 px-14">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-3xl text-text font-[family-name:var(--font-coiny)] hover:no-underline">
            Khóa tập của bạn
          </AccordionTrigger>
          <AccordionContent>
            <ListCourses />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-3xl text-text font-[family-name:var(--font-coiny)] hover:no-underline">
            Thực đơn của bạn
          </AccordionTrigger>
          <AccordionContent>
            <ListMealPlans />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-3xl text-text font-[family-name:var(--font-coiny)] hover:no-underline">
            Động tác
          </AccordionTrigger>
          <AccordionContent>
            <ListExercises />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
